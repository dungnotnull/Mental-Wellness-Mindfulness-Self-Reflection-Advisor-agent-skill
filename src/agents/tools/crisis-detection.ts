/**
 * Crisis Detection Tool — Safety-Critical Component
 *
 * Detects crisis indicators in user messages and provides
 * appropriate tiered responses with resources.
 */

// ============================================================================
// CRISIS DETECTION TYPES
// ============================================================================

export interface CrisisAlert {
  detected: boolean;
  severity: 'severe' | 'moderate' | 'mild';
  message: string;
  resources: string[];
  detectedPhrases: string[];
  confidence: number;
}

export interface CrisisKeywords {
  severe: string[];
  moderate: string[];
  mild: string[];
}

// ============================================================================
// CRISIS KEYWORD CLASSIFICATION
// ============================================================================

/**
 * Crisis keyword patterns by severity tier
 */
export const CRISIS_KEYWORDS: CrisisKeywords = {
  severe: [
    'suicide',
    'kill myself',
    'end my life',
    'end it all',
    'want to die',
    'suicidal',
    'take my own life',
    'hurt myself',
    'self-harm',
    'plan to kill',
    'how to suicide',
    'method to kill',
    'want to commit suicide',
    'going to end it',
    'no reason to live',
    'better off dead',
    'don\'t want to be here',
    'end the pain',
    'escape through death',
    'no point living',
  ],
  moderate: [
    'hopeless',
    'despair',
    'can\'t go on',
    'too much pain',
    'can\'t take it anymore',
    'want to disappear',
    'want to give up',
    'overwhelmed',
    'burden',
    'don\'t know if I can do this',
    'at the end',
    'reached my limit',
    'can\'t handle this',
    'nothing helps',
    'trapped',
    'no way out',
    'exhausted',
    'drained',
    'empty',
    'numb',
  ],
  mild: [
    'stressed',
    'anxious',
    'worried',
    'down',
    'sad',
    'depressed',
    'lonely',
    'isolated',
    'struggling',
    'having a hard time',
    'not doing well',
    'need help',
    'difficult time',
    'going through a lot',
    'tough time',
    'challenging',
  ],
};

/**
 * Contextual phrases that may increase severity
 */
export const SEVERITY_ENHANCERS: string[] = [
  'right now',
  'today',
  'immediately',
  'can\'t wait',
  'about to',
  'planning to',
  'going to',
  'ready to',
  'decided to',
  'thinking about',
];

/**
 * Protective factors that may decrease severity
 */
export const PROTECTIVE_FACTORS: string[] = [
  'want help',
  'reach out',
  'talk to someone',
  'get support',
  'therapy',
  'counseling',
  'treatment',
  'medication',
  'support system',
  'family support',
  'friends help',
  'not alone',
  'hopeful',
];

/**
 * Diagnostic and treatment terms (filtered to avoid false positives)
 */
export const DIAGNOSTIC_FILTER_TERMS: string[] = [
  'bipolar',
  'schizophrenia',
  'personality disorder',
  'major depressive',
  'generalized anxiety',
  'panic disorder',
  'ptsd',
  'trauma',
  'therapy for',
  'treatment for',
  'diagnosed with',
];

// ============================================================================
// CRISIS DETECTION TOOL
// ============================================================================

export class CrisisDetectionTool {
  private keywords: CrisisKeywords;
  private severityEnhancers: string[];
  private protectiveFactors: string[];
  private diagnosticFilters: string[];

  constructor() {
    this.keywords = CRISIS_KEYWORDS;
    this.severityEnhancers = SEVERITY_ENHANCERS;
    this.protectiveFactors = PROTECTIVE_FACTORS;
    this.diagnosticFilters = DIAGNOSTIC_FILTER_TERMS;
  }

  /**
   * Detect crisis indicators in message
   */
  detect(message: string, conversationHistory?: string[]): CrisisAlert {
    const normalizedMessage = message.toLowerCase();
    const detectedPhrases: string[] = [];
    let severity: 'severe' | 'moderate' | 'mild' | null = null;
    let severityScore = 0;

    // Check for diagnostic/treatment terms (may be false positives)
    const isDiagnosticContext = this.diagnosticFilters.some((term) =>
      normalizedMessage.includes(term)
    );

    // Check for severe keywords
    for (const keyword of this.keywords.severe) {
      if (normalizedMessage.includes(keyword)) {
        detectedPhrases.push(keyword);
        severityScore += 10;
        severity = 'severe';
      }
    }

    // Check for moderate keywords
    for (const keyword of this.keywords.moderate) {
      if (normalizedMessage.includes(keyword)) {
        detectedPhrases.push(keyword);
        severityScore += 5;
        if (!severity) severity = 'moderate';
      }
    }

    // Check for mild keywords
    for (const keyword of this.keywords.mild) {
      if (normalizedMessage.includes(keyword)) {
        detectedPhrases.push(keyword);
        severityScore += 2;
        if (!severity) severity = 'mild';
      }
    }

    // Adjust for severity enhancers
    let enhancerCount = 0;
    for (const enhancer of this.severityEnhancers) {
      if (normalizedMessage.includes(enhancer)) {
        enhancerCount++;
        severityScore += 3;
        detectedPhrases.push(enhancer);
      }
    }

    // Adjust for protective factors
    let protectiveCount = 0;
    for (const factor of this.protectiveFactors) {
      if (normalizedMessage.includes(factor)) {
        protectiveCount++;
        severityScore -= 2;
      }
    }

    // Check conversation history for escalation patterns
    if (conversationHistory && conversationHistory.length > 0) {
      const recentMessages = conversationHistory.slice(-3).join(' ').toLowerCase();
      for (const keyword of this.keywords.severe) {
        if (recentMessages.includes(keyword)) {
          severityScore += 5;
        }
      }
    }

    // Determine final severity
    if (severityScore >= 10) {
      severity = 'severe';
    } else if (severityScore >= 5) {
      severity = 'moderate';
    } else if (severityScore >= 2) {
      severity = 'mild';
    }

    // If diagnostic context, may reduce severity unless clearly acute
    if (isDiagnosticContext && enhancerCount === 0 && severityScore < 15) {
      if (severity === 'severe') severity = 'moderate';
      else if (severity === 'moderate') severity = 'mild';
    }

    // Calculate confidence
    const confidence = this.calculateConfidence(detectedPhrases, enhancerCount, protectiveCount);

    // If no crisis detected
    if (!severity || detectedPhrases.length === 0) {
      return {
        detected: false,
        severity: 'mild',
        message: '',
        resources: [],
        detectedPhrases: [],
        confidence: 0,
      };
    }

    // Generate appropriate message and resources
    const { message: crisisMessage, resources } = this.generateCrisisResponse(severity);

    return {
      detected: true,
      severity,
      message: crisisMessage,
      resources,
      detectedPhrases,
      confidence,
    };
  }

  /**
   * Calculate confidence in detection
   */
  private calculateConfidence(
    detectedPhrases: string[],
    enhancerCount: number,
    protectiveCount: number
  ): number {
    if (detectedPhrases.length === 0) return 0;

    let confidence = 0.5;  // Base confidence

    // More phrases = higher confidence
    confidence += Math.min(detectedPhrases.length * 0.1, 0.3);

    // Severity enhancers increase confidence
    confidence += Math.min(enhancerCount * 0.05, 0.1);

    // Protective factors decrease confidence
    confidence -= Math.min(protectiveCount * 0.03, 0.1);

    return Math.max(0, Math.min(1, confidence));
  }

  /**
   * Generate crisis response based on severity
   */
  private generateCrisisResponse(severity: 'severe' | 'moderate' | 'mild'): {
    message: string;
    resources: string[];
  } {
    if (severity === 'severe') {
      return {
        message: 'I\'m concerned about your safety and want to make sure you have immediate support.',
        resources: [
          '988 Suicide & Crisis Lifeline: Dial or text 988 (24/7)',
          'Crisis Text Line: Text HOME to 741741 (24/7)',
          'Emergency Services: Dial 911',
          'Go to nearest emergency room',
        ],
      };
    } else if (severity === 'moderate') {
      return {
        message: 'I hear that you\'re going through a really difficult time. Support is available.',
        resources: [
          '988 Suicide & Crisis Lifeline: Dial or text 988 (24/7)',
          'Crisis Text Line: Text HOME to 741741',
          'International: https://findahelpline.com/',
          'Consider reaching out to a mental health professional',
        ],
      };
    } else {
      return {
        message: 'I understand things are difficult right now. You don\'t have to face this alone.',
        resources: [
          '988 Suicide & Crisis Lifeline: Dial or text 988 (24/7)',
          'Consider talking to a trusted friend or family member',
          'Mental health professionals can provide support',
        ],
      };
    }
  }

  /**
   * Check if message contains diagnostic language
   */
  containsDiagnosticLanguage(message: string): boolean {
    const normalizedMessage = message.toLowerCase();
    return this.diagnosticFilters.some((term) => normalizedMessage.includes(term));
  }

  /**
   * Get severity score for monitoring
   */
  getSeverityScore(message: string, conversationHistory?: string[]): number {
    const detection = this.detect(message, conversationHistory);

    if (!detection.detected) return 0;

    const severityValues = { severe: 10, moderate: 5, mild: 2 };
    return severityValues[detection.severity];
  }

  /**
   * Get escalation status
   */
  isEscalating(message: string, conversationHistory?: string[]): boolean {
    if (!conversationHistory || conversationHistory.length < 2) return false;

    const currentScore = this.getSeverityScore(message);
    const previousScores = conversationHistory
      .slice(-3)
      .map((msg) => this.getSeverityScore(msg));

    const avgPreviousScore =
      previousScores.reduce((sum, score) => sum + score, 0) / previousScores.length;

    return currentScore > avgPreviousScore * 1.5;  // 50% increase
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export { CRISIS_KEYWORDS, SEVERITY_ENHANCERS, PROTECTIVE_FACTORS, DIAGNOSTIC_FILTER_TERMS };
export type { CrisisAlert, CrisisKeywords };
