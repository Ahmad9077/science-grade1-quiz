import type { TopicId } from './catalog'

export type ToneId = TopicId | 'test'

// The chapter's own colours: the sea blue of «أين تعيش الكائنات الحية؟», the leaf green of
// «كيف نحمي أماكن عيشها؟», and for the mock test the orange of the book's colouring activity.
export const TONES: Record<ToneId, { tone: string; tint: string; deep: string }> = {
  habitats: { tone: '#1f8ccf', tint: '#dcf0fb', deep: '#135f8e' },
  protect: { tone: '#2f9a4f', tint: '#ddf3e2', deep: '#1d6b35' },
  test: { tone: '#e9822a', tint: '#fdebd8', deep: '#a5520c' },
}

export function toneStyle(id: ToneId): Record<string, string> {
  const { tone, tint, deep } = TONES[id]
  return { '--tone': tone, '--tint': tint, '--deep': deep }
}
