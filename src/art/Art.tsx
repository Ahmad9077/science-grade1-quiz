import { APP_ROOT } from '../audience'

interface ArtProps {
  art: string
  className?: string
}

/** Where the book's pictures live; the boys' page sits one folder down. */
const PICS_ROOT = `${APP_ROOT ?? import.meta.env.BASE_URL}pics/`

function Picture({ id }: { id: string }) {
  return <img src={`${PICS_ROOT}${id}.jpg`} alt="" draggable={false} />
}

/**
 * Renders a picture at the size of its container. The art codes are listed with `ArtRef` in
 * the catalog: the book's pictures, a pair of them, words, and the ✓ and ✗ marks.
 */
export function Art({ art, className = '' }: ArtProps) {
  const [kind = '', ...rest] = art.split(':')
  const value = rest.join(':')
  const classes = (name: string) => `art ${name} ${className}`

  switch (kind) {
    case 'txt':
      return (
        <span className={classes('art-text')} aria-hidden="true" dir="rtl">
          {value}
        </span>
      )
    case 'tf':
      return (
        <span className={classes(`art-tf tf-${value}`)} aria-hidden="true">
          <span className="tf-mark">{value === 'yes' ? '✓' : '✗'}</span>
          <span className="tf-word">{value === 'yes' ? 'صح' : 'خطأ'}</span>
        </span>
      )
    case 'pic':
      return (
        <span className={classes('art-pic')} aria-hidden="true">
          <Picture id={value} />
        </span>
      )
    case 'pics':
      return (
        <span className={classes('art-pics')} aria-hidden="true">
          {value.split('+').map((id) => (
            <span key={id} className="art-pics-one">
              <Picture id={id} />
            </span>
          ))}
        </span>
      )
    default:
      return (
        <span className={classes('art-emoji')} aria-hidden="true">
          {art}
        </span>
      )
  }
}

/** The quiz's mark: a magnifier over a leaf, half sand and half sea, like the chapter's world. */
export function Magnifier({ className = 'magnifier' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" aria-hidden="true">
      <defs>
        <clipPath id="lens-clip">
          <circle cx="27" cy="27" r="17" />
        </clipPath>
      </defs>
      <path d="M40 40 L56 56" stroke="#1d3343" strokeWidth="9" strokeLinecap="round" />
      <path d="M40 40 L56 56" stroke="#ef8a2c" strokeWidth="5" strokeLinecap="round" />
      <circle cx="27" cy="27" r="19" fill="#fff6e4" stroke="#1d3343" strokeWidth="4" />
      <g clipPath="url(#lens-clip)">
        <rect x="8" y="27" width="40" height="20" fill="#5cb8e8" />
        <path d="M8 27 Q 14 24 20 27 T 32 27 T 44 27 T 56 27" fill="none" stroke="#ffffff" strokeWidth="2" />
        <rect x="8" y="8" width="40" height="19" fill="#f6d79a" />
        <path d="M20 26 C 19 21 21 17 24 14 C 25 19 24 23 20 26 Z" fill="#3f9b4b" />
        <circle cx="35" cy="16" r="4" fill="#ffc23d" />
        <path d="M28 37 q 3 -3 6 0 q -3 3 -6 0 z" fill="#ef8a2c" />
      </g>
      <path d="M15 21 Q18 14 25 12" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
    </svg>
  )
}
