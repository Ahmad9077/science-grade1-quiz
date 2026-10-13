import { Art } from '../art/Art'
import { BigButton, PreviewBadge, order } from './ui'

const ORBIT = ['🥕', '🦜', '🐟', '🐢', '🐣', '🦋', '🥬', '🐇']

export function Splash({ onStart }: { onStart: () => void }) {
  return (
    <main className="screen splash">
      <div className="splash-top">
        <PreviewBadge />
      </div>

      <div className="splash-stage">
        <div className="orbit" aria-hidden="true">
          {ORBIT.map((art, index) => {
            const angle = (index / ORBIT.length) * Math.PI * 2
            return (
              <span
                key={art}
                className="orbit-item pop"
                style={order(index, {
                  '--base-delay': '250ms',
                  left: `${50 + Math.cos(angle) * 44}%`,
                  top: `${50 + Math.sin(angle) * 40}%`,
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
          <Magnifier />
          <h1 className="logo-word">علوم</h1>
        </div>
      </div>

      <p className="splash-tagline rise" style={order(0, { '--base-delay': '450ms' })}>
        نتدرب معا على دروس العلوم للصف الأول
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

export function Magnifier({ className = 'magnifier' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" aria-hidden="true">
      <path d="M40 40 L56 56" stroke="#24352a" strokeWidth="9" strokeLinecap="round" />
      <path d="M40 40 L56 56" stroke="#a463d6" strokeWidth="5" strokeLinecap="round" />
      <circle cx="27" cy="27" r="19" fill="#dff3ff" stroke="#24352a" strokeWidth="4" />
      <path d="M27 38 C19 31 20 20 30 16 C35 25 33 33 27 38 Z" fill="#62c16a" stroke="#24352a" strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M27 38 C28 31 29 25 30 17" fill="none" stroke="#2f7a3a" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M15 21 Q18 14 25 12" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}
