import { scoreToPercent, scoreClass, scoreNote } from "../utils/helper";

const SIZE = 140;
const STROKE = 10;
const RADIUS = (SIZE - STROKE) / 2;
const CENTER = SIZE / 2;
// Gauge sweeps 270 degrees, starting at -225deg (bottom-left) and ending at 45deg (bottom-right),
// evoking an analog meter dial rather than a generic full-circle progress ring.
const SWEEP_DEG = 270;
const START_DEG = -225;

function polarToCartesian(angleDeg) {
  const angleRad = (angleDeg * Math.PI) / 180;
  return {
    x: CENTER + RADIUS * Math.cos(angleRad),
    y: CENTER + RADIUS * Math.sin(angleRad),
  };
}

function describeArc(startDeg, endDeg) {
  const start = polarToCartesian(startDeg);
  const end = polarToCartesian(endDeg);
  const largeArcFlag = endDeg - startDeg <= 180 ? 0 : 1;
  return `M ${start.x} ${start.y} A ${RADIUS} ${RADIUS} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`;
}

const TICKS = 9; // ticks along the dial, like graduations on a meter

export default function IssueCard({ title, score }) {
  const percent = scoreToPercent(score);
  const tier = scoreClass(percent);
  const note = scoreNote(percent);

  const endDeg = START_DEG + (SWEEP_DEG * percent) / 100;
  const trackPath = describeArc(START_DEG, START_DEG + SWEEP_DEG);
  const valuePath = percent > 0 ? describeArc(START_DEG, endDeg) : null;

  const tierColorVar =
    tier === "score-good" ? "var(--good)" : tier === "score-warn" ? "var(--warn)" : "var(--bad)";

  return (
    <div className="gauge-card">
      <div className="gauge-card__title">{title}</div>

      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} role="img" aria-label={`${title} score: ${percent} out of 100`}>
        {/* tick marks */}
        {Array.from({ length: TICKS }).map((_, i) => {
          const deg = START_DEG + (SWEEP_DEG * i) / (TICKS - 1);
          const outer = {
            x: CENTER + (RADIUS + 6) * Math.cos((deg * Math.PI) / 180),
            y: CENTER + (RADIUS + 6) * Math.sin((deg * Math.PI) / 180),
          };
          const inner = {
            x: CENTER + (RADIUS + 1) * Math.cos((deg * Math.PI) / 180),
            y: CENTER + (RADIUS + 1) * Math.sin((deg * Math.PI) / 180),
          };
          return (
            <line
              key={i}
              x1={inner.x}
              y1={inner.y}
              x2={outer.x}
              y2={outer.y}
              stroke="var(--border-strong)"
              strokeWidth="1.5"
            />
          );
        })}

        {/* track */}
        <path
          d={trackPath}
          fill="none"
          stroke="var(--border)"
          strokeWidth={STROKE}
          strokeLinecap="round"
        />

        {/* value arc */}
        {valuePath && (
          <path
            d={valuePath}
            fill="none"
            stroke={tierColorVar}
            strokeWidth={STROKE}
            strokeLinecap="round"
          />
        )}

        <text
          x={CENTER}
          y={CENTER - 2}
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize="26"
          fontWeight="700"
          fill="var(--text)"
        >
          {percent}
        </text>
        <text
          x={CENTER}
          y={CENTER + 18}
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize="10"
          fill="var(--text-faint)"
        >
          / 100
        </text>
      </svg>

      <div className={`gauge-card__value ${tier}`}>{note}</div>
    </div>
  );
}
