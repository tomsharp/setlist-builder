import React from 'react';
import { TILE_DISPLAY, SUITS } from '../tiles';

const TILE_WIDTH = 44;
const TILE_HEIGHT = 56;
const LAYER_OFFSET_X = 3;
const LAYER_OFFSET_Y = -3;
const GRID_UNIT = 22; // half-tile unit

export function tileToPixel(col, row, layer) {
  return {
    x: col * GRID_UNIT + layer * LAYER_OFFSET_X,
    y: row * GRID_UNIT + layer * LAYER_OFFSET_Y,
  };
}

export { TILE_WIDTH, TILE_HEIGHT, GRID_UNIT };

export default function Tile({ tile, isSelected, isFree, isHinted, onTap }) {
  const display = TILE_DISPLAY[tile.type] || { symbol: tile.type, label: tile.type, color: '#333', bg: '#fff' };
  const { x, y } = tileToPixel(tile.col, tile.row, tile.layer);

  const handleClick = () => {
    if (isFree) onTap(tile.id);
  };

  const bgColor = isSelected
    ? '#fffde7'
    : isHinted
    ? '#fff9c4'
    : isFree
    ? (display.bg || '#fffbf0')
    : '#d0d0c8';

  const borderColor = isSelected
    ? '#f9a825'
    : isHinted
    ? '#fbc02d'
    : isFree
    ? '#8b7355'
    : '#9e9e8e';

  const shadow = isFree
    ? isSelected
      ? 'drop-shadow(2px 2px 4px rgba(249,168,37,0.7))'
      : '2px 2px 4px rgba(0,0,0,0.5)'
    : 'none';

  // Determine suit label
  let suitLabel = '';
  if (tile.suit === SUITS.BAMBOO) suitLabel = '竹';
  else if (tile.suit === SUITS.CIRCLES) suitLabel = '筒';
  else if (tile.suit === SUITS.CHARACTERS) suitLabel = '萬';

  return (
    <div
      onClick={handleClick}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: TILE_WIDTH,
        height: TILE_HEIGHT,
        backgroundColor: bgColor,
        border: `2px solid ${borderColor}`,
        borderRadius: 6,
        cursor: isFree ? 'pointer' : 'default',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        filter: isFree ? shadow : 'none',
        boxShadow: isFree ? '2px 2px 4px rgba(0,0,0,0.4)' : '1px 1px 2px rgba(0,0,0,0.2)',
        opacity: isFree ? 1 : 0.75,
        zIndex: tile.layer * 100 + (isSelected ? 50 : 0),
        transition: 'background-color 0.15s, border-color 0.15s',
        overflow: 'hidden',
      }}
    >
      {suitLabel && (
        <div style={{
          fontSize: 8,
          color: display.color,
          opacity: 0.6,
          lineHeight: 1,
          marginBottom: 1,
        }}>
          {suitLabel}
        </div>
      )}
      <div style={{
        fontSize: tile.suit === SUITS.BAMBOO || tile.suit === SUITS.CIRCLES ? 22 : 24,
        color: display.color,
        lineHeight: 1,
        fontWeight: tile.suit === SUITS.CHARACTERS || tile.suit === SUITS.WINDS || tile.suit === SUITS.DRAGONS ? 'bold' : 'normal',
      }}>
        {display.symbol}
      </div>
    </div>
  );
}
