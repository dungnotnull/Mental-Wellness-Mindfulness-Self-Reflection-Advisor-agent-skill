/**
 * Progress Tracking System — Individual Outcome Monitoring
 *
 * System for tracking user progress over time, calculating effect sizes,
 * and visualizing improvement trajectories.
 */

import { scoreAssessment, hasReliableChange, hasClinicallySignificantChange } from '../assessments/registry';

// ============================================================================
// PROGRESS DATA STRUCTURES
// ============================================================================

/**
 * Assessment record at a single timepoint
 */
export interface AssessmentRecord {
  assessmentId: string;
  timestamp: Date;
  responses: Record<string, number>;
  score: number;
  interpretation: string;
  subscaleScores?: Record<string, number>;
}

/**
 * Progress session data
 */
export interface ProgressSession {
  sessionId: string;
  timestamp: Date;
  assessments: AssessmentRecord[];
  notes?: string;
  techniques?: string[];
  userRating?: number;  // 1-10 scale
}

/**
 * User progress history
 */
export interface UserProgress {
  userId: string;
  sessions: ProgressSession[];
  baseline?: AssessmentRecord[];
  goals?: string[];
  startDate: Date;
  lastUpdated: Date;
}

/**
 * Progress metrics calculated over time
 */
export interface ProgressMetrics {
  assessmentId: string;
  baselineScore: number;
  currentScore: number;
  change: number;
  percentChange: number;
  effectSize: number;  // Cohen's d
  reliableChange: boolean;
  clinicallySignificant: boolean;
  trend: 'improving' | 'stable' | 'declining';
  trajectory: number[];  // Score over time
  timepoints: Date[];
}

// ============================================================================
// PROGRESS CALCULATION FUNCTIONS
// ============================================================================

/**
 * Add a new assessment session to user progress
 */
export function addAssessmentSession(
  progress: UserProgress,
  session: ProgressSession
): UserProgress {
  return {
    ...progress,
    sessions: [...progress.sessions, session],
    lastUpdated: new Date(),
  };
}

/**
 * Calculate progress metrics for a specific assessment
 */
export function calculateProgressMetrics(
  progress: UserProgress,
  assessmentId: string
): ProgressMetrics | null {
  // Extract all scores for this assessment across sessions
  const assessmentScores: { score: number; timestamp: Date }[] = [];

  for (const session of progress.sessions) {
    const assessment = session.assessments.find((a) => a.assessmentId === assessmentId);
    if (assessment) {
      assessmentScores.push({
        score: assessment.score,
        timestamp: session.timestamp,
      });
    }
  }

  if (assessmentScores.length < 2) {
    return null;  // Need at least 2 timepoints for progress
  }

  // Sort by timestamp
  assessmentScores.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

  const baselineScore = assessmentScores[0].score;
  const currentScore = assessmentScores[assessmentScores.length - 1].score;
  const change = currentScore - baselineScore;
  const percentChange = (change / baselineScore) * 100;

  // Calculate effect size (Cohen's d)
  const effectSize = calculateEffectSize(
    assessmentScores.map((s) => s.score),
    baselineScore
  );

  // Determine trend
  const trend = determineTrend(assessmentScores.map((s) => s.score));

  return {
    assessmentId,
    baselineScore,
    currentScore,
    change,
    percentChange,
    effectSize,
    reliableChange: hasReliableChange(assessmentId, baselineScore, currentScore),
    clinicallySignificant: hasClinicallySignificantChange(assessmentId, baselineScore, currentScore),
    trend,
    trajectory: assessmentScores.map((s) => s.score),
    timepoints: assessmentScores.map((s) => s.timestamp),
  };
}

/**
 * Calculate Cohen's d effect size for within-subjects change
 */
function calculateEffectSize(scores: number[], baseline: number): number {
  if (scores.length < 2) return 0;

  const mean = scores.reduce((sum, score) => sum + score, 0) / scores.length;

  // Standard deviation
  const squaredDiffs = scores.map((score) => Math.pow(score - mean, 2));
  const variance = squaredDiffs.reduce((sum, diff) => sum + diff, 0) / (scores.length - 1);
  const stdDev = Math.sqrt(variance);

  if (stdDev === 0) return 0;

  // Cohen's d = (mean - baseline) / SD
  return (mean - baseline) / stdDev;
}

/**
 * Determine trend from score sequence
 */
function determineTrend(scores: number[]): 'improving' | 'stable' | 'declining' {
  if (scores.length < 3) return 'stable';

  // Calculate linear regression slope
  const n = scores.length;
  const xMean = (n - 1) / 2;
  const yMean = scores.reduce((sum, score) => sum + score, 0) / n;

  let numerator = 0;
  let denominator = 0;

  for (let i = 0; i < n; i++) {
    numerator += (i - xMean) * (scores[i] - yMean);
    denominator += Math.pow(i - xMean, 2);
  }

  const slope = denominator !== 0 ? numerator / denominator : 0;

  // Determine direction based on slope magnitude
  if (Math.abs(slope) < 0.1) return 'stable';
  return slope > 0 ? 'improving' : 'declining';
}

/**
 * Calculate response rate for clinical assessments
 */
export function calculateResponseRate(
  progress: UserProgress,
  assessmentId: string,
  responseCutoff: number
): number {
  const metrics = calculateProgressMetrics(progress, assessmentId);
  if (!metrics) return 0;

  // Response defined as achieving reliable change AND crossing clinical cutoff
  const changed = metrics.reliableChange || metrics.clinicallySignificant;
  const improved = metrics.change >= responseCutoff;

  return (changed && improved) ? 1 : 0;
}

/**
 * Calculate group-level statistics across all users
 */
export interface GroupStatistics {
  assessmentId: string;
  n: number;  // Number of users
  meanBaseline: number;
  meanCurrent: number;
  meanChange: number;
  meanEffectSize: number;
  responseRate: number;
  reliableChangeRate: number;
  clinicallySignificantRate: number;
  improvingRate: number;
  stableRate: number;
  decliningRate: number;
}

export function calculateGroupStatistics(
  users: UserProgress[],
  assessmentId: string,
  responseCutoff: number
): GroupStatistics {
  const validMetrics: ProgressMetrics[] = [];

  for (const user of users) {
    const metrics = calculateProgressMetrics(user, assessmentId);
    if (metrics) validMetrics.push(metrics);
  }

  const n = validMetrics.length;
  if (n === 0) {
    return {
      assessmentId,
      n: 0,
      meanBaseline: 0,
      meanCurrent: 0,
      meanChange: 0,
      meanEffectSize: 0,
      responseRate: 0,
      reliableChangeRate: 0,
      clinicallySignificantRate: 0,
      improvingRate: 0,
      stableRate: 0,
      decliningRate: 0,
    };
  }

  const meanBaseline = validMetrics.reduce((sum, m) => sum + m.baselineScore, 0) / n;
  const meanCurrent = validMetrics.reduce((sum, m) => sum + m.currentScore, 0) / n;
  const meanChange = validMetrics.reduce((sum, m) => sum + m.change, 0) / n;
  const meanEffectSize = validMetrics.reduce((sum, m) => sum + m.effectSize, 0) / n;

  const responseRate = validMetrics.filter((m) =>
    (m.reliableChange || m.clinicallySignificant) && m.change >= responseCutoff
  ).length / n;

  const reliableChangeRate = validMetrics.filter((m) => m.reliableChange).length / n;
  const clinicallySignificantRate = validMetrics.filter((m) => m.clinicallySignificant).length / n;

  const improvingRate = validMetrics.filter((m) => m.trend === 'improving').length / n;
  const stableRate = validMetrics.filter((m) => m.trend === 'stable').length / n;
  const decliningRate = validMetrics.filter((m) => m.trend === 'declining').length / n;

  return {
    assessmentId,
    n,
    meanBaseline,
    meanCurrent,
    meanChange,
    meanEffectSize,
    responseRate,
    reliableChangeRate,
    clinicallySignificantRate,
    improvingRate,
    stableRate,
    decliningRate,
  };
}

// ============================================================================
// RESILIENCE ANALYSIS
// ============================================================================

/**
 * Analyze resilience patterns from assessment trajectories
 */
export interface ResilienceAnalysis {
  assessmentId: string;
  resilienceScore: number;  // 0-100
  volatility: number;  // Standard deviation of scores
  recoverySpeed: number;  // Average recovery from low points
  overallTrajectory: 'resilient' | 'recovering' | 'struggling' | 'deteriorating';
  insights: string[];
}

export function analyzeResilience(
  progress: UserProgress,
  assessmentId: string
): ResilienceAnalysis | null {
  const metrics = calculateProgressMetrics(progress, assessmentId);
  if (!metrics || metrics.trajectory.length < 4) return null;

  const scores = metrics.trajectory;
  const mean = scores.reduce((sum, s) => sum + s, 0) / scores.length;

  // Volatility (standard deviation)
  const variance = scores.reduce((sum, s) => sum + Math.pow(s - mean, 2), 0) / scores.length;
  const volatility = Math.sqrt(variance);

  // Find low points (scores below mean)
  const lowPoints = scores.filter((s) => s < mean);
  let recoverySpeed = 0;

  if (lowPoints.length > 0) {
    const recoveries: number[] = [];

    for (let i = 0; i < scores.length; i++) {
      if (scores[i] < mean && i < scores.length - 1) {
        // Found a low point, count steps to recover above mean
        let stepsToRecover = 0;
        for (let j = i + 1; j < scores.length; j++) {
          stepsToRecover++;
          if (scores[j] >= mean) break;
        }
        if (stepsToRecover > 0 && stepsToRecover < scores.length - i - 1) {
          recoveries.push(stepsToRecover);
        }
      }
    }

    recoverySpeed = recoveries.length > 0
      ? recoveries.reduce((sum, r) => sum + r, 0) / recoveries.length
      : 0;
  }

  // Calculate resilience score (0-100)
  // Higher resilience = low volatility, fast recovery, improving trend
  const volatilityComponent = Math.max(0, 100 - (volatility / mean) * 100);
  const recoveryComponent = recoverySpeed > 0 ? Math.max(0, 100 - recoverySpeed * 10) : 50;
  const trendComponent = metrics.trend === 'improving' ? 100 : metrics.trend === 'stable' ? 50 : 0;

  const resilienceScore = (volatilityComponent + recoveryComponent + trendComponent) / 3;

  // Determine overall trajectory
  let overallTrajectory: 'resilient' | 'recovering' | 'struggling' | 'deteriorating';

  if (metrics.trend === 'improving' && volatility < mean * 0.3) {
    overallTrajectory = 'resilient';
  } else if (metrics.trend === 'improving' && recoverySpeed < 3) {
    overallTrajectory = 'recovering';
  } else if (metrics.trend === 'stable' || recoverySpeed > 0) {
    overallTrajectory = 'struggling';
  } else {
    overallTrajectory = 'deteriorating';
  }

  // Generate insights
  const insights: string[] = [];

  if (volatility < mean * 0.2) {
    insights.push('Low score volatility indicates consistent functioning.');
  } else if (volatility > mean * 0.5) {
    insights.push('High volatility suggests fluctuating symptoms or responses.');
  }

  if (recoverySpeed < 2) {
    insights.push('Fast recovery from low points indicates good resilience.');
  } else if (recoverySpeed > 4) {
    insights.push('Slow recovery suggests difficulty bouncing back from setbacks.');
  }

  if (metrics.trend === 'improving') {
    insights.push('Improving trajectory shows positive response to interventions.');
  } else if (metrics.trend === 'declining') {
    insights.push('Declining trajectory may indicate need for intervention adjustment.');
  }

  return {
    assessmentId,
    resilienceScore,
    volatility,
    recoverySpeed,
    overallTrajectory,
    insights,
  };
}

// ============================================================================
// PREDICTIVE ANALYSIS
// ============================================================================

/**
 * Predict likelihood of reaching target score
 */
export interface PredictionResult {
  assessmentId: string;
  targetScore: number;
  currentScore: number;
  likelihood: number;  // 0-100
    estimatedTimepoints: number;
    confidence: number;  // 0-100
    factors: string[];
}

export function predictGoalAttainment(
  progress: UserProgress,
  assessmentId: string,
  targetScore: number
): PredictionResult | null {
  const metrics = calculateProgressMetrics(progress, assessmentId);
  if (!metrics || metrics.trajectory.length < 3) return null;

  const scores = metrics.trajectory;
  const currentScore = metrics.currentScore;

  // Calculate average rate of change per timepoint
  const totalChange = scores[scores.length - 1] - scores[0];
  const rateOfChange = totalChange / (scores.length - 1);

  // Estimate timepoints to reach target
  const remainingChange = targetScore - currentScore;
  const estimatedTimepoints = rateOfChange !== 0
    ? Math.abs(remainingChange / rateOfChange)
    : Infinity;

  // Calculate likelihood based on trend and consistency
  let likelihood = 50;  // Baseline

  if (metrics.trend === 'improving') {
    likelihood += 30;
  } else if (metrics.trend === 'stable') {
    likelihood += 10;
  } else {
    likelihood -= 20;
  }

  // Adjust for volatility
  const mean = scores.reduce((sum, s) => sum + s, 0) / scores.length;
  const variance = scores.reduce((sum, s) => sum + Math.pow(s - mean, 2), 0) / scores.length;
  const consistency = 1 - (Math.sqrt(variance) / mean);

  likelihood += consistency * 20;

  // Adjust for distance to target
  const distanceRatio = Math.abs(remainingChange) / mean;
  if (distanceRatio < 0.5) {
    likelihood += 10;
  } else if (distanceRatio > 1.5) {
    likelihood -= 20;
  }

  likelihood = Math.max(0, Math.min(100, likelihood));

  // Calculate confidence based on data points
  const confidence = Math.min(100, (scores.length / 10) * 100);

  // Identify factors
  const factors: string[] = [];

  if (metrics.trend === 'improving') {
    factors.push('Positive trend direction');
  } else if (metrics.trend === 'declining') {
    factors.push('Negative trend direction');
  }

  if (consistency > 0.7) {
    factors.push('High score consistency');
  } else if (consistency < 0.3) {
    factors.push('Low score consistency');
  }

  if (rateOfChange > 0.5) {
    factors.push('Strong rate of improvement');
  } else if (rateOfChange < 0.1 && rateOfChange > 0) {
    factors.push('Slow rate of change');
  }

  if (estimatedTimepoints > 20) {
    factors.push('Target may be distant given current trajectory');
  }

  return {
    assessmentId,
    targetScore,
    currentScore,
    likelihood,
    estimatedTimepoints: Math.round(estimatedTimepoints),
    confidence,
    factors,
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

export type {
  AssessmentRecord,
  ProgressSession,
  UserProgress,
  ProgressMetrics,
  ResilienceAnalysis,
  PredictionResult,
};
