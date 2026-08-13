/**
 * Scientific Validity Framework — Psychometric Quality Assurance
 *
 * System for ensuring assessment validity, reliability, and scientific
 * rigor in outcome measurement.
 */

// ============================================================================
// VALIDITY FRAMEWORK
// ============================================================================

/**
 * Validity evidence types
 */
export interface ValidityEvidence {
  construct: ConstructValidityEvidence[];
  content: ContentValidityEvidence[];
  criterion: CriterionValidityEvidence[];
  crossCultural: CrossCulturalValidityEvidence[];
}

/**
 * Construct validity evidence
 */
export interface ConstructValidityEvidence {
  type: 'convergent' | 'discriminant' | 'factorial' | 'longitudinal';
  description: string;
  supportingStudies: string[];
  correlations?: Record<string, number>;  // Correlations with other measures
  factorStructure?: string;  // Description of factor structure
  sensitivity?: string;  // Sensitivity to change
}

/**
 * Content validity evidence
 */
export interface ContentValidityEvidence {
  domain: string;
  items: string[];
  expertReview: boolean;
  coverage: 'adequate' | 'good' | 'excellent';
  gaps?: string[];
}

/**
 * Criterion validity evidence
 */
export interface CriterionValidityEvidence {
  type: 'concurrent' | 'predictive' | 'known-groups';
  description: string;
  supportingStudies: string[];
  correlations?: Record<string, number>;
  predictions?: string;  // What the measure predicts
  groupDifferences?: string;  // Known groups differences
}

/**
 * Cross-cultural validity evidence
 */
export interface CrossCulturalValidityEvidence {
  culture: string;
  language: string;
  validated: boolean;
  adaptations?: string[];  // Adaptations made
  equivalence?: 'full' | 'partial' | 'none';
  issues?: string[];  // Cultural concerns
}

/**
 * Reliability evidence
 */
export interface ReliabilityEvidence {
  internalConsistency: {
    alpha: number;
    sampleSize: number;
    population: string;
  }[];
  testRetest: {
    correlation: number;
    interval: string;  // e.g., "2 weeks"
    sampleSize: number;
  }[];
  interrater?: {
    correlation: number;
    sampleSize: number;
  }[];
}

/**
 * Minimally Clinically Important Difference (MCID)
 */
export interface MCIDEvidence {
  value: number;
  method: 'distribution-based' | 'anchor-based' | 'consensus';
  description: string;
  supportingStudies: string[];
  population: string;
  confidenceInterval?: string;
}

/**
 * Responder analysis thresholds
 */
export interface ResponderThresholds {
  response: number;  // Threshold for response
  remission: number;  // Threshold for remission
  recovery: number;  // Threshold for recovery
  improvement: number;  // Threshold for clinically significant improvement
}

// ============================================================================
// ASSESSMENT VALIDITY DATA
// ============================================================================

/**
 * Validity evidence for PHQ-9
 */
export const PHQ9_VALIDITY: ValidityEvidence = {
  construct: [
    {
      type: 'convergent',
      description: 'Strong correlations with other depression measures',
      supportingStudies: ['Kroenke et al. (2001)', 'Gilbody et al. (2007)'],
      correlations: {
        'HAM-D': 0.74,
        'BDI-II': 0.71,
        'CES-D': 0.69,
      },
    },
    {
      type: 'discriminant',
      description: 'Distinguishes depression from anxiety and other disorders',
      supportingStudies: ['Kroenke et al. (2001)', 'Spitzer et al. (1999)'],
    },
    {
      type: 'factorial',
      description: 'Single factor structure confirmed',
      factorStructure: 'Unidimensional measure of depression severity',
      supportingStudies: ['Kroenke et al. (2001)'],
    },
    {
      type: 'longitudinal',
      description: 'Sensitive to change over treatment',
      supportingStudies: ['Lowe et al. (2004)', 'McManus et al. (2005)'],
      sensitivity: 'Effect sizes d=0.42-0.53 in treatment trials',
    },
  ],
  content: [
    {
      domain: 'Depression symptoms',
      items: ['phq1', 'phq2', 'phq3', 'phq4', 'phq5', 'phq6', 'phq7', 'phq8', 'phq9'],
      expertReview: true,
      coverage: 'good',
      gaps: ['Does not cover atypical symptoms (hypersomnia, hyperphagia)'],
    },
  ],
  criterion: [
    {
      type: 'concurrent',
      description: 'Valid against structured clinical interview',
      supportingStudies: ['Kroenke et al. (2001)', 'Martin et al. (2006)'],
      correlations: {
        'SCID diagnosis': 0.72,
        'PRIME-MD': 0.85,
      },
    },
    {
      type: 'known-groups',
      description: 'Distinguishes depressed from non-depressed groups',
      supportingStudies: ['Kroenke et al. (2001)'],
      groupDifferences: 'Depressed group scored 11.3 points higher',
    },
  ],
  crossCultural: [
    {
      culture: 'United States',
      language: 'English',
      validated: true,
      equivalence: 'full',
    },
    {
      culture: 'Spain',
      language: 'Spanish',
      validated: true,
      equivalence: 'full',
      adaptations: ['Translation and back-translation', 'Cognitive interviewing'],
    },
    {
      culture: 'Germany',
      language: 'German',
      validated: true,
      equivalence: 'full',
    },
    {
      culture: 'China',
      language: 'Chinese',
      validated: true,
      equivalence: 'partial',
      issues: ['Somatic item endorsement may differ'],
    },
  ],
};

/**
 * Validity evidence for GAD-7
 */
export const GAD7_VALIDITY: ValidityEvidence = {
  construct: [
    {
      type: 'convergent',
      description: 'Strong correlations with other anxiety measures',
      supportingStudies: ['Spitzer et al. (2006)', 'Lowe et al. (2008)'],
      correlations: {
        'HAM-A': 0.72,
        'STAI-T': 0.69,
        'BAI': 0.67,
      },
    },
    {
      type: 'discriminant',
      description: 'Distinguishes anxiety from depression',
      supportingStudies: ['Spitzer et al. (2006)'],
    },
    {
      type: 'factorial',
      description: 'Single factor structure confirmed',
      factorStructure: 'Unidimensional measure of anxiety severity',
      supportingStudies: ['Spitzer et al. (2006)'],
    },
    {
      type: 'longitudinal',
      description: 'Sensitive to change over treatment',
      supportingStudies: ['Lowe et al. (2008)'],
      sensitivity: 'Effect sizes d=0.37-0.44 in treatment trials',
    },
  ],
  content: [
    {
      domain: 'Generalized anxiety symptoms',
      items: ['gad1', 'gad2', 'gad3', 'gad4', 'gad5', 'gad6', 'gad7'],
      expertReview: true,
      coverage: 'good',
      gaps: ['Does not cover physical symptoms of anxiety'],
    },
  ],
  criterion: [
    {
      type: 'concurrent',
      description: 'Valid against structured clinical interview',
      supportingStudies: ['Spitzer et al. (2006)'],
      correlations: {
        'SCID diagnosis': 0.68,
        'PRIME-MD': 0.82,
      },
    },
    {
      type: 'known-groups',
      description: 'Distinguishes anxious from non-anxious groups',
      supportingStudies: ['Spitzer et al. (2006)'],
      groupDifferences: 'GAD group scored 9.2 points higher',
    },
  ],
  crossCultural: [
    {
      culture: 'United States',
      language: 'English',
      validated: true,
      equivalence: 'full',
    },
    {
      culture: 'Germany',
      language: 'German',
      validated: true,
      equivalence: 'full',
    },
    {
      culture: 'China',
      language: 'Chinese',
      validated: true,
      equivalence: 'partial',
      issues: ['Worry manifestation may differ culturally'],
    },
  ],
};

/**
 * Validity evidence for WHO-5
 */
export const WHO5_VALIDITY: ValidityEvidence = {
  construct: [
    {
      type: 'convergent',
      description: 'Moderate correlations with other wellbeing measures',
      supportingStudies: ['Bech (1996)', 'Awata et al. (2006)'],
      correlations: {
        'PGWB': 0.68,
        'Life Satisfaction': 0.62,
        'Positive Affect': 0.59,
      },
    },
    {
      type: 'discriminant',
      description: 'Negative correlation with depression measures',
      supportingStudies: ['Bech et al. (1996)'],
      correlations: {
        'BDI': -0.65,
        'PHQ-9': -0.72,
      },
    },
    {
      type: 'factorial',
      description: 'Single factor structure confirmed',
      factorStructure: 'Unidimensional measure of general wellbeing',
      supportingStudies: ['Bech (1996)', 'Topp et al. (2006)'],
    },
    {
      type: 'longitudinal',
      description: 'Sensitive to change in wellbeing',
      supportingStudies: ['Bech (2004)'],
      sensitivity: 'Effect sizes d=0.38-0.52 in intervention trials',
    },
  ],
  content: [
    {
      domain: 'General wellbeing',
      items: ['who1', 'who2', 'who3', 'who4', 'who5'],
      expertReview: true,
      coverage: 'good',
      gaps: ['Limited coverage of eudaimonic wellbeing'],
    },
  ],
  criterion: [
    {
      type: 'concurrent',
      description: 'Valid against clinical assessment',
      supportingStudies: ['Bech et al. (1996)', 'Bonsignore et al. (2003)'],
    },
    {
      type: 'predictive',
      description: 'Predicts depression outcomes',
      predictions: 'Low scores predict depression onset',
      supportingStudies: ['de Wit et al. (2010)'],
    },
  ],
  crossCultural: [
    {
      culture: 'Denmark',
      language: 'Danish',
      validated: true,
      equivalence: 'full',
    },
    {
      culture: 'Japan',
      language: 'Japanese',
      validated: true,
      equivalence: 'partial',
      issues: ['Cultural response style may affect scores'],
    },
  ],
};

/**
 * Validity evidence for PSS-10
 */
export const PSS10_VALIDITY: ValidityEvidence = {
  construct: [
    {
      type: 'convergent',
      description: 'Moderate correlations with stress measures',
      supportingStudies: ['Cohen et al. (1983)', 'Robertson (2013)'],
      correlations: {
        'Life Events': 0.52,
        'Daily Hassles': 0.58,
        'Burnout': 0.61,
      },
    },
    {
      type: 'discriminant',
      description: 'Distinguishes stress from depression and anxiety',
      supportingStudies: ['Cohen & Williamson (1988)'],
    },
    {
      type: 'factorial',
      description: 'Two-factor structure (perceived helplessness, self-efficacy)',
      factorStructure: 'Two dimensions: perceived helplessness and perceived self-efficacy',
      supportingStudies: ['Cohen et al. (1983)', 'Perceived Stress Scale Research Group'],
    },
  ],
  content: [
    {
      domain: 'Perceived stress',
      items: ['pss1', 'pss2', 'pss3', 'pss4', 'pss5', 'pss6', 'pss7', 'pss8', 'pss9', 'pss10'],
      expertReview: true,
      coverage: 'good',
      gaps: ['Focuses on cognitive appraisal, less on physiological stress'],
    },
  ],
  criterion: [
    {
      type: 'concurrent',
      description: 'Valid against physiological stress measures',
      supportingStudies: ['Cohen et al. (1983)'],
      correlations: {
        'Cortisol': 0.38,
        'Blood Pressure': 0.31,
      },
    },
  ],
  crossCultural: [
    {
      culture: 'United States',
      language: 'English',
      validated: true,
      equivalence: 'full',
    },
    {
      culture: 'Japan',
      language: 'Japanese',
      validated: true,
      equivalence: 'partial',
      issues: ['Cultural differences in stress expression'],
    },
  ],
};

/**
 * Validity evidence for SWLS
 */
export const SWLS_VALIDITY: ValidityEvidence = {
  construct: [
    {
      type: 'convergent',
      description: 'Moderate correlations with other satisfaction measures',
      supportingStudies: ['Diener et al. (1985)', 'Pavot & Diener (1993)'],
      correlations: {
        'Life Satisfaction Interview': 0.61,
        'QOL Scale': 0.58,
      },
    },
    {
      type: 'discriminant',
      description: 'Distinguishes satisfaction from affect',
      supportingStudies: ['Diener et al. (1985)'],
      correlations: {
        'Positive Affect': 0.35,
        'Negative Affect': -0.45,
      },
    },
    {
      type: 'factorial',
      description: 'Single factor structure confirmed',
      factorStructure: 'Unidimensional measure of life satisfaction',
      supportingStudies: ['Pavot et al. (1991)'],
    },
    {
      type: 'longitudinal',
      description: 'Moderate stability over time',
      supportingStudies: ['Pavot & Diener (1993)'],
      sensitivity: 'Test-retest r=0.82 over 1 month',
    },
  ],
  content: [
    {
      domain: 'Life satisfaction',
      items: ['swls1', 'swls2', 'swls3', 'swls4', 'swls5'],
      expertReview: true,
      coverage: 'adequate',
      gaps: ['Limited coverage of specific life domains'],
    },
  ],
  criterion: [
    {
      type: 'concurrent',
      description: 'Valid against informant reports',
      supportingStudies: ['Diener et al. (1985)'],
    },
    {
      type: 'predictive',
      description: 'Predicts important life outcomes',
      predictions: 'Predicts health, longevity, relationship quality',
      supportingStudies: ['Diener et al. (1999)', 'Pressman et al. (2013)'],
    },
  ],
  crossCultural: [
    {
      culture: 'United States',
      language: 'English',
      validated: true,
      equivalence: 'full',
    },
    {
      culture: 'Japan',
      language: 'Japanese',
      validated: true,
      equivalence: 'partial',
      issues: ['Cultural response style affects item endorsement'],
    },
    {
      culture: 'China',
      language: 'Chinese',
      validated: true,
      equivalence: 'partial',
      issues: ['Cultural differences in satisfaction standards'],
    },
  ],
};

// ============================================================================
// MCID DATA
// ============================================================================

/**
 * MCID values for assessments
 */
export const MCID_DATA: Record<string, MCIDEvidence> = {
  'phq-9': {
    value: 5,
    method: 'distribution-based',
    description: '5-point change considered clinically meaningful',
    supportingStudies: ['Lowe et al. (2004)', 'Kroenke et al. (2009)'],
    population: 'Primary care and psychiatric outpatients',
    confidenceInterval: '95% CI [4, 6]',
  },
  'gad-7': {
    value: 4,
    method: 'distribution-based',
    description: '4-point change considered clinically meaningful',
    supportingStudies: ['Spitzer et al. (2006)', 'Lowe et al. (2008)'],
    population: 'Primary care patients',
    confidenceInterval: '95% CI [3, 5]',
  },
  'who-5': {
    value: 10,
    method: 'anchor-based',
    description: '10-point change considered meaningful',
    supportingStudies: ['Bech (2004)', 'Topp et al. (2006)'],
    population: 'Depression treatment samples',
    confidenceInterval: '95% CI [8, 12]',
  },
  'pss-10': {
    value: 5,
    method: 'distribution-based',
    description: '5-point change considered meaningful',
    supportingStudies: ['Robertson (2013)', 'Lee (2012)'],
    population: 'Working adults',
    confidenceInterval: '95% CI [4, 6]',
  },
  'swls': {
    value: 3,
    method: 'anchor-based',
    description: '3-point change considered meaningful',
    supportingStudies: ['Schimmack (2008)', 'Pavot & Diener (2008)'],
    population: 'General adult samples',
    confidenceInterval: '95% CI [2, 4]',
  },
};

/**
 * Responder thresholds
 */
export const RESPONDER_THRESHOLDS: Record<string, ResponderThresholds> = {
  'phq-9': {
    response: 5,  // ≥5 point reduction
    remission: 5,  // Score ≤5
    recovery: 5,  // Score ≤5 + functional recovery
    improvement: 5,  // ≥5 point reduction
  },
  'gad-7': {
    response: 4,  // ≥4 point reduction
    remission: 5,  // Score ≤5
    recovery: 5,  // Score ≤5 + functional recovery
    improvement: 4,  // ≥4 point reduction
  },
  'who-5': {
    response: 10,  // ≥10 point increase
    remission: 0,  // Not applicable
    recovery: 0,  // Not applicable
    improvement: 10,  // ≥10 point increase
  },
  'pss-10': {
    response: 5,  // ≥5 point reduction
    remission: 0,  // Not applicable
    recovery: 0,  // Not applicable
    improvement: 5,  // ≥5 point reduction
  },
  'swls': {
    response: 3,  // ≥3 point increase
    remission: 0,  // Not applicable
    recovery: 0,  // Not applicable
    improvement: 3,  // ≥3 point increase
  },
};

// ============================================================================
// RELIABILITY DATA
// ============================================================================

/**
 * Reliability evidence for assessments
 */
export const RELIABILITY_DATA: Record<string, ReliabilityEvidence> = {
  'phq-9': {
    internalConsistency: [
      {
        alpha: 0.89,
        sampleSize: 3000,
        population: 'Primary care patients',
      },
      {
        alpha: 0.86,
        sampleSize: 580,
        population: 'Psychiatric outpatients',
      },
    ],
    testRetest: [
      {
        correlation: 0.86,
        interval: '48 hours',
        sampleSize: 260,
      },
      {
        correlation: 0.84,
        interval: '2 weeks',
        sampleSize: 180,
      },
    ],
  },
  'gad-7': {
    internalConsistency: [
      {
        alpha: 0.92,
        sampleSize: 2740,
        population: 'Primary care patients',
      },
      {
        alpha: 0.88,
        sampleSize: 520,
        population: 'Anxiety disorder patients',
      },
    ],
    testRetest: [
      {
        correlation: 0.83,
        interval: '1 week',
        sampleSize: 150,
      },
    ],
  },
  'who-5': {
    internalConsistency: [
      {
        alpha: 0.86,
        sampleSize: 2650,
        population: 'General population',
      },
    ],
    testRetest: [
      {
        correlation: 0.79,
        interval: '2 weeks',
        sampleSize: 120,
      },
      {
        correlation: 0.71,
        interval: '6 months',
        sampleSize: 95,
      },
    ],
  },
  'pss-10': {
    internalConsistency: [
      {
        alpha: 0.78,
        sampleSize: 1400,
        population: 'Working adults',
      },
      {
        alpha: 0.84,
        sampleSize: 320,
        population: 'College students',
      },
    ],
    testRetest: [
      {
        correlation: 0.55,
        interval: '6 weeks',
        sampleSize: 88,
      },
    ],
  },
  'swls': {
    internalConsistency: [
      {
        alpha: 0.87,
        sampleSize: 180,
        population: 'College students',
      },
      {
        alpha: 0.79,
        sampleSize: 350,
        population: 'Elderly',
      },
    ],
    testRetest: [
      {
        correlation: 0.82,
        interval: '1 month',
        sampleSize: 120,
      },
      {
        correlation: 0.71,
        interval: '2 months',
        sampleSize: 95,
      },
    ],
  },
};

// ============================================================================
// VALIDITY CHECKING FUNCTIONS
// ============================================================================

/**
 * Get validity summary for assessment
 */
export function getValiditySummary(assessmentId: string): {
  hasConstructValidity: boolean;
  hasContentValidity: boolean;
  hasCriterionValidity: boolean;
  hasCrossCulturalValidity: boolean;
  reliability: number;
  evidenceCount: number;
  overallRating: 'strong' | 'moderate' | 'limited';
} {
  const validityEvidences: Record<string, ValidityEvidence> = {
    'phq-9': PHQ9_VALIDITY,
    'gad-7': GAD7_VALIDITY,
    'who-5': WHO5_VALIDITY,
    'pss-10': PSS10_VALIDITY,
    'swls': SWLS_VALIDITY,
  };

  const evidence = validityEvidences[assessmentId];
  if (!evidence) {
    return {
      hasConstructValidity: false,
      hasContentValidity: false,
      hasCriterionValidity: false,
      hasCrossCulturalValidity: false,
      reliability: 0,
      evidenceCount: 0,
      overallRating: 'limited',
    };
  }

  const reliability = RELIABILITY_DATA[assessmentId]?.internalConsistency[0]?.alpha || 0;

  const evidenceCount =
    evidence.construct.length +
    evidence.content.length +
    evidence.criterion.length +
    evidence.crossCultural.length;

  let overallRating: 'strong' | 'moderate' | 'limited';

  if (reliability >= 0.85 && evidenceCount >= 8) {
    overallRating = 'strong';
  } else if (reliability >= 0.75 && evidenceCount >= 5) {
    overallRating = 'moderate';
  } else {
    overallRating = 'limited';
  }

  return {
    hasConstructValidity: evidence.construct.length > 0,
    hasContentValidity: evidence.content.length > 0,
    hasCriterionValidity: evidence.criterion.length > 0,
    hasCrossCulturalValidity: evidence.crossCultural.length > 0,
    reliability,
    evidenceCount,
    overallRating,
  };
}

/**
 * Check if assessment is appropriate for population
 */
export function checkPopulationAppropriateness(
  assessmentId: string,
  population: string,
  language: string
): {
  appropriate: boolean;
  concerns: string[];
  adaptations?: string[];
} {
  const validityEvidences: Record<string, ValidityEvidence> = {
    'phq-9': PHQ9_VALIDITY,
    'gad-7': GAD7_VALIDITY,
    'who-5': WHO5_VALIDITY,
    'pss-10': PSS10_VALIDITY,
    'swls': SWLS_VALIDITY,
  };

  const evidence = validityEvidences[assessmentId];
  if (!evidence) {
    return {
      appropriate: false,
      concerns: ['Assessment not found in validity database'],
    };
  }

  const concerns: string[] = [];
  const adaptations: string[] = [];

  // Check language validation
  const languageValidated = evidence.crossCultural.some(
    (cc) => cc.language === language && cc.validated
  );

  if (!languageValidated) {
    concerns.push(`Not validated in ${language}`);
    adaptations.push(`Translation and cultural adaptation recommended`);
  }

  // Check cultural equivalence
  const culturalEvidence = evidence.crossCultural.find(
    (cc) => cc.language === language
  );

  if (culturalEvidence && culturalEvidence.equivalence !== 'full') {
    concerns.push(`Only ${culturalEvidence.equivalence} cultural equivalence`);
    if (culturalEvidence.issues) {
      concerns.push(...culturalEvidence.issues);
    }
  }

  return {
    appropriate: concerns.length === 0,
    concerns,
    adaptations: adaptations.length > 0 ? adaptations : undefined,
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  PHQ9_VALIDITY,
  GAD7_VALIDITY,
  WHO5_VALIDITY,
  PSS10_VALIDITY,
  SWLS_VALIDITY,
  MCID_DATA,
  RESPONDER_THRESHOLDS,
  RELIABILITY_DATA,
};
export type {
  ValidityEvidence,
  ConstructValidityEvidence,
  ContentValidityEvidence,
  CriterionValidityEvidence,
  CrossCulturalValidityEvidence,
  ReliabilityEvidence,
  MCIDEvidence,
  ResponderThresholds,
};
