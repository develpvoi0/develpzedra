export function PixelSprite({ map, palette, cell = 4, className }: {
  map: string;
  palette: Record<string, string>;
  cell?: number;
  className?: string;
}) {
  const rows = map.trim().split("\n");
  return (
    <svg
      viewBox={`0 0 ${rows[0].length * cell} ${rows.length * cell}`}
      shapeRendering="crispEdges"
      className={className}
      aria-hidden
    >
      {rows.flatMap((row, y) =>
        [...row].map((ch, x) =>
          palette[ch] ? (
            <rect
              key={`${x}-${y}`}
              x={x * cell}
              y={y * cell}
              width={cell}
              height={cell}
              fill={palette[ch]}
            />
          ) : null,
        ),
      )}
    </svg>
  );
}