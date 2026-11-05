import { Art, Magnifier } from '../art/Art'
import { WORDS } from '../audience'
import { BigButton, PreviewBadge, order } from './ui'

/** The book's own creatures around the mark: sea on one side, land on the other. */
const ORBIT = ['pic:fish', 'pic:squirrel', 'pic:bird', 'pic:rabbit', 'pic:whale', 'pic:cactus', 'pic:seaweed', 'pic:zebra']

export function Splash({ onStart }: { onStart: () => void }) {
  return (
    <main className="screen splash">
      <div className="splash-top">
        <PreviewBadge />
      </div>

      <div className="splash-stage">
        <div className="orbit" aria-hidden="true">
          {ORBIT.map((art, index) => {
            const column = index % 4
            const above = index < 4
            const edge = column === 0 || column === 3
            return (
              <span
                key={art}
                className="orbit-item pop"
                style={order(index, {
                  '--base-delay': '250ms',
                  left: `${[12, 37, 63, 88][column]}%`,
                  top: `${above ? (edge ? 15 : 7) : edge ? 85 : 93}%`,
                })}
              >
                <span className="orbit-bob" style={order(index)}>
                  <Art art={art} />
                </span>
              </span>
            )
          })}
        </div>

        <div className="logo logo-in">
          <Magnifier className="logo-mark" />
          <h1 className="logo-word">علوم</h1>
          <p className="logo-sub">المواطن الطبيعية</p>
        </div>
      </div>

      <p className="splash-tagline rise" style={order(0, { '--base-delay': '450ms' })}>
        أين تعيش الكائنات الحية؟ وكيف نحمي أماكن عيشها؟ {WORDS.hello}
      </p>

      <div className="rise" style={order(0, { '--base-delay': '700ms' })}>
        <BigButton onClick={onStart} pulse className="start-button">
          <span>هيا نبدأ</span>
          <svg className="play-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M16 5L6 12l10 7z" />
          </svg>
        </BigButton>
      </div>
    </main>
  )
}
