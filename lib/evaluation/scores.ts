export interface DimensionBreakdown {
  technical: number         // 30%
  problemSolving: number    // 20%
  communication: number     // 15%
  confidence: number        // 10%
  behavioural: number       // 10%
  completeness: number      // 5%
  relevance: number         // 5%
  engagement: number        // 5%
}

export interface DimensionReasons {
  technical?: string
  problemSolving?: string
  communication?: string
  confidence?: string
  behavioural?: string
  completeness?: string
  relevance?: string
  engagement?: string
}

export function computeWeightedScore(
  scores: Partial<DimensionBreakdown>,
  qaPairsCount: number,
  isAbandoned: boolean
): { overallScore: number; verdict: string } {
  // Minimum Scoring Rules
  if (isAbandoned || qaPairsCount === 0) {
    const score = Math.min(5, Math.max(0, Math.round(scores.engagement || 0)));
    return { overallScore: score, verdict: 'no_hire' };
  }

  // 8 Dimension Weights
  const weights: Record<keyof DimensionBreakdown, number> = {
    technical: 0.30,
    problemSolving: 0.20,
    communication: 0.15,
    confidence: 0.10,
    behavioural: 0.10,
    completeness: 0.05,
    relevance: 0.05,
    engagement: 0.05,
  };

  let weightedSum = 0;
  for (const [key, weight] of Object.entries(weights)) {
    const val = scores[key as keyof DimensionBreakdown] ?? 0;
    const clampedVal = Math.max(0, Math.min(100, val));
    weightedSum += clampedVal * weight;
  }

  let finalScore = Math.round(weightedSum * 10) / 10;

  // Single Question Answered cap
  if (qaPairsCount === 1) {
    finalScore = Math.min(25, finalScore);
  }

  const verdict = determineHiringVerdict(finalScore, qaPairsCount);

  return { overallScore: finalScore, verdict };
}

export function determineHiringVerdict(overallScore: number, qaPairsCount: number): string {
  if (qaPairsCount === 0 || overallScore < 50) return 'no_hire';
  if (overallScore < 65) return 'need_improvement';
  if (overallScore < 78) return 'borderline';
  if (overallScore < 88) return 'hire';
  return 'strong_hire';
}

export function validateScores(raw: any) {
  const scores: Partial<DimensionBreakdown> = raw.scores || {};
  const clamped: Partial<DimensionBreakdown> = {
    technical: Math.max(0, Math.min(100, Number(scores.technical || 0))),
    problemSolving: Math.max(0, Math.min(100, Number(scores.problemSolving || 0))),
    communication: Math.max(0, Math.min(100, Number(scores.communication || 0))),
    confidence: Math.max(0, Math.min(100, Number(scores.confidence || 0))),
    behavioural: Math.max(0, Math.min(100, Number(scores.behavioural || 0))),
    completeness: Math.max(0, Math.min(100, Number(scores.completeness || 0))),
    relevance: Math.max(0, Math.min(100, Number(scores.relevance || 0))),
    engagement: Math.max(0, Math.min(100, Number(scores.engagement || 0))),
  };

  return {
    scores: clamped,
    reasons: raw.reasons || {},
    strengths: Array.isArray(raw.strengths) ? raw.strengths.slice(0, 5) : [],
    weaknesses: Array.isArray(raw.weaknesses) ? raw.weaknesses.slice(0, 5) : [],
    questionReviews: Array.isArray(raw.questionReviews) ? raw.questionReviews : [],
    metrics: raw.metrics || { speakingSpeedWPM: 130, wordsSpoken: 0, fillerWordCount: 0, skippedQuestions: 0 }
  };
}

