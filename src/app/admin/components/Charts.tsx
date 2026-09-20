import { formatEuro } from "@/lib/format";

/** Histogramme vertical (montants par mois). SVG pur, responsive. */
export function BarChart({
  data,
  unit = "€",
}: {
  data: { label: string; value: number }[];
  unit?: string;
}) {
  const max = Math.max(1, ...data.map((d) => d.value));
  const barW = 44;
  const gap = 22;
  const chartH = 180;
  const topPad = 26;
  const bottomPad = 30;
  const W = data.length * (barW + gap) + gap;
  const H = chartH + topPad + bottomPad;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      role="img"
      aria-label="Montant des dons par mois"
      preserveAspectRatio="xMidYMid meet"
      className="max-w-full"
    >
      <defs>
        <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e58fa1" />
          <stop offset="100%" stopColor="#c25f78" />
        </linearGradient>
      </defs>
      {data.map((d, i) => {
        const h = Math.round((d.value / max) * chartH);
        const x = gap + i * (barW + gap);
        const y = topPad + (chartH - h);
        return (
          <g key={i}>
            <rect
              x={x}
              y={topPad}
              width={barW}
              height={chartH}
              rx={8}
              fill="#f6ced7"
              opacity={0.4}
            />
            <rect x={x} y={y} width={barW} height={h} rx={8} fill="url(#barGrad)" />
            <text
              x={x + barW / 2}
              y={y - 7}
              textAnchor="middle"
              fontSize="12"
              fontWeight="600"
              fill="#4a3542"
            >
              {d.value > 0 ? (unit === "€" ? formatEuro(d.value) : d.value) : ""}
            </text>
            <text
              x={x + barW / 2}
              y={H - 10}
              textAnchor="middle"
              fontSize="12"
              fill="#8b7b85"
            >
              {d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/** Barres horizontales (répartition par campagne). */
export function HBars({
  data,
}: {
  data: { label: string; value: number; color?: string }[];
}) {
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <div className="space-y-3">
      {data.map((d, i) => (
        <div key={i}>
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="font-medium text-plum">{d.label}</span>
            <span className="font-semibold text-plum">{formatEuro(d.value)}</span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-rose-100">
            <div
              className="h-full rounded-full"
              style={{
                width: `${Math.max(3, (d.value / max) * 100)}%`,
                background: d.color
                  ? `linear-gradient(90deg, ${d.color}, ${d.color}cc)`
                  : "linear-gradient(90deg, #e58fa1, #c25f78)",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
