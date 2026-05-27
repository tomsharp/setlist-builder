import { generateTileSet, tilesMatch } from './tiles';
import { buildLayout, computeFree } from './layout';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function createGame() {
  const positions = buildLayout();
  const tileSet = shuffle(generateTileSet());

  // Assign tiles to positions (positions.length should be <= tileSet.length)
  const boardTiles = positions.slice(0, tileSet.length).map((pos, i) => ({
    ...tileSet[i],
    col: pos.col,
    row: pos.row,
    layer: pos.layer,
    removed: false,
  }));

  const freeTiles = computeFree(boardTiles.filter(t => !t.removed));

  return {
    tiles: boardTiles,
    freeTiles,
    selected: null,
    score: 0,
    moves: 0,
    startTime: Date.now(),
    status: 'playing', // 'playing' | 'won' | 'stuck'
    history: [],
  };
}

export function selectTile(game, tileId) {
  const tile = game.tiles.find(t => t.id === tileId);
  if (!tile || tile.removed) return game;
  if (!game.freeTiles.has(tileId)) return game;

  // Deselect if clicking the same tile
  if (game.selected === tileId) {
    return { ...game, selected: null };
  }

  // If no tile selected, select this one
  if (game.selected === null) {
    return { ...game, selected: tileId };
  }

  // Try to match
  const selectedTile = game.tiles.find(t => t.id === game.selected);
  if (tilesMatch(selectedTile, tile)) {
    // Match! Remove both
    const newTiles = game.tiles.map(t =>
      t.id === tileId || t.id === game.selected
        ? { ...t, removed: true }
        : t
    );
    const remaining = newTiles.filter(t => !t.removed);
    const freeTiles = computeFree(remaining);
    const newScore = game.score + 10;
    const newMoves = game.moves + 1;

    const status = remaining.length === 0
      ? 'won'
      : checkStuck(remaining, freeTiles)
      ? 'stuck'
      : 'playing';

    return {
      ...game,
      tiles: newTiles,
      freeTiles,
      selected: null,
      score: newScore,
      moves: newMoves,
      status,
      history: [...game.history, { type: 'match', a: game.selected, b: tileId }],
    };
  }

  // No match — select the new tile instead
  return { ...game, selected: tileId };
}

function checkStuck(tiles, freeTiles) {
  const freeTileList = tiles.filter(t => freeTiles.has(t.id));
  for (let i = 0; i < freeTileList.length; i++) {
    for (let j = i + 1; j < freeTileList.length; j++) {
      if (tilesMatch(freeTileList[i], freeTileList[j])) return false;
    }
  }
  return true;
}

export function undoMove(game) {
  if (game.history.length === 0) return game;
  const last = game.history[game.history.length - 1];
  if (last.type !== 'match') return game;

  const newTiles = game.tiles.map(t =>
    t.id === last.a || t.id === last.b
      ? { ...t, removed: false }
      : t
  );
  const remaining = newTiles.filter(t => !t.removed);
  const freeTiles = computeFree(remaining);

  return {
    ...game,
    tiles: newTiles,
    freeTiles,
    selected: null,
    score: Math.max(0, game.score - 10),
    moves: Math.max(0, game.moves - 1),
    status: 'playing',
    history: game.history.slice(0, -1),
  };
}

export function getHint(game) {
  const freeTileList = game.tiles.filter(t => !t.removed && game.freeTiles.has(t.id));
  for (let i = 0; i < freeTileList.length; i++) {
    for (let j = i + 1; j < freeTileList.length; j++) {
      if (tilesMatch(freeTileList[i], freeTileList[j])) {
        return [freeTileList[i].id, freeTileList[j].id];
      }
    }
  }
  return null;
}
