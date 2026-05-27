// Classic mahjong solitaire "Turtle" layout
// Each tile: [layer, col, row] — col/row in half-tile units for overlapping
// layer 0 = bottom, higher = on top

export function buildLayout() {
  const positions = [];

  // Layer 0: base (main 12x8 grid area, with some extras)
  const layer0 = [
    // Row 0 (top strip)
    [2,6],[4,6],[6,6],[8,6],[10,6],[12,6],[14,6],[16,6],[18,6],[20,6],[22,6],[24,6],
    // Row 2
    [0,10],[2,10],[4,10],[6,10],[8,10],[10,10],[12,10],[14,10],[16,10],[18,10],[20,10],[22,10],[24,10],[26,10],
    // Row 4
    [0,14],[2,14],[4,14],[6,14],[8,14],[10,14],[12,14],[14,14],[16,14],[18,14],[20,14],[22,14],[24,14],[26,14],
    // Row 6
    [0,18],[2,18],[4,18],[6,18],[8,18],[10,18],[12,18],[14,18],[16,18],[18,18],[20,18],[22,18],[24,18],[26,18],
    // Row 8
    [0,22],[2,22],[4,22],[6,22],[8,22],[10,22],[12,22],[14,22],[16,22],[18,22],[20,22],[22,22],[24,22],[26,22],
    // Row 10
    [2,26],[4,26],[6,26],[8,26],[10,26],[12,26],[14,26],[16,26],[18,26],[20,26],[22,26],[24,26],
    // Row 12 (bottom strip)
    [2,30],[4,30],[6,30],[8,30],[10,30],[12,30],[14,30],[16,30],[18,30],[20,30],[22,30],[24,30],
    // Extra single on left row 4
    [-2,18],
    // Extra single on right row 4
    [28,18],
  ];

  // Layer 1
  const layer1 = [
    [4,10],[6,10],[8,10],[10,10],[12,10],[14,10],[16,10],[18,10],[20,10],[22,10],
    [4,14],[6,14],[8,14],[10,14],[12,14],[14,14],[16,14],[18,14],[20,14],[22,14],
    [4,18],[6,18],[8,18],[10,18],[12,18],[14,18],[16,18],[18,18],[20,18],[22,18],
    [4,22],[6,22],[8,22],[10,22],[12,22],[14,22],[16,22],[18,22],[20,22],[22,22],
  ];

  // Layer 2
  const layer2 = [
    [6,12],[8,12],[10,12],[12,12],[14,12],[16,12],[18,12],[20,12],
    [6,16],[8,16],[10,16],[12,16],[14,16],[16,16],[18,16],[20,16],
    [6,20],[8,20],[10,20],[12,20],[14,20],[16,20],[18,20],[20,20],
  ];

  // Layer 3
  const layer3 = [
    [8,14],[10,14],[12,14],[14,14],[16,14],[18,14],
    [8,18],[10,18],[12,18],[14,18],[16,18],[18,18],
  ];

  // Layer 4
  const layer4 = [
    [10,16],[12,16],[14,16],[16,16],
  ];

  // Layer 5 (crown)
  const layer5 = [
    [12,16],[14,16],
  ];

  // Layer 6 (top single)
  const layer6 = [
    [13,16],
  ];

  const addLayer = (coords, layer) => {
    for (const [col, row] of coords) {
      positions.push({ col, row, layer });
    }
  };

  addLayer(layer0, 0);
  addLayer(layer1, 1);
  addLayer(layer2, 2);
  addLayer(layer3, 3);
  addLayer(layer4, 4);
  addLayer(layer5, 5);
  addLayer(layer6, 6);

  return positions;
}

// A tile is "free" (playable) if:
// 1. Nothing is on top of it
// 2. It has at least one open side (left or right)
export function computeFree(boardTiles) {
  const freeIds = new Set();

  for (const tile of boardTiles) {
    if (isFreeTile(tile, boardTiles)) {
      freeIds.add(tile.id);
    }
  }

  return freeIds;
}

export function isFreeTile(tile, boardTiles) {
  const { col, row, layer } = tile;

  // Check if anything is on top
  const coveredAbove = boardTiles.some(other => {
    if (other.id === tile.id) return false;
    if (other.layer !== layer + 1) return false;
    // A tile covers this tile if it overlaps horizontally and vertically
    return Math.abs(other.col - col) < 2 && Math.abs(other.row - row) < 2;
  });

  if (coveredAbove) return false;

  // Check sides: free if no blocking tile exactly to the left OR exactly to the right
  const blockedLeft = boardTiles.some(other => {
    if (other.id === tile.id) return false;
    if (other.layer !== layer) return false;
    return other.col === col - 2 && Math.abs(other.row - row) < 2;
  });

  const blockedRight = boardTiles.some(other => {
    if (other.id === tile.id) return false;
    if (other.layer !== layer) return false;
    return other.col === col + 2 && Math.abs(other.row - row) < 2;
  });

  return !blockedLeft || !blockedRight;
}
