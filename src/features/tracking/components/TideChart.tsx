import type { Reading, TargetRange } from '../types';
import { xForHour, yForValue, smoothPath } from '../lib/chartMath';
import { formatTime } from '../lib/dateUtils';

const MEAL_COLORS: Record<Reading['mealType'], string> = {
  fasting: '#3E7C74',
  breakfast: '#C9A66B',
  lunch: '#7C8CC4',
  dinner: '#9B6B8C',
};

const MEAL_LABELS: Record<Reading['mealType'], string> = {
  fasting: 'Fasting',
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
};

const WIDTH = 600;
const HEIGHT = 220;
const PAD_L = 46;
const PAD_R = 18;
const PAD_T = 18;
const PAD_B = 30;
const CHART_MIN = 40;
const CHART_MAX = 300;

interface TideChartProps {
  readings: Reading[];
  targets: TargetRange;
}

export function TideChart({ readings, targets }: TideChartProps) {
  if (!readings.length) {
    return <div className="chart-empty">No readings yet today. Log one below and it will appear here.</div>;
  }

  const bandTop = yForValue(targets.high, CHART_MIN, CHART_MAX, PAD_T, PAD_B, HEIGHT);
  const bandBottom = yForValue(targets.low, CHART_MIN, CHART_MAX, PAD_T, PAD_B, HEIGHT);

  const sorted = [...readings].sort((a, b) => a.timestamp - b.timestamp);
  const points = sorted.map((r) => {
    const d = new Date(r.timestamp);
    const hour = d.getHours() + d.getMinutes() / 60;
    return {
      x: xForHour(hour, PAD_L, PAD_R, WIDTH),
      y: yForValue(r.value, CHART_MIN, CHART_MAX, PAD_T, PAD_B, HEIGHT),
      reading: r,
    };
  });

  const linePath = points.length > 1 ? smoothPath(points) : '';
  const areaPath =
    points.length > 1
      ? `${linePath} L ${points[points.length - 1].x} ${HEIGHT - PAD_B} L ${points[0].x} ${HEIGHT - PAD_B} Z`
      : '';

  return (
    <svg id="tideChart" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label="Today's glucose readings over time">
      <defs>
        <linearGradient id="tideGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3E7C74" stopOpacity={0.3} />
          <stop offset="100%" stopColor="#3E7C74" stopOpacity={0} />
        </linearGradient>
      </defs>

      <rect
        x={PAD_L}
        y={bandTop}
        width={WIDTH - PAD_L - PAD_R}
        height={Math.max(0, bandBottom - bandTop)}
        rx={4}
        fill="#3E7C74"
        opacity={0.1}
      />

      {[targets.low, targets.high].map((v) => (
        <text
          key={v}
          x={PAD_L - 8}
          y={yForValue(v, CHART_MIN, CHART_MAX, PAD_T, PAD_B, HEIGHT) + 4}
          textAnchor="end"
          className="chart-label"
        >
          {v}
        </text>
      ))}

      {[0, 6, 12, 18, 24].map((h) => {
        const x = xForHour(h, PAD_L, PAD_R, WIDTH);
        return (
          <g key={h}>
            <line x1={x} x2={x} y1={PAD_T} y2={HEIGHT - PAD_B} className="chart-grid" />
            {h < 24 && (
              <text x={x} y={HEIGHT - 10} textAnchor="middle" className="chart-label">
                {h === 0 ? '12a' : h === 6 ? '6a' : h === 12 ? '12p' : '6p'}
              </text>
            )}
          </g>
        );
      })}

      {points.length > 1 && (
        <>
          <path d={areaPath} className="chart-area" />
          <path d={linePath} className="chart-line" />
        </>
      )}

      {points.map((p) => (
        <circle
          key={p.reading.id}
          cx={p.x}
          cy={p.y}
          r={5}
          fill={MEAL_COLORS[p.reading.mealType]}
          stroke="#fff"
          strokeWidth={2}
        >
          <title>
            {formatTime(new Date(p.reading.timestamp))} {MEAL_LABELS[p.reading.mealType]} {p.reading.value} mg/dL
          </title>
        </circle>
      ))}
    </svg>
  );
}
