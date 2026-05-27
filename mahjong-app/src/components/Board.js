import React, { useMemo } from 'react';
import Tile from './Tile';

export default function Board({ game, onTileTap, hintTiles, scale, boardOffset }) {
  const visibleTiles = useMemo(
    () => game.tiles.filter(t => !t.removed).sort((a, b) => a.layer - b.layer || a.row - b.row),
    [game.tiles]
  );

  const hintSet = new Set(hintTiles || []);

  return (
    <div
      style={{
        position: 'absolute',
        transformOrigin: 'top left',
        transform: `scale(${scale}) translate(${boardOffset.x}px, ${boardOffset.y}px)`,
      }}
    >
      {visibleTiles.map(tile => (
        <Tile
          key={tile.id}
          tile={tile}
          isSelected={game.selected === tile.id}
          isFree={game.freeTiles.has(tile.id)}
          isHinted={hintSet.has(tile.id)}
          onTap={onTileTap}
        />
      ))}
    </div>
  );
}
