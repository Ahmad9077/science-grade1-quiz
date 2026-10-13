import { DRAWINGS } from './drawings'

interface ArtProps {
  art: string
  className?: string
}

/** Renders an emoji or one of the `svg:` drawings at the size of its container. */
export function Art({ art, className = '' }: ArtProps) {
  if (art.startsWith('svg:')) {
    const Drawing = DRAWINGS[art.slice(4)]
    if (!Drawing) throw new Error(`Missing drawing: ${art}`)
    return (
      <span className={`art art-svg ${className}`} aria-hidden="true">
        <Drawing />
      </span>
    )
  }

  return (
    <span className={`art art-emoji ${className}`} aria-hidden="true">
      {art}
    </span>
  )
}

export function hasDrawing(art: string): boolean {
  return !art.startsWith('svg:') || art.slice(4) in DRAWINGS
}
