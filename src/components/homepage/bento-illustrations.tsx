import { SolvroMark } from "@/components/solvro-mark";
import { cn } from "@/lib/utils";

/*
 * Monochrome line-art illustrations for the bento cards: thin strokes in the
 * muted foreground colour, one blue accent, monospace labels. Every motion is
 * a CSS animation (globals.css "svg-*" classes), nothing runs in JS.
 */

const MONO = "ui-monospace, SFMono-Regular, Menlo, monospace";

function Art({
  viewBox,
  className,
  children,
}: {
  viewBox: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <svg
      viewBox={viewBox}
      className={cn(
        "text-muted-foreground/70 h-full w-full [&_text]:fill-current [&_text]:stroke-none",
        className,
      )}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fontFamily={MONO}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

/** Window chrome: rounded frame with three dots and an optional title. */
function Window({
  x,
  y,
  width,
  height,
  title,
  children,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  title?: string;
  children?: React.ReactNode;
}) {
  return (
    <g transform={`translate(${x.toString()} ${y.toString()})`}>
      <rect width={width} height={height} rx="8" fill="hsl(var(--card))" />
      <circle cx="12" cy="11" r="2" fill="currentColor" stroke="none" />
      <circle cx="20" cy="11" r="2" fill="currentColor" stroke="none" />
      <circle cx="28" cy="11" r="2" fill="currentColor" stroke="none" />
      {title === undefined ? null : (
        <text x={width / 2} y="14" fontSize="8" textAnchor="middle">
          {title}
        </text>
      )}
      <line x1="0" y1="22" x2={width} y2="22" strokeOpacity="0.6" />
      {children}
    </g>
  );
}

const PLAN_ROWS = [
  { y: 32, w: 40, delay: "0s" },
  { y: 50, w: 58, delay: "0.8s" },
  { y: 68, w: 34, delay: "1.6s" },
  { y: 86, w: 50, delay: "2.4s" },
];

/** USOS window → arrow → planner window, class rows appearing one by one. */
export function ScheduleSyncArt({ className }: { className?: string }) {
  return (
    <Art viewBox="0 0 320 160" className={className}>
      <rect
        x="14"
        y="18"
        width="128"
        height="124"
        rx="10"
        strokeDasharray="4 4"
        strokeOpacity="0.5"
      />
      <text x="26" y="34" fontSize="8">
        usos
      </text>
      <Window x={26} y={44} width={104} height={84} title="zapisy">
        {[36, 50, 64].map((y, index) => (
          <g key={y} strokeOpacity={0.55 - index * 0.12}>
            <line x1="12" y1={y} x2="60" y2={y} />
            <line x1="70" y1={y} x2="92" y2={y} />
          </g>
        ))}
      </Window>

      <g className="text-primary" stroke="currentColor">
        <line x1="142" y1="86" x2="186" y2="86" strokeWidth="2" />
        <path d="M 180 80 L 186 86 L 180 92" strokeWidth="2" />
        <circle
          r="3"
          fill="currentColor"
          stroke="none"
          className="svg-travel"
          style={{
            offsetPath: 'path("M 142 86 L 184 86")',
            animationDuration: "2.4s",
          }}
        />
      </g>

      <Window x={196} y={30} width={110} height={112} title="planer">
        {PLAN_ROWS.map((row) => (
          <rect
            key={row.y}
            x="12"
            y={row.y}
            width={row.w}
            height="10"
            rx="3"
            fill="hsl(var(--primary) / 0.12)"
            className="svg-pop text-primary/60"
            stroke="currentColor"
            style={{ animationDelay: row.delay, animationDuration: "5s" }}
          />
        ))}
        <text x="12" y="106" fontSize="7" fillOpacity="0.7">
          4 kursy · 16 grup
        </text>
      </Window>
    </Art>
  );
}

const SHARE_PATH_TOP = "M 220 63 C 248 63, 248 40, 268 40";
const SHARE_PATH_BOTTOM = "M 220 63 C 248 63, 248 92, 268 92";

/** A preview link with a blinking cursor and two friends receiving it. */
export function ShareArt({ className }: { className?: string }) {
  return (
    <Art viewBox="0 0 320 160" className={className}>
      <g transform="translate(24 46)">
        <rect width="200" height="34" rx="17" fill="hsl(var(--card))" />
        <path d="M 16 17 h 8 M 22 12 a 5 5 0 0 1 0 10 M 18 12 a 5 5 0 0 0 0 10" />
        <text x="36" y="21" fontSize="9">
          planer.solvro.pl/preview/7n4
        </text>
        <rect
          x="186"
          y="11"
          width="1.5"
          height="12"
          fill="hsl(var(--primary))"
          stroke="none"
          className="svg-blink"
        />
      </g>

      <g className="text-primary" stroke="currentColor">
        <path d={SHARE_PATH_TOP} />
        <path d={SHARE_PATH_BOTTOM} />
        <circle
          r="2.5"
          fill="currentColor"
          stroke="none"
          className="svg-travel"
          style={{
            offsetPath: `path("${SHARE_PATH_TOP}")`,
            animationDuration: "2.2s",
          }}
        />
        <circle
          r="2.5"
          fill="currentColor"
          stroke="none"
          className="svg-travel"
          style={{
            offsetPath: `path("${SHARE_PATH_BOTTOM}")`,
            animationDuration: "2.2s",
            animationDelay: "-1.1s",
          }}
        />
      </g>

      {[40, 92].map((y) => (
        <g key={y} transform={`translate(282 ${y.toString()})`}>
          <circle r="14" fill="hsl(var(--card))" />
          <circle cy="-3" r="4" />
          <path d="M -7 8 a 7 5 0 0 1 14 0" />
        </g>
      ))}

      <g transform="translate(24 104)">
        {["png", "ics", "link"].map((label, index) => (
          <g key={label} transform={`translate(${(index * 52).toString()} 0)`}>
            <rect width="44" height="18" rx="4" fill="hsl(var(--card))" />
            <text x="22" y="12" fontSize="8" textAnchor="middle">
              {label}
            </text>
          </g>
        ))}
      </g>
    </Art>
  );
}

const HOURS: [string, number][] = [
  ["9:15", 36],
  ["11:15", 84],
  ["13:15", 132],
  ["15:15", 180],
];

/** Two overlapping classes with a hatched overlap and a spots meter. */
export function CollisionsArt({ className }: { className?: string }) {
  return (
    <Art viewBox="0 0 240 300" className={className}>
      <defs>
        <pattern
          id="bento-hatch"
          width="6"
          height="6"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <line
            x1="0"
            y1="0"
            x2="0"
            y2="6"
            stroke="hsl(var(--status-collision))"
            strokeWidth="1.2"
          />
        </pattern>
      </defs>

      {HOURS.map(([label, y]) => (
        <g key={label}>
          <text x="18" y={y + 3} fontSize="8">
            {label}
          </text>
          <line x1="52" y1={y} x2="224" y2={y} strokeOpacity="0.35" />
        </g>
      ))}

      <rect
        x="60"
        y="40"
        width="110"
        height="60"
        rx="8"
        fill="hsl(var(--card))"
      />
      <text x="70" y="56" fontSize="8">
        L · grupa 2
      </text>
      <g className="svg-float">
        <rect
          x="110"
          y="74"
          width="106"
          height="62"
          rx="8"
          fill="hsl(var(--card))"
          stroke="hsl(var(--status-collision))"
          strokeDasharray="4 3"
        />
        <rect
          x="110"
          y="74"
          width="60"
          height="26"
          rx="6"
          fill="url(#bento-hatch)"
          stroke="none"
          className="svg-blink"
        />
        <text x="120" y="122" fontSize="8">
          W · grupa 1
        </text>
        <g transform="translate(206 84)">
          <circle
            r="11"
            fill="hsl(var(--status-collision) / 0.2)"
            stroke="none"
            className="svg-ring"
          />
          <circle r="7" fill="hsl(var(--status-collision))" stroke="none" />
          <line
            x1="0"
            y1="-3.5"
            x2="0"
            y2="0.5"
            stroke="white"
            strokeWidth="1.8"
          />
          <circle cy="3.4" r="0.9" fill="white" stroke="none" />
        </g>
      </g>

      <g transform="translate(60 210)">
        <text fontSize="8">wolne miejsca</text>
        <rect y="10" width="164" height="10" rx="5" fill="hsl(var(--card))" />
        <rect
          y="10"
          height="10"
          rx="5"
          fill="hsl(var(--primary))"
          stroke="none"
          className="svg-meter"
        />
        <text y="38" fontSize="8" className="svg-blink">
          12 / 15 zajęte
        </text>
      </g>
    </Art>
  );
}

const PHONE_ROWS = [
  { y: 22, w: 30, delay: "0s" },
  { y: 38, w: 22, delay: "0.7s" },
  { y: 54, w: 34, delay: "1.4s" },
  { y: 70, w: 26, delay: "2.1s" },
];

/** A laptop with a terminal pushing code to a phone that shows the plan. */
export function StudentsArt({ className }: { className?: string }) {
  return (
    <Art viewBox="0 0 400 180" className={className}>
      <Window x={40} y={30} width={170} height={104} title="web-planer">
        <text x="12" y="42" fontSize="8">
          → ~ git commit -m &quot;planer&quot;
        </text>
        <text x="12" y="58" fontSize="8" fillOpacity="0.7">
          16 developerów · open source
        </text>
        <text x="12" y="78" fontSize="8">
          → ~
        </text>
        <rect
          x="32"
          y="70"
          width="5"
          height="10"
          fill="hsl(var(--primary))"
          stroke="none"
          className="svg-blink"
        />
        <path d="M -14 104 h 198" />
        <path d="M -14 104 q 0 8 8 8 h 182 q 8 0 8 -8" />
      </Window>

      <g className="text-primary" stroke="currentColor" strokeWidth="2">
        <line x1="238" y1="90" x2="290" y2="90" />
        <circle
          r="3"
          fill="currentColor"
          stroke="none"
          className="svg-travel"
          style={{
            offsetPath: 'path("M 238 90 L 290 90")',
            animationDuration: "2.6s",
          }}
        />
      </g>

      <g transform="translate(300 40)">
        <rect width="54" height="100" rx="10" fill="hsl(var(--card))" />
        <line x1="20" y1="8" x2="34" y2="8" />
        {PHONE_ROWS.map((row) => (
          <rect
            key={row.y}
            x="10"
            y={row.y}
            width={row.w}
            height="9"
            rx="3"
            fill="hsl(var(--primary) / 0.12)"
            className="svg-pop text-primary/60"
            stroke="currentColor"
            style={{ animationDelay: row.delay, animationDuration: "5s" }}
          />
        ))}
        <line x1="20" y1="92" x2="34" y2="92" />
      </g>

      <g transform="translate(364 142)" className="text-primary/70">
        <SolvroMark width="22" height="17" />
      </g>
    </Art>
  );
}
