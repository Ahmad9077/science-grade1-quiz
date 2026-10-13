import type { TopicId } from './catalog'

export type ToneId = TopicId | 'test'

// Each lesson keeps one colour everywhere it appears.
export const TONES: Record<ToneId, { tone: string; tint: string; deep: string }> = {
  plants: { tone: '#3d9a4a', tint: '#e1f5dc', deep: '#256b31' },
  movement: { tone: '#2f8fe0', tint: '#ddefff', deep: '#1c5f9e' },
  covering: { tone: '#e8871a', tint: '#ffefd6', deep: '#a65a07' },
  food: { tone: '#e5533d', tint: '#ffe3dc', deep: '#a8321f' },
  breathing: { tone: '#12a39a', tint: '#d6f4f0', deep: '#0b6f69' },
  reproduction: { tone: '#a463d6', tint: '#f0e4fb', deep: '#6f3a9c' },
  test: { tone: '#e3a008', tint: '#fff4cc', deep: '#9a6a00' },
}

export function toneStyle(id: ToneId): Record<string, string> {
  const { tone, tint, deep } = TONES[id]
  return { '--tone': tone, '--tint': tint, '--deep': deep }
}
