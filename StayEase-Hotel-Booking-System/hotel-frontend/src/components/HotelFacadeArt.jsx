export default function HotelFacadeArt({ className = "" }) {
  // Deterministic "random" lit-window pattern so it's stable across renders
  const litPattern = [
    1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1,
    0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0,
    1, 1, 0, 1, 0, 1, 1, 0, 1, 1,
  ];

  const cols = 12;
  const rows = 5;
  const winW = 42;
  const winH = 56;
  const gapX = 26;
  const gapY = 30;
  const startX = 60;
  const startY = 90;

  const windows = [];
  let i = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const lit = litPattern[i % litPattern.length] === 1;
      windows.push(
        <rect
          key={`${r}-${c}`}
          x={startX + c * (winW + gapX)}
          y={startY + r * (winH + gapY)}
          width={winW}
          height={winH}
          rx={3}
          fill={lit ? "var(--color-brass-light)" : "#0e1815"}
          fillOpacity={lit ? 0.85 : 0.9}
        />
      );
      i++;
    }
  }

  return (
    <svg
      viewBox="0 0 1200 560"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      preserveAspectRatio="xMidYMax slice"
    >
      <defs>
        <radialGradient id="skyGlow" cx="50%" cy="0%" r="80%">
          <stop offset="0%" stopColor="#2c3f36" />
          <stop offset="100%" stopColor="#16241f" />
        </radialGradient>
        <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="fade" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#16241f" stopOpacity="1" />
          <stop offset="35%" stopColor="#16241f" stopOpacity="0" />
        </linearGradient>
      </defs>

      <rect width="1200" height="560" fill="url(#skyGlow)" />

      {/* moon */}
      <circle cx="1050" cy="70" r="34" fill="var(--color-brass-light)" opacity="0.5" filter="url(#softGlow)" />

      {/* building block */}
      <rect x="30" y="70" width="1140" height="470" rx="6" fill="#0e1815" />
      <g filter="url(#softGlow)">{windows}</g>

      {/* entrance canopy */}
      <rect x="520" y="500" width="160" height="60" fill="#0b1310" />
      <rect x="500" y="486" width="200" height="14" rx="3" fill="var(--color-brass)" />
      <text
        x="600"
        y="480"
        textAnchor="middle"
        fontFamily="Fraunces, serif"
        fontSize="22"
        fill="var(--color-brass-light)"
        letterSpacing="2"
      >
        STAYEASE
      </text>

      {/* ground fade so page content beneath reads cleanly */}
      <rect width="1200" height="560" fill="url(#fade)" />
    </svg>
  );
}
