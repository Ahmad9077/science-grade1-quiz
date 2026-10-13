import type { ReactElement, ReactNode } from 'react'

// Hand-built drawings for things emoji cannot show, in one sticker style:
// round joins, a dark green ink outline and flat warm fills.
const INK = '#24352a'

type PlantPart = 'root' | 'stem' | 'leaf' | 'flower'

function Plant({ highlight }: { highlight?: PlantPart }) {
  const dim = (part: PlantPart) => (highlight && highlight !== part ? 0.16 : 1)
  const glow = (part: PlantPart) => (highlight === part ? 'url(#plant-glow)' : undefined)
  const petals = [0, 60, 120, 180, 240, 300]

  return (
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <defs>
        <filter id="plant-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="0" stdDeviation="2.4" floodColor="#fff4a8" floodOpacity="1" />
        </filter>
      </defs>
      <rect x="6" y="68" width="88" height="28" rx="9" fill="#c98f5c" stroke={INK} strokeWidth="2" />
      <path d="M8 72 Q20 68 32 72 T56 72 T80 72 T93 71" fill="none" stroke="#a36d3f" strokeWidth="2" />
      <circle cx="20" cy="88" r="1.6" fill="#a36d3f" />
      <circle cx="80" cy="84" r="1.8" fill="#a36d3f" />
      <circle cx="72" cy="92" r="1.2" fill="#a36d3f" />
      <g opacity={dim('root')} filter={glow('root')} stroke="#7a4a26" strokeWidth="3" strokeLinecap="round" fill="none">
        <path d="M50 70 L50 92" />
        <path d="M50 75 Q42 80 33 86" />
        <path d="M50 79 Q59 84 67 89" />
        <path d="M50 85 Q44 89 40 94" />
        <path d="M50 84 Q56 89 59 94" />
      </g>
      <g opacity={dim('stem')} filter={glow('stem')}>
        <path d="M50 70 C50 56 50 44 50 31" stroke={INK} strokeWidth="7" strokeLinecap="round" fill="none" />
        <path d="M50 70 C50 56 50 44 50 31" stroke="#45a453" strokeWidth="4" strokeLinecap="round" fill="none" />
      </g>
      <g opacity={dim('leaf')} filter={glow('leaf')} stroke={INK} strokeWidth="2" strokeLinejoin="round">
        <path d="M50 57 C41 48 28 49 20 55 C29 64 42 64 50 57 Z" fill="#62c16a" />
        <path d="M50 57 C40 56 30 56 22 55" fill="none" stroke="#2f7a3a" strokeWidth="1.4" />
        <path d="M50 46 C59 37 72 38 80 44 C71 53 58 53 50 46 Z" fill="#62c16a" />
        <path d="M50 46 C60 45 70 45 78 44" fill="none" stroke="#2f7a3a" strokeWidth="1.4" />
      </g>
      <g opacity={dim('flower')} filter={glow('flower')}>
        {petals.map((angle) => (
          <ellipse
            key={angle}
            cx="50"
            cy="15"
            rx="6.5"
            ry="9"
            fill="#ff8fb1"
            stroke={INK}
            strokeWidth="2"
            transform={`rotate(${angle} 50 24)`}
          />
        ))}
        <circle cx="50" cy="24" r="6.5" fill="#ffc93c" stroke={INK} strokeWidth="2" />
      </g>
    </svg>
  )
}

function Sugarcane() {
  const stalks = [
    { x: 30, top: 22, color: '#c9d86b' },
    { x: 46, top: 12, color: '#b7cc5a' },
    { x: 62, top: 26, color: '#c9d86b' },
  ]
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <g stroke="#3f8f45" strokeWidth="3" strokeLinecap="round" fill="none">
        <path d="M37 24 Q24 10 14 12" />
        <path d="M53 14 Q50 2 58 -2" />
        <path d="M53 16 Q68 4 80 8" />
        <path d="M69 28 Q82 18 90 22" />
      </g>
      {stalks.map((stalk) => (
        <g key={stalk.x}>
          <rect x={stalk.x} y={stalk.top} width="13" height={92 - stalk.top} rx="6" fill={stalk.color} stroke={INK} strokeWidth="2" />
          {[0, 1, 2, 3, 4].map((step) => {
            const y = stalk.top + 14 + step * 14
            return y < 88 ? (
              <path key={step} d={`M${stalk.x + 1} ${y} h11`} stroke="#7e9a3a" strokeWidth="2.4" strokeLinecap="round" />
            ) : null
          })}
        </g>
      ))}
    </svg>
  )
}

function Cauliflower() {
  const florets = [
    [36, 50], [50, 42], [64, 50], [43, 58], [57, 58], [50, 52], [30, 58], [70, 58],
  ]
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <path d="M50 88 C30 88 14 74 12 56 C24 62 34 66 50 70 Z" fill="#5fb565" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      <path d="M50 88 C70 88 86 74 88 56 C76 62 66 66 50 70 Z" fill="#4ea457" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      {florets.map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="11" fill="#fff8e6" stroke="#cdbb94" strokeWidth="2" />
      ))}
      <path d="M28 62 C40 72 60 72 72 62" fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function Radish() {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <g stroke={INK} strokeWidth="2" strokeLinejoin="round">
        <path d="M50 36 C42 22 30 14 22 16 C26 28 38 34 50 36 Z" fill="#5fb565" />
        <path d="M50 36 C50 20 54 8 62 4 C66 16 60 28 50 36 Z" fill="#4ea457" />
        <path d="M50 36 C60 24 74 20 82 24 C76 34 64 38 50 36 Z" fill="#62c16a" />
        <path d="M39 36 C38 62 46 84 50 97 C54 84 62 62 61 36 Z" fill="#f8f6ee" />
      </g>
      <g stroke="#c8c1aa" strokeWidth="1.6" strokeLinecap="round">
        <path d="M43 50 h5" />
        <path d="M53 60 h5" />
        <path d="M45 70 h5" />
        <path d="M51 80 h4" />
      </g>
    </svg>
  )
}

function Swatch({ children, fill }: { children: ReactNode; fill: string }) {
  const id = `clip-${fill.replace('#', '')}`
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <defs>
        <clipPath id={id}>
          <rect x="8" y="8" width="84" height="84" rx="20" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id})`}>
        <rect x="0" y="0" width="100" height="100" fill={fill} />
        {children}
      </g>
      <rect x="8" y="8" width="84" height="84" rx="20" fill="none" stroke={INK} strokeWidth="2.5" />
    </svg>
  )
}

function Scales() {
  const rows = [0, 1, 2, 3, 4, 5, 6]
  const cols = [0, 1, 2, 3, 4, 5]
  return (
    <Swatch fill="#8fc1e3">
      {rows.flatMap((row) =>
        cols.map((col) => {
          const x = col * 18 + (row % 2 ? 9 : 0) - 6
          const y = row * 13 + 4
          return (
            <path
              key={`${row}-${col}`}
              d={`M${x} ${y} a9 9 0 0 0 18 0`}
              fill={row % 2 ? '#cfe6f6' : '#b3d7ef'}
              stroke="#4a86b4"
              strokeWidth="1.8"
            />
          )
        }),
      )}
    </Swatch>
  )
}

function Feathers() {
  return (
    <Swatch fill="#d8f0ec">
      <path d="M22 86 C30 60 52 30 82 16 C78 40 60 66 30 82 Z" fill="#22a99a" stroke={INK} strokeWidth="2" />
      <path d="M22 86 C40 64 60 40 82 16" fill="none" stroke="#f5f0d8" strokeWidth="2.6" strokeLinecap="round" />
      {[0, 1, 2, 3, 4, 5].map((step) => (
        <path
          key={step}
          d={`M${34 + step * 8} ${70 - step * 9} l${-6} ${-8}`}
          stroke="#137a6f"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      ))}
      <path d="M40 74 C46 58 60 44 72 38 C70 52 58 64 44 72 Z" fill="#3cc2d6" opacity="0.7" />
      <circle cx="62" cy="46" r="5" fill="#ffd166" stroke={INK} strokeWidth="1.5" />
    </Swatch>
  )
}

function Fur() {
  const strands = []
  for (let row = 0; row < 8; row += 1) {
    for (let col = 0; col < 7; col += 1) {
      const x = col * 14 + (row % 2 ? 7 : 0)
      const y = row * 12 + 6
      strands.push(
        <path
          key={`${row}-${col}`}
          d={`M${x} ${y} q4 6 1 12`}
          fill="none"
          stroke={(row + col) % 3 === 0 ? '#c66f1f' : '#ffd08a'}
          strokeWidth="2.6"
          strokeLinecap="round"
        />,
      )
    }
  }
  return <Swatch fill="#f2a24a">{strands}</Swatch>
}

function Plates() {
  const plates = []
  for (let row = 0; row < 5; row += 1) {
    for (let col = 0; col < 5; col += 1) {
      const x = col * 19 + (row % 2 ? 0 : -9) + 4
      const y = row * 19 + 4
      plates.push(
        <rect key={`${row}-${col}`} x={x} y={y} width="16" height="16" rx="5" fill="#93a35c" stroke="#4e5a2c" strokeWidth="2" />,
        <circle key={`${row}-${col}-h`} cx={x + 6} cy={y + 6} r="2.2" fill="#b9c77f" />,
      )
    }
  }
  return <Swatch fill="#6f7f42">{plates}</Swatch>
}

function Shell() {
  const hex = (cx: number, cy: number, r: number) =>
    Array.from({ length: 6 }, (_, i) => {
      const a = (Math.PI / 3) * i + Math.PI / 6
      return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`
    }).join(' ')
  const cells: [number, number][] = [[50, 50], [32, 40], [68, 40], [32, 62], [68, 62], [50, 28], [50, 72]]
  return (
    <Swatch fill="#e8d6a8">
      <ellipse cx="50" cy="54" rx="44" ry="38" fill="#8a5a2b" />
      {cells.map(([x, y]) => (
        <polygon key={`${x}-${y}`} points={hex(x, y, 10.5)} fill="#c99a5b" stroke="#6b4320" strokeWidth="2" />
      ))}
    </Swatch>
  )
}

function MoveFly() {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <path d="M14 70 Q40 30 84 26" fill="none" stroke="#7cc3f5" strokeWidth="3" strokeDasharray="5 6" strokeLinecap="round" />
      <path d="M40 66 C46 44 64 32 86 34 C76 44 70 50 70 58 C62 56 56 58 52 64 C48 62 44 64 40 66 Z" fill="#ffffff" stroke={INK} strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M52 56 C58 48 66 44 76 42" fill="none" stroke="#7cc3f5" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function MoveSwim() {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true">
      {[34, 52, 70].map((y, i) => (
        <path
          key={y}
          d={`M10 ${y} q10 -9 20 0 t20 0 t20 0 t20 0`}
          fill="none"
          stroke={i === 1 ? '#1f78c8' : '#4aa3e8'}
          strokeWidth="5"
          strokeLinecap="round"
        />
      ))}
      <circle cx="80" cy="18" r="4" fill="none" stroke="#4aa3e8" strokeWidth="2.4" />
      <circle cx="70" cy="12" r="2.6" fill="none" stroke="#4aa3e8" strokeWidth="2" />
    </svg>
  )
}

function MoveWalk() {
  const foot = (x: number, y: number, rot: number) => (
    <g transform={`rotate(${rot} ${x} ${y})`} fill="#8b5a33" stroke={INK} strokeWidth="1.6">
      <ellipse cx={x} cy={y} rx="8" ry="10" />
      <circle cx={x - 7} cy={y - 13} r="3.2" />
      <circle cx={x} cy={y - 16} r="3.4" />
      <circle cx={x + 7} cy={y - 13} r="3.2" />
    </g>
  )
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true">
      {foot(32, 78, -12)}
      {foot(56, 58, 8)}
      {foot(70, 32, -8)}
    </svg>
  )
}

function MoveCrawl() {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <path d="M8 76 H92" stroke="#c98f5c" strokeWidth="4" strokeLinecap="round" />
      <path d="M12 64 C22 48 32 48 40 62 S58 78 66 62 S80 46 90 58" fill="none" stroke={INK} strokeWidth="11" strokeLinecap="round" />
      <path d="M12 64 C22 48 32 48 40 62 S58 78 66 62 S80 46 90 58" fill="none" stroke="#6cc070" strokeWidth="7" strokeLinecap="round" />
      <circle cx="88" cy="56" r="1.8" fill={INK} />
    </svg>
  )
}

function MoveJump() {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <path d="M8 82 H92" stroke="#c98f5c" strokeWidth="4" strokeLinecap="round" />
      <path d="M16 80 Q34 10 52 76" fill="none" stroke="#f08a3c" strokeWidth="3.5" strokeDasharray="6 5" strokeLinecap="round" />
      <path d="M52 76 Q68 30 84 76" fill="none" stroke="#f08a3c" strokeWidth="3.5" strokeDasharray="6 5" strokeLinecap="round" />
      <path d="M78 66 L84 77 L90 67" fill="none" stroke="#f08a3c" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function Lungs() {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <path d="M50 10 V40 M50 40 Q44 46 38 50 M50 40 Q56 46 62 50" fill="none" stroke={INK} strokeWidth="8" strokeLinecap="round" />
      <path d="M50 10 V40 M50 40 Q44 46 38 50 M50 40 Q56 46 62 50" fill="none" stroke="#f6c1cb" strokeWidth="4.5" strokeLinecap="round" />
      <path d="M42 34 C24 32 12 52 14 74 C15 86 26 90 36 86 C44 82 44 70 44 56 Z" fill="#ff8fa3" stroke={INK} strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M58 34 C76 32 88 52 86 74 C85 86 74 90 64 86 C56 82 56 70 56 56 Z" fill="#ff8fa3" stroke={INK} strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M24 60 C28 66 30 70 30 78 M76 60 C72 66 70 70 70 78" fill="none" stroke="#d65a74" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function Gills() {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="52" r="38" fill="#bfe6ff" stroke={INK} strokeWidth="2.4" />
      {[34, 48, 62].map((x) => (
        <g key={x}>
          <path d={`M${x} 30 Q${x + 12} 52 ${x} 74`} fill="none" stroke={INK} strokeWidth="7" strokeLinecap="round" />
          <path d={`M${x} 30 Q${x + 12} 52 ${x} 74`} fill="none" stroke="#e2555a" strokeWidth="4" strokeLinecap="round" />
        </g>
      ))}
      <circle cx="80" cy="20" r="5" fill="#ffffff" stroke="#4aa3e8" strokeWidth="2" />
      <circle cx="90" cy="8" r="3" fill="#ffffff" stroke="#4aa3e8" strokeWidth="2" />
    </svg>
  )
}

function Birth() {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <path d="M50 22 C46 14 34 16 36 26 C38 32 50 38 50 38 C50 38 62 32 64 26 C66 16 54 14 50 22 Z" fill="#ff6f91" stroke={INK} strokeWidth="2" />
      <g stroke={INK} strokeWidth="2.2">
        <circle cx="24" cy="50" r="7" fill="#e6a86a" />
        <circle cx="48" cy="50" r="7" fill="#e6a86a" />
        <ellipse cx="36" cy="70" rx="26" ry="20" fill="#f6c28b" />
        <circle cx="64" cy="70" r="5" fill="#f0bd84" />
        <circle cx="82" cy="70" r="5" fill="#f0bd84" />
        <ellipse cx="73" cy="82" rx="15" ry="12" fill="#fbd9ae" />
      </g>
      <circle cx="29" cy="66" r="2.4" fill={INK} />
      <circle cx="43" cy="66" r="2.4" fill={INK} />
      <circle cx="68" cy="80" r="1.8" fill={INK} />
      <circle cx="78" cy="80" r="1.8" fill={INK} />
      <path d="M33 75 Q36 78 39 75" fill="none" stroke={INK} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function Egg() {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <ellipse cx="66" cy="62" rx="18" ry="23" fill="#f3e2c4" stroke={INK} strokeWidth="2.2" />
      <ellipse cx="42" cy="56" rx="24" ry="31" fill="#fff6e4" stroke={INK} strokeWidth="2.4" />
      <path d="M30 44 Q34 34 42 30" fill="none" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
      <circle cx="50" cy="70" r="2.2" fill="#e3c48f" />
      <circle cx="36" cy="74" r="1.6" fill="#e3c48f" />
      <circle cx="70" cy="58" r="1.8" fill="#d7bb8c" />
    </svg>
  )
}

function FoodPlants() {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <g stroke={INK} strokeWidth="2.2" strokeLinejoin="round">
        <path d="M50 90 C30 74 22 48 30 20 C46 36 54 60 50 90 Z" fill="#62c16a" />
        <path d="M50 90 C70 74 80 50 74 24 C58 38 48 62 50 90 Z" fill="#4ea457" />
        <path d="M50 90 C40 70 40 46 50 28 C60 46 60 70 50 90 Z" fill="#8bd47f" />
      </g>
      <path d="M50 88 V36" stroke="#2f7a3a" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function FoodMeat() {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <g stroke={INK} strokeWidth="2.4" strokeLinejoin="round">
        <path d="M60 56 L80 76" stroke={INK} strokeWidth="11" strokeLinecap="round" />
        <path d="M60 56 L80 76" stroke="#fff3df" strokeWidth="7" strokeLinecap="round" />
        <circle cx="84" cy="74" r="6" fill="#fff3df" />
        <circle cx="78" cy="82" r="6" fill="#fff3df" />
        <path d="M18 40 C16 22 34 12 50 16 C68 20 74 40 64 56 C56 68 38 70 28 62 C22 56 19 48 18 40 Z" fill="#c8553d" />
      </g>
      <path d="M30 32 C36 24 46 22 54 26" fill="none" stroke="#e98b6f" strokeWidth="4" strokeLinecap="round" />
    </svg>
  )
}

function Check() {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="50" r="40" fill="#3fb37f" stroke={INK} strokeWidth="2.6" />
      <path d="M30 52 L44 66 L72 36" fill="none" stroke="#ffffff" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function Cross() {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="50" r="40" fill="#f06a5d" stroke={INK} strokeWidth="2.6" />
      <path d="M34 34 L66 66 M66 34 L34 66" fill="none" stroke="#ffffff" strokeWidth="9" strokeLinecap="round" />
    </svg>
  )
}

function Warmth() {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true">
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
        <path key={angle} d="M50 8 V20" stroke="#f59e2b" strokeWidth="5" strokeLinecap="round" transform={`rotate(${angle} 50 50)`} />
      ))}
      <circle cx="50" cy="50" r="22" fill="#ffc93c" stroke={INK} strokeWidth="2.6" />
      <path d="M41 54 Q50 62 59 54" fill="none" stroke={INK} strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="42" cy="45" r="2.4" fill={INK} />
      <circle cx="58" cy="45" r="2.4" fill={INK} />
    </svg>
  )
}

function Water() {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <path d="M50 10 C38 30 24 46 24 62 C24 78 36 90 50 90 C64 90 76 78 76 62 C76 46 62 30 50 10 Z" fill="#4aa3e8" stroke={INK} strokeWidth="2.6" />
      <path d="M38 62 C38 70 42 76 48 78" fill="none" stroke="#bfe6ff" strokeWidth="4" strokeLinecap="round" />
    </svg>
  )
}

export const DRAWINGS: Record<string, () => ReactElement> = {
  plant: () => <Plant />,
  'part-root': () => <Plant highlight="root" />,
  'part-stem': () => <Plant highlight="stem" />,
  'part-leaf': () => <Plant highlight="leaf" />,
  'part-flower': () => <Plant highlight="flower" />,
  sugarcane: Sugarcane,
  cauliflower: Cauliflower,
  radish: Radish,
  'cover-scales': Scales,
  'cover-feathers': Feathers,
  'cover-fur': Fur,
  'cover-plates': Plates,
  'cover-shell': Shell,
  'move-fly': MoveFly,
  'move-swim': MoveSwim,
  'move-walk': MoveWalk,
  'move-crawl': MoveCrawl,
  'move-jump': MoveJump,
  lungs: Lungs,
  gills: Gills,
  birth: Birth,
  egg: Egg,
  'food-plants': FoodPlants,
  'food-meat': FoodMeat,
  check: Check,
  cross: Cross,
  warmth: Warmth,
  water: Water,
}
