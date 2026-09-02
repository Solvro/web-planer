import { SolvroMark } from "@/components/solvro-mark";
import { cn } from "@/lib/utils";

/*
 * Lightweight animated SVG illustrations for the bento cards. Every motion is
 * a CSS animation (see globals.css "svg-*" classes), so nothing runs in JS.
 */

const frame = "pointer-events-none absolute inset-0 h-full w-full";

const BLOCKS = [
  { x: 84, y: 40, w: 62, h: 34, hue: "var(--type-w)", delay: "0s" },
  { x: 152, y: 40, w: 62, h: 46, hue: "var(--type-l)", delay: "0.5s" },
  { x: 220, y: 40, w: 62, h: 28, hue: "var(--type-c)", delay: "1s" },
  { x: 84, y: 92, w: 62, h: 40, hue: "var(--type-p)", delay: "1.5s" },
  { x: 220, y: 84, w: 62, h: 48, hue: "var(--type-s)", delay: "2s" },
  { x: 152, y: 104, w: 62, h: 34, hue: "var(--type-l)", delay: "2.5s" },
];

/** Class blocks popping into a weekly grid while a sync ring keeps turning. */
export function ScheduleSyncArt({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 320 180"
      className={cn(frame, className)}
      aria-hidden="true"
    >
      <g stroke="hsl(var(--border))" strokeWidth="1">
        {[40, 72, 104, 136].map((y) => (
          <line key={y} x1="76" x2="300" y1={y} y2={y} />
        ))}
        {[84, 152, 220, 288].map((x) => (
          <line key={x} x1={x} x2={x} y1="30" y2="150" />
        ))}
      </g>
      <g fill="hsl(var(--muted-foreground))" fontSize="9" fontWeight="600">
        <text x="98" y="24">
          PON
        </text>
        <text x="168" y="24">
          WT
        </text>
        <text x="236" y="24">
          ŚR
        </text>
        <text x="46" y="44">
          8:00
        </text>
        <text x="46" y="108">
          10:00
        </text>
      </g>
      {BLOCKS.map((block) => (
        <rect
          key={`${block.x.toString()}-${block.y.toString()}`}
          x={block.x}
          y={block.y}
          width={block.w}
          height={block.h}
          rx="6"
          fill={`hsl(${block.hue} / 0.35)`}
          stroke={`hsl(${block.hue})`}
          strokeWidth="1.5"
          className="svg-pop"
          style={{ animationDelay: block.delay }}
        />
      ))}
      <g transform="translate(36 128)">
        <circle
          r="16"
          fill="hsl(var(--background))"
          stroke="hsl(var(--primary))"
          strokeOpacity="0.4"
        />
        <g className="svg-spin">
          <path
            d="M -9 -3 A 9.5 9.5 0 0 1 8 -5"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M 9 3 A 9.5 9.5 0 0 1 -8 5"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path d="M 8 -9 L 8.5 -4 L 3.5 -4.5 Z" fill="hsl(var(--primary))" />
          <path d="M -8 9 L -8.5 4 L -3.5 4.5 Z" fill="hsl(var(--primary))" />
        </g>
      </g>
    </svg>
  );
}

const NODES = [
  { x: 68, y: 52 },
  { x: 252, y: 44 },
  { x: 274, y: 132 },
  { x: 92, y: 140 },
  { x: 176, y: 22 },
];

/** A plan being sent to friends: pulses travel along the links. */
export function ShareArt({ className }: { className?: string }) {
  const center = { x: 168, y: 92 };
  return (
    <svg
      viewBox="0 0 320 180"
      className={cn(frame, className)}
      aria-hidden="true"
    >
      {NODES.map((node, index) => (
        <g key={`${node.x.toString()}-${node.y.toString()}`}>
          <line
            x1={center.x}
            y1={center.y}
            x2={node.x}
            y2={node.y}
            stroke="hsl(var(--border))"
            strokeWidth="1.5"
          />
          <line
            x1={center.x}
            y1={center.y}
            x2={node.x}
            y2={node.y}
            stroke="hsl(var(--primary))"
            strokeWidth="2"
            strokeLinecap="round"
            className="svg-dash"
            style={{ animationDelay: `${(index * 0.3).toString()}s` }}
          />
          <circle
            cx={node.x}
            cy={node.y}
            r="11"
            fill="hsl(var(--card))"
            stroke="hsl(var(--primary) / 0.5)"
            strokeWidth="1.5"
            className="svg-float"
            style={{ animationDelay: `${(index * 0.7).toString()}s` }}
          />
          <circle
            cx={node.x}
            cy={node.y - 3}
            r="3.2"
            fill="hsl(var(--primary))"
            className="svg-float"
            style={{ animationDelay: `${(index * 0.7).toString()}s` }}
          />
          <path
            d={`M ${(node.x - 5.5).toString()} ${(node.y + 6).toString()} a 5.5 4 0 0 1 11 0`}
            fill="hsl(var(--primary))"
            className="svg-float"
            style={{ animationDelay: `${(index * 0.7).toString()}s` }}
          />
        </g>
      ))}
      <g transform={`translate(${center.x.toString()} ${center.y.toString()})`}>
        <circle r="22" fill="hsl(var(--primary) / 0.15)" className="svg-ring" />
        <rect
          x="-16"
          y="-14"
          width="32"
          height="28"
          rx="6"
          fill="hsl(var(--primary))"
        />
        <g
          stroke="hsl(var(--primary-foreground))"
          strokeWidth="2"
          opacity="0.9"
        >
          <line x1="-9" y1="-5" x2="9" y2="-5" />
          <line x1="-9" y1="1" x2="4" y2="1" />
          <line x1="-9" y1="7" x2="7" y2="7" />
        </g>
      </g>
    </svg>
  );
}

/** Two overlapping classes flagged as a collision; a group filling up below. */
export function CollisionsArt({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 240 330"
      className={cn(frame, className)}
      aria-hidden="true"
      preserveAspectRatio="xMidYMin meet"
    >
      <g stroke="hsl(var(--border))" strokeWidth="1">
        {[40, 80, 120, 160, 200].map((y) => (
          <line key={y} x1="48" x2="230" y1={y} y2={y} />
        ))}
      </g>
      <g fill="hsl(var(--muted-foreground))" fontSize="9" fontWeight="600">
        {["9:15", "11:15", "13:15", "15:15", "17:05"].map((label, index) => (
          <text key={label} x="14" y={44 + index * 40}>
            {label}
          </text>
        ))}
      </g>
      <rect
        x="56"
        y="44"
        width="118"
        height="52"
        rx="8"
        fill="hsl(var(--type-l) / 0.35)"
        stroke="hsl(var(--type-l))"
        strokeWidth="1.5"
      />
      <g className="svg-float">
        <rect
          x="110"
          y="76"
          width="112"
          height="56"
          rx="8"
          fill="hsl(var(--type-w) / 0.35)"
          stroke="hsl(var(--status-collision))"
          strokeWidth="2"
          strokeDasharray="5 4"
        />
        <g transform="translate(206 84)">
          <circle
            r="12"
            fill="hsl(var(--status-collision) / 0.25)"
            className="svg-ring"
          />
          <circle r="7" fill="hsl(var(--status-collision))" />
          <path
            d="M 0 -3.5 V 0.5 M 0 3.2 V 3.6"
            stroke="white"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </g>
      </g>
      <rect
        x="56"
        y="166"
        width="166"
        height="46"
        rx="8"
        fill="hsl(var(--type-p) / 0.35)"
        stroke="hsl(var(--type-p))"
        strokeWidth="1.5"
      />
      <g transform="translate(56 232)">
        <text
          y="12"
          fontSize="9"
          fontWeight="600"
          fill="hsl(var(--muted-foreground))"
        >
          WOLNE MIEJSCA
        </text>
        <rect y="20" width="166" height="8" rx="4" fill="hsl(var(--muted))" />
        <foreignObject y="20" width="166" height="8">
          <div className="h-full">
            <div className="svg-fill bg-status-ready h-full rounded-full" />
          </div>
        </foreignObject>
        <g fill="hsl(var(--status-ready))" className="svg-blink">
          <circle cx="8" cy="44" r="3" />
          <text x="16" y="47" fontSize="9" fontWeight="600">
            12 / 15 zajęte
          </text>
        </g>
      </g>
    </svg>
  );
}

const ORBIT_PATH = "M 420 100 A 120 52 0 1 1 180 100 A 120 52 0 1 1 420 100";
const INNER_PATH = "M 380 100 A 80 34 0 1 1 220 100 A 80 34 0 1 1 380 100";
const ORBITERS = [0, 1, 2, 3, 4];

/** Students orbiting the Solvro mark (CSS motion path, upright avatars). */
export function StudentsArt({ className }: { className?: string }) {
  return (
    <div className={cn(frame, className)}>
      <svg viewBox="0 0 400 200" className="h-full w-full" aria-hidden="true">
        <g
          fill="none"
          stroke="hsl(var(--primary))"
          strokeOpacity="0.25"
          strokeWidth="1"
        >
          <path d={ORBIT_PATH} />
          <path d={INNER_PATH} />
        </g>
        {ORBITERS.map((index) => (
          <g
            key={index}
            className="svg-travel"
            style={{
              offsetPath: `path("${ORBIT_PATH}")`,
              animationDuration: "22s",
              animationDelay: `${(-(index / ORBITERS.length) * 22).toString()}s`,
            }}
          >
            <circle
              r="9"
              fill="hsl(var(--card))"
              stroke="hsl(var(--primary) / 0.6)"
              strokeWidth="1.5"
            />
            <circle cy="-2.5" r="2.6" fill="hsl(var(--primary))" />
            <path d="M -4.5 5 a 4.5 3.2 0 0 1 9 0" fill="hsl(var(--primary))" />
          </g>
        ))}
        {[0, 1, 2].map((index) => (
          <circle
            key={index}
            r="3"
            fill="hsl(268 90% 66%)"
            className="svg-travel"
            style={{
              offsetPath: `path("${INNER_PATH}")`,
              animationDuration: "14s",
              animationDirection: "reverse",
              animationDelay: `${(-(index / 3) * 14).toString()}s`,
            }}
          />
        ))}
        <circle
          cx="300"
          cy="100"
          r="30"
          fill="hsl(var(--primary) / 0.12)"
          className="svg-ring"
        />
      </svg>
      <SolvroMark className="text-primary svg-float absolute top-1/2 left-3/4 h-12 w-12 -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_0_18px_hsl(var(--primary)/0.6)]" />
    </div>
  );
}
