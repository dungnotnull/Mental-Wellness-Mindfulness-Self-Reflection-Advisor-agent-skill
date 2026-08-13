/**
 * Assessment Tool Registry — Evidence-Based Outcome Measurement
 *
 * System for administering, scoring, and interpreting validated
 * mental health and wellbeing assessments.
 */

// ============================================================================
// ASSESSMENT DEFINITIONS
// ============================================================================

/**
 * Assessment tool interface
 */
export interface AssessmentTool {
  id: string;
  name: string;
  description: string;
  domains: string[];
  items: AssessmentItem[];
  scoring: ScoringConfig;
  interpretation: InterpretationConfig;
  reliability: ReliabilityInfo;
  validity: ValidityInfo;
  citations: string[];
  language: string[];
  estimatedTime: string;
  administration: 'self-report' | 'clinician' | 'interview';
}

/**
 * Assessment item interface
 */
export interface AssessmentItem {
  id: string;
  question: string;
  responseOptions: ResponseOption[];
  reverseScored: boolean;
  domain: string;
}

/**
 * Response option interface
 */
export interface ResponseOption {
  value: number;
  label: string;
  description?: string;
}

/**
 * Scoring configuration
 */
export interface ScoringConfig {
  type: 'sum' | 'average' | 'weighted' | 'subscale';
  range: { min: number; max: number };
  subscales?: Record<string, { items: string[]; range: { min: number; max: number } }>;
  cutoffs?: Record<string, { name: string; threshold: number; interpretation: string }>;
}

/**
 * Interpretation configuration
 */
export interface InterpretationConfig {
  levels: InterpretationLevel[];
  clinical: boolean;
  changeThresholds: {
    reliableChangeIndex?: number;
    minimalClinicallyImportantDifference?: number;
    standardErrorMeasurement?: number;
  };
}

/**
 * Interpretation level interface
 */
export interface InterpretationLevel {
  range: { min: number; max: number };
  label: string;
  description: string;
  recommendations: string[];
}

/**
 * Reliability information
 */
export interface ReliabilityInfo {
  internalConsistency: number;  // Cronbach's alpha
  testRetest: number;            // Test-retest reliability
  interrater?: number;           // Inter-rater reliability (if applicable)
}

/**
 * Validity information
 */
export interface ValidityInfo {
  construct: string[];           // Construct validity evidence
  convergent: string[];          // Convergent validity evidence
  discriminant: string[];         // Discriminant validity evidence
  factorial?: string;            // Factor structure
}

// ============================================================================
// ASSESSMENT TOOLS
// ============================================================================

/**
 * PHQ-9: Patient Health Questionnaire-9
 * Depression screening and severity measurement
 */
export const PHQ9_ASSESSMENT: AssessmentTool = {
  id: 'phq-9',
  name: 'Patient Health Questionnaire-9 (PHQ-9)',
  description: 'Depression screening tool measuring symptom frequency over past 2 weeks',
  domains: ['depression', 'mood', 'functioning'],
  items: [
    {
      id: 'phq1',
      question: 'Little interest or pleasure in doing things',
      responseOptions: [
        { value: 0, label: 'Not at all' },
        { value: 1, label: 'Several days' },
        { value: 2, label: 'More than half the days' },
        { value: 3, label: 'Nearly every day' },
      ],
      reverseScored: false,
      domain: 'anhedonia',
    },
    {
      id: 'phq2',
      question: 'Feeling down, depressed, or hopeless',
      responseOptions: [
        { value: 0, label: 'Not at all' },
        { value: 1, label: 'Several days' },
        { value: 2, label: 'More than half the days' },
        { value: 3, label: 'Nearly every day' },
      ],
      reverseScored: false,
      domain: 'depressed_mood',
    },
    {
      id: 'phq3',
      question: 'Trouble falling or staying asleep, or sleeping too much',
      responseOptions: [
        { value: 0, label: 'Not at all' },
        { value: 1, label: 'Several days' },
        { value: 2, label: 'More than half the days' },
        { value: 3, label: 'Nearly every day' },
      ],
      reverseScored: false,
      domain: 'sleep',
    },
    {
      id: 'phq4',
      question: 'Feeling tired or having little energy',
      responseOptions: [
        { value: 0, label: 'Not at all' },
        { value: 1, label: 'Several days' },
        { value: 2, label: 'More than half the days' },
        { value: 3, label: 'Nearly every day' },
      ],
      reverseScored: false,
      domain: 'fatigue',
    },
    {
      id: 'phq5',
      question: 'Poor appetite or overeating',
      responseOptions: [
        { value: 0, label: 'Not at all' },
        { value: 1, label: 'Several days' },
        { value: 2, label: 'More than half the days' },
        { value: 3, label: 'Nearly every day' },
      ],
      reverseScored: false,
      domain: 'appetite',
    },
    {
      id: 'phq6',
      question: 'Feeling bad about yourself—or that you are a failure or have let yourself or your family down',
      responseOptions: [
        { value: 0, label: 'Not at all' },
        { value: 1, label: 'Several days' },
        { value: 2, label: 'More than half the days' },
        { value: 3, label: 'Nearly every day' },
      ],
      reverseScored: false,
      domain: 'self_worth',
    },
    {
      id: 'phq7',
      question: 'Trouble concentrating on things, such as reading the newspaper or watching television',
      responseOptions: [
        { value: 0, label: 'Not at all' },
        { value: 1, label: 'Several days' },
        { value: 2, label: 'More than half the days' },
        { value: 3, label: 'Nearly every day' },
      ],
      reverseScored: false,
      domain: 'concentration',
    },
    {
      id: 'phq8',
      question: 'Moving or speaking so slowly that other people could have noticed? Or the opposite—being so fidgety or restless that you have been moving around a lot more than usual',
      responseOptions: [
        { value: 0, label: 'Not at all' },
        { value: 1, label: 'Several days' },
        { value: 2, label: 'More than half the days' },
        { value: 3, label: 'Nearly every day' },
      ],
      reverseScored: false,
      domain: 'psychomotor',
    },
    {
      id: 'phq9',
      question: 'Thoughts that you would be better off dead or of hurting yourself in some way',
      responseOptions: [
        { value: 0, label: 'Not at all' },
        { value: 1, label: 'Several days' },
        { value: 2, label: 'More than half the days' },
        { value: 3, label: 'Nearly every day' },
      ],
      reverseScored: false,
      domain: 'suicidality',
    },
  ],
  scoring: {
    type: 'sum',
    range: { min: 0, max: 27 },
    cutoffs: {
      minimal: { name: 'Minimal', threshold: 4, interpretation: 'Minimal depression symptoms' },
      mild: { name: 'Mild', threshold: 9, interpretation: 'Mild depression symptoms' },
      moderate: { name: 'Moderate', threshold: 14, interpretation: 'Moderate depression symptoms' },
      moderately_severe: { name: 'Moderately Severe', threshold: 19, interpretation: 'Moderately severe depression symptoms' },
      severe: { name: 'Severe', threshold: 24, interpretation: 'Severe depression symptoms' },
    },
  },
  interpretation: {
    levels: [
      {
        range: { min: 0, max: 4 },
        label: 'Minimal',
        description: 'Minimal depressive symptoms',
        recommendations: ['Continue monitoring', 'Maintain wellness practices', 'No treatment needed'],
      },
      {
        range: { min: 5, max: 9 },
        label: 'Mild',
        description: 'Mild depressive symptoms',
        recommendations: ['Monitor symptoms', 'Consider self-help strategies', 'Reassess in 2 weeks'],
      },
      {
        range: { min: 10, max: 14 },
        label: 'Moderate',
        description: 'Moderate depressive symptoms',
        recommendations: ['Consider professional consultation', 'Evidence-based interventions may help', 'Monitor for worsening'],
      },
      {
        range: { min: 15, max: 19 },
        label: 'Moderately Severe',
        description: 'Moderately severe depressive symptoms',
        recommendations: ['Professional consultation recommended', 'Evidence-based treatment indicated', 'Safety assessment if item 9 endorsed'],
      },
      {
        range: { min: 20, max: 27 },
        label: 'Severe',
        description: 'Severe depressive symptoms',
        recommendations: ['Professional consultation strongly recommended', 'Comprehensive assessment indicated', 'Immediate evaluation if suicidality present'],
      },
    ],
    clinical: true,
    changeThresholds: {
      reliableChangeIndex: 5,
      minimalClinicallyImportantDifference: 5,
      standardErrorMeasurement: 2.5,
    },
  },
  reliability: {
    internalConsistency: 0.89,  // Kroenke et al. (2001)
    testRetest: 0.86,            // Kroenke et al. (2001)
  },
  validity: {
    construct: ['High correlations with DSM-IV diagnoses', 'Sensitivity to change'],
    convergent: ['Strong correlation with other depression measures (r=0.70+)'],
    discriminant: ['Distinguishes depression from anxiety'],
  },
  citations: [
    'Kroenke K, Spitzer RL, Williams JB. (2001). The PHQ-9: Validity of a brief depression severity measure. J Gen Intern Med, 16(9), 606-613.',
  ],
  language: ['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese'],
  estimatedTime: '3-5 minutes',
  administration: 'self-report',
};

/**
 * GAD-7: Generalized Anxiety Disorder-7
 * Anxiety screening and severity measurement
 */
export const GAD7_ASSESSMENT: AssessmentTool = {
  id: 'gad-7',
  name: 'Generalized Anxiety Disorder-7 (GAD-7)',
  description: 'Anxiety screening tool measuring symptom frequency over past 2 weeks',
  domains: ['anxiety', 'worry', 'tension'],
  items: [
    {
      id: 'gad1',
      question: 'Feeling nervous, anxious, or on edge',
      responseOptions: [
        { value: 0, label: 'Not at all' },
        { value: 1, label: 'Several days' },
        { value: 2, label: 'More than half the days' },
        { value: 3, label: 'Nearly every day' },
      ],
      reverseScored: false,
      domain: 'nervousness',
    },
    {
      id: 'gad2',
      question: 'Not being able to stop or control worrying',
      responseOptions: [
        { value: 0, label: 'Not at all' },
        { value: 1, label: 'Several days' },
        { value: 2, label: 'More than half the days' },
        { value: 3, label: 'Nearly every day' },
      ],
      reverseScored: false,
      domain: 'uncontrollable_worry',
    },
    {
      id: 'gad3',
      question: 'Worrying too much about different things',
      responseOptions: [
        { value: 0, label: 'Not at all' },
        { value: 1, label: 'Several days' },
        { value: 2, label: 'More than half the days' },
        { value: 3, label: 'Nearly every day' },
      ],
      reverseScored: false,
      domain: 'excessive_worry',
    },
    {
      id: 'gad4',
      question: 'Trouble relaxing',
      responseOptions: [
        { value: 0, label: 'Not at all' },
        { value: 1, label: 'Several days' },
        { value: 2, label: 'More than half the days' },
        { value: 3, label: 'Nearly every day' },
      ],
      reverseScored: false,
      domain: 'relaxation_difficulty',
    },
    {
      id: 'gad5',
      question: 'Being so restless that it\'s hard to sit still',
      responseOptions: [
        { value: 0, label: 'Not at all' },
        { value: 1, label: 'Several days' },
        { value: 2, label: 'More than half the days' },
        { value: 3, label: 'Nearly every day' },
      ],
      reverseScored: false,
      domain: 'restlessness',
    },
    {
      id: 'gad6',
      question: 'Becoming easily annoyed or irritable',
      responseOptions: [
        { value: 0, label: 'Not at all' },
        { value: 1, label: 'Several days' },
        { value: 2, label: 'More than half the days' },
        { value: 3, label: 'Nearly every day' },
      ],
      reverseScored: false,
      domain: 'irritability',
    },
    {
      id: 'gad7',
      question: 'Feeling afraid as if something awful might happen',
      responseOptions: [
        { value: 0, label: 'Not at all' },
        { value: 1, label: 'Several days' },
        { value: 2, label: 'More than half the days' },
        { value: 3, label: 'Nearly every day' },
      ],
      reverseScored: false,
      domain: 'apprehension',
    },
  ],
  scoring: {
    type: 'sum',
    range: { min: 0, max: 21 },
    cutoffs: {
      minimal: { name: 'Minimal', threshold: 4, interpretation: 'Minimal anxiety symptoms' },
      mild: { name: 'Mild', threshold: 9, interpretation: 'Mild anxiety symptoms' },
      moderate: { name: 'Moderate', threshold: 14, interpretation: 'Moderate anxiety symptoms' },
      severe: { name: 'Severe', threshold: 15, interpretation: 'Severe anxiety symptoms' },
    },
  },
  interpretation: {
    levels: [
      {
        range: { min: 0, max: 4 },
        label: 'Minimal',
        description: 'Minimal anxiety symptoms',
        recommendations: ['Continue monitoring', 'Maintain wellness practices'],
      },
      {
        range: { min: 5, max: 9 },
        label: 'Mild',
        description: 'Mild anxiety symptoms',
        recommendations: ['Monitor symptoms', 'Consider self-help strategies', 'Reassess in 2 weeks'],
      },
      {
        range: { min: 10, max: 14 },
        label: 'Moderate',
        description: 'Moderate anxiety symptoms',
        recommendations: ['Professional consultation recommended', 'Evidence-based interventions may help', 'Monitor for worsening'],
      },
      {
        range: { min: 15, max: 21 },
        label: 'Severe',
        description: 'Severe anxiety symptoms',
        recommendations: ['Professional consultation strongly recommended', 'Comprehensive assessment indicated'],
      },
    ],
    clinical: true,
    changeThresholds: {
      reliableChangeIndex: 4,
      minimalClinicallyImportantDifference: 4,
      standardErrorMeasurement: 2.0,
    },
  },
  reliability: {
    internalConsistency: 0.92,  // Spitzer et al. (2006)
    testRetest: 0.83,            // Spitzer et al. (2006)
  },
  validity: {
    construct: ['Strong correlations with DSM-IV diagnoses', 'Sensitivity to change'],
    convergent: ['Strong correlation with other anxiety measures (r=0.70+)'],
    discriminant: ['Distinguishes anxiety from depression'],
  },
  citations: [
    'Spitzer RL, Kroenke K, Williams JB, Lowe B. (2006). A brief measure for assessing generalized anxiety disorder: the GAD-7. Arch Intern Med, 166(10), 1092-1097.',
  ],
  language: ['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese'],
  estimatedTime: '3-5 minutes',
  administration: 'self-report',
};

/**
 * WHO-5: World Health Organization-Five Well-Being Index
 * General wellbeing measurement
 */
export const WHO5_ASSESSMENT: AssessmentTool = {
  id: 'who-5',
  name: 'WHO-5 Well-Being Index',
  description: 'General wellbeing measure assessing positive mood, vitality, and general interests',
  domains: ['wellbeing', 'mood', 'vitality', 'interests'],
  items: [
    {
      id: 'who1',
      question: 'I have felt cheerful and in good spirits',
      responseOptions: [
        { value: 0, label: 'At no time' },
        { value: 1, label: 'Some of the time' },
        { value: 2, label: 'Less than half the time' },
        { value: 3, label: 'More than half the time' },
        { value: 4, label: 'Most of the time' },
        { value: 5, label: 'All of the time' },
      ],
      reverseScored: false,
      domain: 'positive_mood',
    },
    {
      id: 'who2',
      question: 'I have felt calm and relaxed',
      responseOptions: [
        { value: 0, label: 'At no time' },
        { value: 1, label: 'Some of the time' },
        { value: 2, label: 'Less than half the time' },
        { value: 3, label: 'More than half the time' },
        { value: 4, label: 'Most of the time' },
        { value: 5, label: 'All of the time' },
      ],
      reverseScored: false,
      domain: 'calmness',
    },
    {
      id: 'who3',
      question: 'I have felt active and vigorous',
      responseOptions: [
        { value: 0, label: 'At no time' },
        { value: 1, label: 'Some of the time' },
        { value: 2, label: 'Less than half the time' },
        { value: 3, label: 'More than half the time' },
        { value: 4, label: 'Most of the time' },
        { value: 5, label: 'All of the time' },
      ],
      reverseScored: false,
      domain: 'vitality',
    },
    {
      id: 'who4',
      question: 'I woke up feeling fresh and rested',
      responseOptions: [
        { value: 0, label: 'At no time' },
        { value: 1, label: 'Some of the time' },
        { value: 2, label: 'Less than half the time' },
        { value: 3, label: 'More than half the time' },
        { value: 4, label: 'Most of the time' },
        { value: 5, label: 'All of the time' },
      ],
      reverseScored: false,
      domain: 'rest',
    },
    {
      id: 'who5',
      question: 'My daily life has been filled with things that interest me',
      responseOptions: [
        { value: 0, label: 'At no time' },
        { value: 1, label: 'Some of the time' },
        { value: 2, label: 'Less than half the time' },
        { value: 3, label: 'More than half the time' },
        { value: 4, label: 'Most of the time' },
        { value: 5, label: 'All of the time' },
      ],
      reverseScored: false,
      domain: 'interest',
    },
  ],
  scoring: {
    type: 'sum',
    range: { min: 0, max: 25 },
    cutoffs: {
      low_wellbeing: { name: 'Low Wellbeing', threshold: 13, interpretation: 'Possible depression' },
      moderate_wellbeing: { name: 'Moderate Wellbeing', threshold: 18, interpretation: 'Adequate wellbeing' },
      high_wellbeing: { name: 'High Wellbeing', threshold: 25, interpretation: 'Good wellbeing' },
    },
  },
  interpretation: {
    levels: [
      {
        range: { min: 0, max: 13 },
        label: 'Low Wellbeing',
        description: 'Poor wellbeing, possible depression',
        recommendations: ['Professional consultation recommended', 'Further assessment needed', 'Consider depression screening'],
      },
      {
        range: { min: 14, max: 18 },
        label: 'Moderate Wellbeing',
        description: 'Adequate wellbeing',
        recommendations: ['Continue monitoring', 'Maintain wellness practices', 'Consider enhancement strategies'],
      },
      {
        range: { min: 19, max: 25 },
        label: 'High Wellbeing',
        description: 'Good wellbeing',
        recommendations: ['Maintain current practices', 'Continue positive habits'],
      },
    ],
    clinical: false,
    changeThresholds: {
      reliableChangeIndex: 10,
      minimalClinicallyImportantDifference: 10,
      standardErrorMeasurement: 3.0,
    },
  },
  reliability: {
    internalConsistency: 0.86,  // Bech et al. (1996)
    testRetest: 0.79,            // Bech et al. (1996)
  },
  validity: {
    construct: ['Valid measure of general wellbeing'],
    convergent: ['Moderate correlation with other wellbeing measures'],
    discriminant: ['Distinguishes wellbeing from psychopathology'],
  },
  citations: [
    'Bech P. (1996). The WHO-5 Well-Being Index: A comprehensive assessment of subjective positive wellbeing. Qual Life Res, 5(5), 439-449.',
  ],
  language: ['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Arabic'],
  estimatedTime: '2-3 minutes',
  administration: 'self-report',
};

/**
 * PSS-10: Perceived Stress Scale
 * Stress measurement
 */
export const PSS10_ASSESSMENT: AssessmentTool = {
  id: 'pss-10',
  name: 'Perceived Stress Scale-10 (PSS-10)',
  description: 'Measures degree to which situations in life are appraised as stressful',
  domains: ['stress', 'perception', 'coping'],
  items: [
    {
      id: 'pss1',
      question: 'In the last month, how often have you been upset because of something that happened unexpectedly?',
      responseOptions: [
        { value: 0, label: 'Never' },
        { value: 1, label: 'Almost never' },
        { value: 2, label: 'Sometimes' },
        { value: 3, label: 'Fairly often' },
        { value: 4, label: 'Very often' },
      ],
      reverseScored: false,
      domain: 'unexpected_upset',
    },
    {
      id: 'pss2',
      question: 'In the last month, how often have you felt that you were unable to control the important things in your life?',
      responseOptions: [
        { value: 0, label: 'Never' },
        { value: 1, label: 'Almost never' },
        { value: 2, label: 'Sometimes' },
        { value: 3, label: 'Fairly often' },
        { value: 4, label: 'Very often' },
      ],
      reverseScored: false,
      domain: 'control',
    },
    {
      id: 'pss3',
      question: 'In the last month, how often have you felt nervous and stressed?',
      responseOptions: [
        { value: 0, label: 'Never' },
        { value: 1, label: 'Almost never' },
        { value: 2, label: 'Sometimes' },
        { value: 3, label: 'Fairly often' },
        { value: 4, label: 'Very often' },
      ],
      reverseScored: false,
      domain: 'nervous_stress',
    },
    {
      id: 'pss4',
      question: 'In the last month, how often have you felt confident about your ability to handle your personal problems?',
      responseOptions: [
        { value: 0, label: 'Never' },
        { value: 1, label: 'Almost never' },
        { value: 2, label: 'Sometimes' },
        { value: 3, label: 'Fairly often' },
        { value: 4, label: 'Very often' },
      ],
      reverseScored: true,
      domain: 'confidence',
    },
    {
      id: 'pss5',
      question: 'In the last month, how often have you felt that things were going your way?',
      responseOptions: [
        { value: 0, label: 'Never' },
        { value: 1, label: 'Almost never' },
        { value: 2, label: 'Sometimes' },
        { value: 3, label: 'Fairly often' },
        { value: 4, label: 'Very often' },
      ],
      reverseScored: true,
      domain: 'things_going_well',
    },
    {
      id: 'pss6',
      question: 'In the last month, how often have you found that you could not cope with all the things that you had to do?',
      responseOptions: [
        { value: 0, label: 'Never' },
        { value: 1, label: 'Almost never' },
        { value: 2, label: 'Sometimes' },
        { value: 3, label: 'Fairly often' },
        { value: 4, label: 'Very often' },
      ],
      reverseScored: false,
      domain: 'coping',
    },
    {
      id: 'pss7',
      question: 'In the last month, how often have you been able to control irritations in your life?',
      responseOptions: [
        { value: 0, label: 'Never' },
        { value: 1, label: 'Almost never' },
        { value: 2, label: 'Sometimes' },
        { value: 3, label: 'Fairly often' },
        { value: 4, label: 'Very often' },
      ],
      reverseScored: true,
      domain: 'irritation_control',
    },
    {
      id: 'pss8',
      question: 'In the last month, how often have you felt that you were on top of things?',
      responseOptions: [
        { value: 0, label: 'Never' },
        { value: 1, label: 'Almost never' },
        { value: 2, label: 'Sometimes' },
        { value: 3, label: 'Fairly often' },
        { value: 4, label: 'Very often' },
      ],
      reverseScored: true,
      domain: 'on_top',
    },
    {
      id: 'pss9',
      question: 'In the last month, how often have you been angered because of things that were outside of your control?',
      responseOptions: [
        { value: 0, label: 'Never' },
        { value: 1, label: 'Almost never' },
        { value: 2, label: 'Sometimes' },
        { value: 3, label: 'Fairly often' },
        { value: 4, label: 'Very often' },
      ],
      reverseScored: false,
      domain: 'angered',
    },
    {
      id: 'pss10',
      question: 'In the last month, how often have you felt difficulties were piling up so high that you could not overcome them?',
      responseOptions: [
        { value: 0, label: 'Never' },
        { value: 1, label: 'Almost never' },
        { value: 2, label: 'Sometimes' },
        { value: 3, label: 'Fairly often' },
        { value: 4, label: 'Very often' },
      ],
      reverseScored: false,
      domain: 'overwhelmed',
    },
  ],
  scoring: {
    type: 'sum',
    range: { min: 0, max: 40 },
  },
  interpretation: {
    levels: [
      {
        range: { min: 0, max: 13 },
        label: 'Low Stress',
        description: 'Low perceived stress',
        recommendations: ['Maintain current stress management', 'Continue wellness practices'],
      },
      {
        range: { min: 14, max: 26 },
        label: 'Moderate Stress',
        description: 'Moderate perceived stress',
        recommendations: ['Consider stress management strategies', 'Monitor for worsening', 'Reassess in 2-4 weeks'],
      },
      {
        range: { min: 27, max: 40 },
        label: 'High Stress',
        description: 'High perceived stress',
        recommendations: ['Professional consultation recommended', 'Evidence-based stress management', 'Monitor for burnout'],
      },
    ],
    clinical: false,
    changeThresholds: {
      reliableChangeIndex: 6,
      minimalClinicallyImportantDifference: 5,
      standardErrorMeasurement: 2.5,
    },
  },
  reliability: {
    internalConsistency: 0.78,  // Cohen et al. (1983)
    testRetest: 0.55,            // Cohen & Williamson (1988)
  },
  validity: {
    construct: ['Valid measure of perceived stress'],
    convergent: ['Moderate correlation with life events measures'],
    discriminant: ['Distinguishes stress from depression and anxiety'],
  },
  citations: [
    'Cohen S, Kamarck T, Mermelstein R. (1983). A global measure of perceived stress. J Health Soc Behav, 24(4), 385-396.',
  ],
  language: ['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese'],
  estimatedTime: '3-5 minutes',
  administration: 'self-report',
};

/**
 * SWLS: Satisfaction With Life Scale
 * Life satisfaction measurement
 */
export const SWLS_ASSESSMENT: AssessmentTool = {
  id: 'swls',
  name: 'Satisfaction With Life Scale (SWLS)',
  description: 'Measures global cognitive judgments of satisfaction with life',
  domains: ['life_satisfaction', 'judgments', 'evaluation'],
  items: [
    {
      id: 'swls1',
      question: 'In most ways my life is close to my ideal',
      responseOptions: [
        { value: 1, label: 'Strongly disagree' },
        { value: 2, label: 'Disagree' },
        { value: 3, label: 'Slightly disagree' },
        { value: 4, label: 'Neither agree nor disagree' },
        { value: 5, label: 'Slightly agree' },
        { value: 6, label: 'Agree' },
        { value: 7, label: 'Strongly agree' },
      ],
      reverseScored: false,
      domain: 'ideal',
    },
    {
      id: 'swls2',
      question: 'The conditions of my life are excellent',
      responseOptions: [
        { value: 1, label: 'Strongly disagree' },
        { value: 2, label: 'Disagree' },
        { value: 3, label: 'Slightly disagree' },
        { value: 4, label: 'Neither agree nor disagree' },
        { value: 5, label: 'Slightly agree' },
        { value: 6, label: 'Agree' },
        { value: 7, label: 'Strongly agree' },
      ],
      reverseScored: false,
      domain: 'conditions',
    },
    {
      id: 'swls3',
      question: 'I am satisfied with my life',
      responseOptions: [
        { value: 1, label: 'Strongly disagree' },
        { value: 2, label: 'Disagree' },
        { value: 3, label: 'Slightly disagree' },
        { value: 4, label: 'Neither agree nor disagree' },
        { value: 5, label: 'Slightly agree' },
        { value: 6, label: 'Agree' },
        { value: 7, label: 'Strongly agree' },
      ],
      reverseScored: false,
      domain: 'satisfied',
    },
    {
      id: 'swls4',
      question: 'So far I have gotten the important things I want in life',
      responseOptions: [
        { value: 1, label: 'Strongly disagree' },
        { value: 2, label: 'Disagree' },
        { value: 3, label: 'Slightly disagree' },
        { value: 4, label: 'Neither agree nor disagree' },
        { value: 5, label: 'Slightly agree' },
        { value: 6, label: 'Agree' },
        { value: 7, label: 'Strongly agree' },
      ],
      reverseScored: false,
      domain: 'important_things',
    },
    {
      id: 'swls5',
      question: 'If I could live my life over, I would change almost nothing',
      responseOptions: [
        { value: 1, label: 'Strongly disagree' },
        { value: 2, label: 'Disagree' },
        { value: 3, label: 'Slightly disagree' },
        { value: 4, label: 'Neither agree nor disagree' },
        { value: 5, label: 'Slightly agree' },
        { value: 6, label: 'Agree' },
        { value: 7, label: 'Strongly agree' },
      ],
      reverseScored: false,
      domain: 'no_change',
    },
  ],
  scoring: {
    type: 'sum',
    range: { min: 5, max: 35 },
  },
  interpretation: {
    levels: [
      {
        range: { min: 5, max: 19 },
        label: 'Dissatisfied',
        description: 'Low life satisfaction',
        recommendations: ['Explore sources of dissatisfaction', 'Consider values clarification', 'Professional consultation if persistent'],
      },
      {
        range: { min: 20, max: 25 },
        label: 'Slightly Below Average',
        description: 'Slightly below average life satisfaction',
        recommendations: ['Identify areas for improvement', 'Set achievable goals', 'Build on existing strengths'],
      },
      {
        range: { min: 26, max: 30 },
        label: 'Average',
        description: 'Average life satisfaction',
        recommendations: ['Maintain current practices', 'Consider enhancement strategies', 'Balance life domains'],
      },
      {
        range: { min: 31, max: 35 },
        label: 'Satisfied',
        description: 'High life satisfaction',
        recommendations: ['Maintain current practices', 'Share wisdom with others', 'Continue positive habits'],
      },
    ],
    clinical: false,
    changeThresholds: {
      reliableChangeIndex: 4,
      minimalClinicallyImportantDifference: 3,
      standardErrorMeasurement: 1.5,
    },
  },
  reliability: {
    internalConsistency: 0.87,  // Diener et al. (1985)
    testRetest: 0.82,            // Pavot & Diener (1993)
  },
  validity: {
    construct: ['Valid measure of life satisfaction'],
    convergent: ['Moderate correlation with other wellbeing measures'],
    discriminant: ['Distinguishes satisfaction from affect'],
  },
  citations: [
    'Diener E, Emmons RA, Larsen RJ, Griffin S. (1985). The Satisfaction With Life Scale. J Pers Assess, 49(1), 71-75.',
  ],
  language: ['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Arabic'],
  estimatedTime: '2-3 minutes',
  administration: 'self-report',
};

// ============================================================================
// ASSESSMENT REGISTRY
// ============================================================================

/**
 * Complete assessment registry
 */
export const ASSESSMENT_REGISTRY: Record<string, AssessmentTool> = {
  'phq-9': PHQ9_ASSESSMENT,
  'gad-7': GAD7_ASSESSMENT,
  'who-5': WHO5_ASSESSMENT,
  'pss-10': PSS10_ASSESSMENT,
  'swls': SWLS_ASSESSMENT,
};

// ============================================================================
// SCORING FUNCTIONS
// ============================================================================

/**
 * Score an assessment from responses
 */
export function scoreAssessment(
  assessmentId: string,
  responses: Record<string, number>
): { totalScore: number; subscaleScores?: Record<string, number>; interpretation: string } {
  const assessment = ASSESSMENT_REGISTRY[assessmentId];
  if (!assessment) {
    throw new Error(`Assessment not found: ${assessmentId}`);
  }

  let totalScore = 0;
  const subscaleScores: Record<string, number> = {};

  // Calculate total score
  for (const item of assessment.items) {
    const response = responses[item.id];
    if (response === undefined) continue;

    // Apply reverse scoring if needed
    const score = item.reverseScored
      ? (assessment.scoring.range.max - response)
      : response;

    totalScore += score;

    // Track subscale scores if applicable
    if (assessment.scoring.subscales) {
      for (const [subscaleName, subscale] of Object.entries(assessment.scoring.subscales)) {
        if (subscale.items.includes(item.id)) {
          subscaleScores[subscaleName] = (subscaleScores[subscaleName] || 0) + score;
        }
      }
    }
  }

  // Find interpretation
  const interpretation = assessment.interpretation.levels.find(
    (level) => totalScore >= level.range.min && totalScore <= level.range.max
  );

  return {
    totalScore,
    subscaleScores: Object.keys(subscaleScores).length > 0 ? subscaleScores : undefined,
    interpretation: interpretation ? interpretation.description : 'Unable to interpret',
  };
}

/**
 * Get clinical cutoff interpretation
 */
export function getClinicalCutoff(assessmentId: string, score: number): string | null {
  const assessment = ASSESSMENT_REGISTRY[assessmentId];
  if (!assessment || !assessment.scoring.cutoffs) return null;

  for (const [cutoffName, cutoff] of Object.entries(assessment.scoring.cutoffs)) {
    if (score <= cutoff.threshold) {
      return cutoff.interpretation;
    }
  }

  return Object.values(assessment.scoring.cutoffs)[0].interpretation;
}

/**
 * Check if change exceeds reliable change index
 */
export function hasReliableChange(
  assessmentId: string,
  preScore: number,
  postScore: number
): boolean {
  const assessment = ASSESSMENT_REGISTRY[assessmentId];
  if (!assessment || !assessment.interpretation.changeThresholds) return false;

  const rci = assessment.interpretation.changeThresholds.reliableChangeIndex;
  if (!rci) return false;

  const change = Math.abs(postScore - preScore);
  return change >= rci;
}

/**
 * Check if change meets minimal clinically important difference
 */
export function hasClinicallySignificantChange(
  assessmentId: string,
  preScore: number,
  postScore: number
): boolean {
  const assessment = ASSESSMENT_REGISTRY[assessmentId];
  if (!assessment || !assessment.interpretation.changeThresholds) return false;

  const mcid = assessment.interpretation.changeThresholds.minimalClinicallyImportantDifference;
  if (!mcid) return false;

  const change = Math.abs(postScore - preScore);
  return change >= mcid;
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  PHQ9_ASSESSMENT,
  GAD7_ASSESSMENT,
  WHO5_ASSESSMENT,
  PSS10_ASSESSMENT,
  SWLS_ASSESSMENT,
};
export type {
  AssessmentTool,
  AssessmentItem,
  ResponseOption,
  ScoringConfig,
  InterpretationConfig,
  InterpretationLevel,
  ReliabilityInfo,
  ValidityInfo,
};
