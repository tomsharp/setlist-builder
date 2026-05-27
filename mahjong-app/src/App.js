import React, { useState, useEffect, useCallback, useRef } from 'react';
import Board from './components/Board';
import { createGame, selectTile, undoMove, getHint } from './gameLogic';
import { TILE_WIDTH, TILE_HEIGHT, tileToPixel } from './components/Tile';

// Compute board bounding box
function getBoardBounds(tiles) {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const t of tiles) {
    const { x, y } = tileToPixel(t.col, t.row, t.layer);
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x + TILE_WIDTH);
    maxY = Math.max(maxY, y + TILE_HEIGHT);
  }
  return { minX, minY, width: maxX - minX, height: maxY - minY };
}

function formatTime(ms) {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  return `${m}:${String(s % 60).padStart(2, '0')}`;
}

export default function App() {
  const [game, setGame] = useState(() => createGame());
  const [hintTiles, setHintTiles] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [windowSize, setWindowSize] = useState({ w: window.innerWidth, h: window.innerHeight });
  const hintTimeout = useRef(null);

  // Timer
  useEffect(() => {
    if (game.status !== 'playing') return;
    const iv = setInterval(() => setElapsed(Date.now() - game.startTime), 1000);
    return () => clearInterval(iv);
  }, [game.status, game.startTime]);

  // Window resize
  useEffect(() => {
    const onResize = () => setWindowSize({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Clear hint after 3s
  useEffect(() => {
    if (hintTiles) {
      hintTimeout.current = setTimeout(() => setHintTiles(null), 3000);
      return () => clearTimeout(hintTimeout.current);
    }
  }, [hintTiles]);

  const handleTileTap = useCallback((tileId) => {
    setHintTiles(null);
    setGame(g => selectTile(g, tileId));
  }, []);

  const handleNewGame = useCallback(() => {
    setGame(createGame());
    setHintTiles(null);
    setElapsed(0);
  }, []);

  const handleUndo = useCallback(() => {
    setHintTiles(null);
    setGame(g => undoMove(g));
  }, []);

  const handleHint = useCallback(() => {
    const hint = getHint(game);
    setHintTiles(hint);
  }, [game]);

  // Compute layout scale to fit board in viewport
  const HEADER_HEIGHT = 60;
  const FOOTER_HEIGHT = 64;
  const availW = windowSize.w;
  const availH = windowSize.h - HEADER_HEIGHT - FOOTER_HEIGHT;

  const visibleTiles = game.tiles.filter(t => !t.removed);
  const bounds = visibleTiles.length > 0 ? getBoardBounds(game.tiles) : { minX: 0, minY: 0, width: 700, height: 500 };

  const scaleX = availW / (bounds.width + 20);
  const scaleY = availH / (bounds.height + 20);
  const scale = Math.min(scaleX, scaleY, 1.2);

  const scaledW = bounds.width * scale;
  const scaledH = bounds.height * scale;
  const offsetX = (availW - scaledW) / 2 / scale - bounds.minX;
  const offsetY = (availH - scaledH) / 2 / scale - bounds.minY;

  const remaining = game.tiles.filter(t => !t.removed).length;
  const total = game.tiles.length;

  return (
    <div style={{
      height: '100dvh',
      width: '100vw',
      display: 'flex',
      flexDirection: 'column',
      background: 'linear-gradient(135deg, #1a472a 0%, #2d5a27 50%, #1a472a 100%)',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        height: HEADER_HEIGHT,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        background: 'rgba(0,0,0,0.3)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        flexShrink: 0,
      }}>
        <div style={{ color: '#fff', fontSize: 12, lineHeight: 1.4 }}>
          <div style={{ fontWeight: 'bold', fontSize: 16 }}>🀄 Mahjong</div>
          <div style={{ opacity: 0.8 }}>{remaining}/{total} tiles</div>
        </div>
        <div style={{ color: '#fff', textAlign: 'center', fontSize: 12 }}>
          <div style={{ fontSize: 20, fontWeight: 'bold', color: '#ffd54f' }}>{game.score}</div>
          <div style={{ opacity: 0.8 }}>score</div>
        </div>
        <div style={{ color: '#fff', textAlign: 'right', fontSize: 12 }}>
          <div style={{ fontSize: 16, fontWeight: 'bold' }}>{formatTime(elapsed)}</div>
          <div style={{ opacity: 0.8 }}>{game.moves} moves</div>
        </div>
      </div>

      {/* Board area */}
      <div style={{
        flex: 1,
        position: 'relative',
        overflow: 'hidden',
        minHeight: 0,
      }}>
        {game.status === 'playing' || game.status === 'stuck' ? (
          <Board
            game={game}
            onTileTap={handleTileTap}
            hintTiles={hintTiles}
            scale={scale}
            boardOffset={{ x: offsetX, y: offsetY }}
          />
        ) : null}

        {/* Overlay messages */}
        {game.status === 'won' && (
          <div style={overlayStyle}>
            <div style={overlayCardStyle}>
              <div style={{ fontSize: 64 }}>🎉</div>
              <div style={{ fontSize: 28, fontWeight: 'bold', color: '#2d7a2d', marginBottom: 8 }}>You Won!</div>
              <div style={{ fontSize: 16, color: '#555', marginBottom: 4 }}>Score: <b>{game.score}</b></div>
              <div style={{ fontSize: 16, color: '#555', marginBottom: 16 }}>Time: <b>{formatTime(elapsed)}</b></div>
              <button onClick={handleNewGame} style={btnStyle('#2d7a2d')}>Play Again</button>
            </div>
          </div>
        )}

        {game.status === 'stuck' && (
          <div style={overlayStyle}>
            <div style={overlayCardStyle}>
              <div style={{ fontSize: 64 }}>😔</div>
              <div style={{ fontSize: 24, fontWeight: 'bold', color: '#c62828', marginBottom: 8 }}>No More Moves</div>
              <div style={{ fontSize: 15, color: '#555', marginBottom: 16 }}>
                {remaining} tiles remaining
              </div>
              <button onClick={handleNewGame} style={btnStyle('#c62828')}>New Game</button>
              {game.history.length > 0 && (
                <button onClick={handleUndo} style={{ ...btnStyle('#555'), marginTop: 8 }}>Undo Last Move</button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer controls */}
      <div style={{
        height: FOOTER_HEIGHT,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        background: 'rgba(0,0,0,0.3)',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        padding: '0 8px',
        flexShrink: 0,
      }}>
        <FooterBtn label="New" icon="🔄" onClick={handleNewGame} />
        <FooterBtn label="Undo" icon="↩️" onClick={handleUndo} disabled={game.history.length === 0} />
        <FooterBtn label="Hint" icon="💡" onClick={handleHint} disabled={game.status !== 'playing'} />
      </div>
    </div>
  );
}

function FooterBtn({ label, icon, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        background: 'none',
        border: 'none',
        color: disabled ? 'rgba(255,255,255,0.3)' : '#fff',
        fontSize: 12,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        padding: '8px 16px',
        cursor: disabled ? 'default' : 'pointer',
        borderRadius: 8,
      }}
    >
      <span style={{ fontSize: 22 }}>{icon}</span>
      {label}
    </button>
  );
}

const overlayStyle = {
  position: 'absolute',
  inset: 0,
  background: 'rgba(0,0,0,0.6)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
};

const overlayCardStyle = {
  background: '#fff',
  borderRadius: 16,
  padding: '32px 40px',
  textAlign: 'center',
  boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

function btnStyle(color) {
  return {
    background: color,
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    padding: '12px 32px',
    fontSize: 16,
    fontWeight: 'bold',
    cursor: 'pointer',
    width: '100%',
  };
}
