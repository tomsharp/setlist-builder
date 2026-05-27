// Tile suits and values
export const SUITS = {
  BAMBOO: 'bamboo',
  CIRCLES: 'circles',
  CHARACTERS: 'characters',
  WINDS: 'winds',
  DRAGONS: 'dragons',
  FLOWERS: 'flowers',
  SEASONS: 'seasons',
};

// Tile symbols/labels
export const TILE_LABELS = {
  bamboo: ['1b','2b','3b','4b','5b','6b','7b','8b','9b'],
  circles: ['1c','2c','3c','4c','5c','6c','7c','8c','9c'],
  characters: ['1m','2m','3m','4m','5m','6m','7m','8m','9m'],
  winds: ['E','S','W','N'],
  dragons: ['中','發','白'],
  flowers: ['🌸','🌺','🌹','🌷'],
  seasons: ['春','夏','秋','冬'],
};

// Tile display (emoji or unicode)
export const TILE_DISPLAY = {
  // Bamboo
  '1b': { symbol: '🎋', label: '1', color: '#2d7a2d', bg: '#e8f5e9' },
  '2b': { symbol: '🎍', label: '2', color: '#2d7a2d', bg: '#e8f5e9' },
  '3b': { symbol: '3', label: '3', color: '#2d7a2d', bg: '#e8f5e9' },
  '4b': { symbol: '4', label: '4', color: '#2d7a2d', bg: '#e8f5e9' },
  '5b': { symbol: '5', label: '5', color: '#2d7a2d', bg: '#e8f5e9' },
  '6b': { symbol: '6', label: '6', color: '#2d7a2d', bg: '#e8f5e9' },
  '7b': { symbol: '7', label: '7', color: '#2d7a2d', bg: '#e8f5e9' },
  '8b': { symbol: '8', label: '8', color: '#2d7a2d', bg: '#e8f5e9' },
  '9b': { symbol: '9', label: '9', color: '#2d7a2d', bg: '#e8f5e9' },
  // Circles
  '1c': { symbol: '①', label: '1', color: '#1565c0', bg: '#e3f2fd' },
  '2c': { symbol: '②', label: '2', color: '#1565c0', bg: '#e3f2fd' },
  '3c': { symbol: '③', label: '3', color: '#1565c0', bg: '#e3f2fd' },
  '4c': { symbol: '④', label: '4', color: '#1565c0', bg: '#e3f2fd' },
  '5c': { symbol: '⑤', label: '5', color: '#1565c0', bg: '#e3f2fd' },
  '6c': { symbol: '⑥', label: '6', color: '#1565c0', bg: '#e3f2fd' },
  '7c': { symbol: '⑦', label: '7', color: '#1565c0', bg: '#e3f2fd' },
  '8c': { symbol: '⑧', label: '8', color: '#1565c0', bg: '#e3f2fd' },
  '9c': { symbol: '⑨', label: '9', color: '#1565c0', bg: '#e3f2fd' },
  // Characters (万)
  '1m': { symbol: '一', label: '1万', color: '#b71c1c', bg: '#ffebee' },
  '2m': { symbol: '二', label: '2万', color: '#b71c1c', bg: '#ffebee' },
  '3m': { symbol: '三', label: '3万', color: '#b71c1c', bg: '#ffebee' },
  '4m': { symbol: '四', label: '4万', color: '#b71c1c', bg: '#ffebee' },
  '5m': { symbol: '五', label: '5万', color: '#b71c1c', bg: '#ffebee' },
  '6m': { symbol: '六', label: '6万', color: '#b71c1c', bg: '#ffebee' },
  '7m': { symbol: '七', label: '7万', color: '#b71c1c', bg: '#ffebee' },
  '8m': { symbol: '八', label: '8万', color: '#b71c1c', bg: '#ffebee' },
  '9m': { symbol: '九', label: '9万', color: '#b71c1c', bg: '#ffebee' },
  // Winds
  'E': { symbol: '東', label: 'East', color: '#4a148c', bg: '#f3e5f5' },
  'S': { symbol: '南', label: 'South', color: '#4a148c', bg: '#f3e5f5' },
  'W': { symbol: '西', label: 'West', color: '#4a148c', bg: '#f3e5f5' },
  'N': { symbol: '北', label: 'North', color: '#4a148c', bg: '#f3e5f5' },
  // Dragons
  '中': { symbol: '中', label: 'Chun', color: '#b71c1c', bg: '#fff3e0' },
  '發': { symbol: '發', label: 'Fa', color: '#2d7a2d', bg: '#fff3e0' },
  '白': { symbol: '白', label: 'Bai', color: '#37474f', bg: '#fff3e0' },
  // Flowers (any matches any)
  '🌸': { symbol: '🌸', label: 'Plum', color: '#e91e63', bg: '#fce4ec' },
  '🌺': { symbol: '🌺', label: 'Orchid', color: '#e91e63', bg: '#fce4ec' },
  '🌹': { symbol: '🌹', label: 'Chrysanthemum', color: '#e91e63', bg: '#fce4ec' },
  '🌷': { symbol: '🌷', label: 'Bamboo', color: '#e91e63', bg: '#fce4ec' },
  // Seasons (any matches any)
  '春': { symbol: '春', label: 'Spring', color: '#e65100', bg: '#fff8e1' },
  '夏': { symbol: '夏', label: 'Summer', color: '#e65100', bg: '#fff8e1' },
  '秋': { symbol: '秋', label: 'Autumn', color: '#e65100', bg: '#fff8e1' },
  '冬': { symbol: '冬', label: 'Winter', color: '#e65100', bg: '#fff8e1' },
};

// Generate the full 144-tile set (4 of each suit tile, 1 each flower/season)
export function generateTileSet() {
  const tiles = [];
  let id = 0;

  const addTiles = (suit, values, count) => {
    for (const v of values) {
      for (let i = 0; i < count; i++) {
        tiles.push({ id: id++, type: v, suit });
      }
    }
  };

  addTiles(SUITS.BAMBOO, TILE_LABELS.bamboo, 4);
  addTiles(SUITS.CIRCLES, TILE_LABELS.circles, 4);
  addTiles(SUITS.CHARACTERS, TILE_LABELS.characters, 4);
  addTiles(SUITS.WINDS, TILE_LABELS.winds, 4);
  addTiles(SUITS.DRAGONS, TILE_LABELS.dragons, 4);
  addTiles(SUITS.FLOWERS, TILE_LABELS.flowers, 1);
  addTiles(SUITS.SEASONS, TILE_LABELS.seasons, 1);

  return tiles; // 144 tiles
}

export function tilesMatch(a, b) {
  if (a.id === b.id) return false;
  // Flowers match any flower
  if (a.suit === SUITS.FLOWERS && b.suit === SUITS.FLOWERS) return true;
  // Seasons match any season
  if (a.suit === SUITS.SEASONS && b.suit === SUITS.SEASONS) return true;
  // Otherwise same type
  return a.type === b.type;
}
