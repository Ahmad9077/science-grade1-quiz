import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import { describe, expect, it, vi } from 'vitest'
import { QUESTIONS } from '../../src/data/catalog'
import { bootstrapQuiz } from '../../src/hub/bootstrap'
import { HubBridge, levelFor, type Attempt } from '../../src/hub/bridge'
import type { HubWindow } from '../../src/hub/contracts'

const attempts: Attempt[] = [
  { questionKey: 'habitats:tick-lives-in-water', chosen: 'fish', correct: true },
  { questionKey: 'protect:tf-smoke-sick', chosen: 'no', correct: false },
]
const info = { kind: 'practice' as const, topic: 'habitats', difficulty: 'medium' as const }

describe('hub contract', () => {
  it('does not touch the Hub in preview mode', async () => {
    const context = await bootstrapQuiz('preview', {} as Window, {} as Document)
    expect(context).toEqual({ mode: 'preview', source: 'preview', difficulty: 'medium', preferredKeys: [] })
    const chosen = await bootstrapQuiz('preview', { location: { search: '?keys=habitats:tf-all-on-land' } } as Window, {} as Document)
    expect(chosen.preferredKeys).toEqual(['habitats:tf-all-on-land'])
    const record = vi.fn()
    const bridge = new HubBridge('preview', { QuizzesHubProgress: { record } } as HubWindow)
    expect(await bridge.reportRound(attempts, info)).toBe('none')
    expect(record).not.toHaveBeenCalled()
  })

  it('reports per-question attempts through the adaptive client', async () => {
    const recordAttempt = vi.fn().mockResolvedValue({ ok: true })
    const record = vi.fn()
    const bridge = new HubBridge('production-hub', { QuizzesHubAdaptive: { recordAttempt }, QuizzesHubProgress: { record } })
    expect(await bridge.reportRound(attempts, info)).toBe('adaptive')
    expect(recordAttempt).toHaveBeenCalledWith([
      { question: { key: 'habitats:tick-lives-in-water' }, correct: true },
      { question: { key: 'protect:tf-smoke-sick' }, correct: false },
    ])
    expect(record).not.toHaveBeenCalled()
  })

  it('falls back to aggregate progress once', async () => {
    const recordAttempt = vi.fn().mockResolvedValue({ ok: false })
    const record = vi.fn().mockResolvedValue({ ok: true })
    const bridge = new HubBridge('production-hub', { QuizzesHubAdaptive: { recordAttempt }, QuizzesHubProgress: { record } })
    expect(await bridge.reportRound(attempts, info)).toBe('progress')
    expect(record).toHaveBeenCalledTimes(1)
    expect(record.mock.calls[0]![0]).toMatchObject({ quizId: 'science-grade1', score: 1, total: 2, level: 'Practice' })
  })

  it('grades levels like the other Hub quizzes', () => {
    expect(levelFor(8, 8)).toBe('A+')
    expect(levelFor(7, 8)).toBe('A')
    expect(levelFor(5, 8)).toBe('Practice')
  })

  it('ships a seed that registers the quiz and profiles but no assignments', () => {
    execFileSync('node', ['scripts/generate-hub-seed.ts', '--check'])
    const sql = fs.readFileSync('integration/seed-science-grade1.sql', 'utf8')
    expect(sql).toContain("('science-grade1', 'علوم - بنات', 'https://ahmad9077.github.io/science-grade1-quiz/'")
    expect(sql).toContain("('science-grade1-boys', 'علوم - أولاد', 'https://ahmad9077.github.io/science-grade1-quiz/boys/'")
    expect(sql).not.toMatch(/insert into public\.quiz_assignments/i)
    // The first test's profiles go; attempt history stays.
    expect(sql).toMatch(/delete from public\.question_difficulty_profiles\nwhere quiz_id in \('science-grade1', 'science-grade1-boys'\)\n {2}and question_key not in \(/)
    expect(sql).not.toMatch(/delete from public\.(question_attempts|quiz_progress)/i)
    expect(sql).toContain(`<> ${QUESTIONS.length} then`)
    for (const question of QUESTIONS) {
      expect(sql).toContain(`('science-grade1', '${question.key}'`)
      expect(sql).toContain(`('science-grade1-boys', '${question.key}'`)
    }
  })

  it('keeps the manifest id and production path in step with the code', () => {
    const manifest = JSON.parse(fs.readFileSync('public/quiz-manifest.json', 'utf8'))
    expect(manifest.quizId).toBe('science-grade1')
    expect(manifest.basePath).toBe('/science-grade1-quiz/')
    expect(fs.readFileSync('vite.config.ts', 'utf8')).toContain("'/science-grade1-quiz/'")
  })
})
