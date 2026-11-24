import React, { useMemo } from 'react';

const GRID = 5;

// FNV-1a 32 bits hash
const hashString = (value) => {
  let hash = 0x811c9dc5;
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
};

// Drop-in replacement for react-identicons: a symmetric 5x5 identicon
// whose pattern and color are derived from the given string.
const Identicon = ({ string = '', size = 32, fg, bg = 'transparent', className, style }) => {
  const { cells, color } = useMemo(() => {
    const hash = hashString(String(string));
    const second = hashString(`${string}#`);
    const bits = [];
    for (let row = 0; row < GRID; row++) {
      for (let col = 0; col < Math.ceil(GRID / 2); col++) {
        const bitIndex = row * Math.ceil(GRID / 2) + col;
        const source = bitIndex < 32 ? hash : second;
        if ((source >>> (bitIndex % 32)) & 1) {
          bits.push([col, row]);
          if (col !== GRID - 1 - col) bits.push([GRID - 1 - col, row]);
        }
      }
    }
    return { cells: bits, color: fg || `hsl(${hash % 360}, 65%, 50%)` };
  }, [string, fg]);

  const pixelSize = Number(size) || 32;

  return (
    <svg
      width={pixelSize}
      height={pixelSize}
      viewBox={`0 0 ${GRID} ${GRID}`}
      className={className}
      style={{ display: 'block', backgroundColor: bg, ...style }}
      shapeRendering="crispEdges"
      role="img"
      aria-label={String(string)}
    >
      {cells.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={color} />
      ))}
    </svg>
  );
};

export default Identicon;
