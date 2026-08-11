type Phase = 'intro' | 'questioning' | 'coding' | 'wrap_up' | 'ended'

export function getNextPhase(
  currentPhase: Phase,
  questionIndex: number,
  minutesElapsed: number,
  totalDuration: number,
  interviewType: string
): Phase {
  const timeRemaining = totalDuration - minutesElapsed
  const progressPct = minutesElapsed / totalDuration

  if (timeRemaining <= 2) return 'wrap_up'
  if (currentPhase === 'wrap_up') return 'ended'

  // Coding round kicks in at 60% through a mixed/coding interview
  if (interviewType === 'coding' && currentPhase === 'intro') return 'questioning'
  if (['mixed', 'coding'].includes(interviewType) && progressPct > 0.6 && currentPhase === 'questioning') return 'coding'

  if (currentPhase === 'intro' && questionIndex >= 1) return 'questioning'

  return currentPhase
}

// Detect special user commands in transcripts
export function parseUserIntent(transcript: string): {
  type: 'answer' | 'skip' | 'repeat' | 'end' | 'clarify'
  text: string
} {
  const lower = transcript.toLowerCase().trim()

  if (lower.includes('[skip]') || lower.match(/^(skip|next question|move on)/)) {
    return { type: 'skip', text: transcript }
  }
  if (lower.includes('[repeat]') || lower.match(/^(repeat|say that again|can you repeat)/)) {
    return { type: 'repeat', text: transcript }
  }
  if (lower.includes('[end]') || lower.match(/^(end interview|stop|finish)/)) {
    return { type: 'end', text: transcript }
  }
  if (lower.match(/^(can you clarify|what do you mean|i don't understand)/)) {
    return { type: 'clarify', text: transcript }
  }

  return { type: 'answer', text: transcript }
}
