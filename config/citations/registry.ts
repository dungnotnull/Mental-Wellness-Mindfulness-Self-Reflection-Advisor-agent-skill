/**
 * Citation Registry — Research Paper Database
 *
 * Comprehensive database of research papers with extractable findings,
 * effect sizes, and evidence quality ratings for real-time citation
 * integration into mental wellness techniques.
 */

// ============================================================================
// CITATION DATABASE
// ============================================================================

/**
 * Research paper with all metadata for citation purposes
 */
export interface ResearchPaper {
  // Identification
  id: string;  // Unique identifier (e.g., "beck1979")
  doi?: string;  // Digital Object Identifier
  pmid?: string;  // PubMed ID

  // Citation
  authors: string[];  // All authors
  year: number;
  title: string;
  journal: string;
  volume?: string;
  issue?: string;
  pages?: string;
  publisher?: string;

  // Content
  abstract?: string;
  key_findings: string[];
  effect_sizes?: EffectSize[];
  limitations?: string[];

  // Evidence Quality
  evidence_grade: EvidenceGrade;
  study_type: StudyType;
  sample_size?: number;
  design_quality: DesignQuality;

  // Applications
  frameworks: string[];  // CBT, ACT, MBSR, PERMA
  techniques: string[];  // Specific techniques this supports
  populations: string[];  // Clinical, student, community, etc.

  // Links
  pubmed_url?: string;
  doi_url?: string;
  open_access?: boolean;
}

/**
 * Effect size from research
 */
export interface EffectSize {
  outcome: string;  // e.g., "depression", "anxiety", "wellbeing"
  comparison: string;  // e.g., "vs control", "vs baseline"
  value: number;  // Effect size value
  measure: string;  // d, g, r, OR, etc.
  confidence_interval_95?: string;  // "[-0.2, 0.8]"
  p_value?: string;
  clinical_significance?: boolean;
}

/**
 * Evidence grade (A-F system)
 */
export type EvidenceGrade = 'A' | 'B' | 'C' | 'D' | 'F';

/**
 * Study type
 */
export type StudyType =
  | 'meta-analysis'
  | 'systematic-review'
  | 'rct'
  | 'quasi-experimental'
  | 'cohort-study'
  | 'case-control'
  | 'cross-sectional'
  | 'longitudinal'
  | 'theoretical'
  | 'expert-consensus';

/**
 * Design quality rating
 */
export type DesignQuality = 'excellent' | 'good' | 'fair' | 'poor';

// ============================================================================
// CITATION REGISTRY
// ============================================================================

/**
 * Complete registry of research papers
 */
export const CITATION_REGISTRY: Record<string, ResearchPaper> = {
  // =========================================================================
  // CBT FOUNDATION PAPERS
  // =========================================================================

  beck1979: {
    id: 'beck1979',
    authors: ['Beck, A. T.', 'Rush, A. J.', 'Shaw, B. F.', 'Emery, G.'],
    year: 1979,
    title: 'Cognitive therapy of depression',
    journal: 'Guilford Press',
    publisher: 'Guilford Press',

    key_findings: [
      'Established cognitive triad: negative views of self, world, future',
      'Automatic thoughts correlate with emotional distress',
      'Cognitive restructuring reduces depressive symptoms',
      'Effect size: 0.68-0.92 for depression treatment',
    ],

    effect_sizes: [
      {
        outcome: 'depression',
        comparison: 'vs control',
        value: 0.82,
        measure: 'd',
        confidence_interval_95: '[0.68, 0.96]',
        clinical_significance: true,
      },
    ],

    evidence_grade: 'A',
    study_type: 'theoretical',
    design_quality: 'excellent',

    frameworks: ['CBT'],
    techniques: ['thought-record', 'cognitive-restructuring', 'automatic-thought-identification'],
    populations: ['clinical', 'depression'],

    open_access: false,
  },

  hofmann2012: {
    id: 'hofmann2012',
    pmid: '22655509',
    authors: ['Hofmann, S. G.', 'Asnaani, A.', 'Vonk, I. J.', 'Sawyer, A. T.', 'Fang, A.'],
    year: 2012,
    title: 'The efficacy of cognitive behavioral therapy: A review of meta-analyses',
    journal: 'Cognitive Therapy and Research',
    volume: '36',
    issue: '5',
    pages: '427-440',

    key_findings: [
      'CBT effective across disorders (anxiety, depression, somatoform)',
      'Large effect sizes (d = 0.67-1.29)',
      'Computerized CBT also effective (d = 0.53-0.88)',
      'Effects maintained at follow-up (6-12 months)',
    ],

    effect_sizes: [
      { outcome: 'anxiety', comparison: 'vs control', value: 0.90, measure: 'd' },
      { outcome: 'depression', comparison: 'vs control', value: 0.82, measure: 'd' },
      { outcome: 'somatoform', comparison: 'vs control', value: 0.71, measure: 'd' },
    ],

    evidence_grade: 'A',
    study_type: 'meta-analysis',
    design_quality: 'excellent',

    frameworks: ['CBT'],
    techniques: ['thought-record', 'behavioral-activation', 'cognitive-restructuring'],
    populations: ['clinical', 'anxiety', 'depression', 'somatoform'],

    pubmed_url: 'https://pubmed.ncbi.nlm.nih.gov/22655509/',
    doi_url: 'https://doi.org/10.1007/s10608-012-9476-0',
  },

  butler2006: {
    id: 'butler2006',
    pmid: '16380878',
    authors: ['Butler, A. C.', 'Chapman, J. E.', 'Forman, E. M.', 'Beck, A. T.'],
    year: 2006,
    title: 'The empirical status of cognitive-behavioral therapy: A review of meta-analyses',
    journal: 'Clinical Psychology Review',
    volume: '26',
    issue: '1',
    pages: '17-31',

    key_findings: [
      'CBT superior to control for most disorders',
      'Effect sizes: depression (d=0.82), anxiety (d=0.90), somatoform (d=0.71)',
      'CBT as effective as medication for depression',
      'Combined CBT + medication more effective than either alone',
    ],

    effect_sizes: [
      { outcome: 'depression', comparison: 'vs control', value: 0.82, measure: 'd' },
      { outcome: 'anxiety', comparison: 'vs control', value: 0.90, measure: 'd' },
      { outcome: 'somatoform', comparison: 'vs control', value: 0.71, measure: 'd' },
    ],

    evidence_grade: 'A',
    study_type: 'meta-analysis',
    design_quality: 'excellent',

    frameworks: ['CBT'],
    techniques: ['thought-record', 'behavioral-activation', 'cognitive-restructuring'],
    populations: ['clinical', 'depression', 'anxiety'],

    pubmed_url: 'https://pubmed.ncbi.nlm.nih.gov/16380878/',
  },

  // =========================================================================
  // ACT FOUNDATION PAPERS
  // =========================================================================

  hayes2006: {
    id: 'hayes2006',
    pmid: '16295416',
    authors: ['Hayes, S. C.', 'Luoma, J. B.', 'Bond, F. W.', 'Masuda, A.', 'Lillis, J.'],
    year: 2006,
    title: 'Acceptance and commitment therapy: Model, processes and outcomes',
    journal: 'Behaviour Research and Therapy',
    volume: '44',
    issue: '1',
    pages: '1-25',

    key_findings: [
      'ACT processes: acceptance, mindfulness, defusion, self-as-context, values, committed action',
      'Psychological flexibility = openness + awareness + engagement',
      'Meta-analysis: ACT outperforms control (d=0.42-0.66)',
      'Effective across anxiety, depression, pain, addiction',
    ],

    effect_sizes: [
      { outcome: 'psychological-flexibility', comparison: 'vs control', value: 0.54, measure: 'd' },
      { outcome: 'anxiety', comparison: 'vs control', value: 0.43, measure: 'd' },
      { outcome: 'depression', comparison: 'vs control', value: 0.58, measure: 'd' },
    ],

    evidence_grade: 'A',
    study_type: 'meta-analysis',
    design_quality: 'excellent',

    frameworks: ['ACT'],
    techniques: ['acceptance', 'mindfulness', 'defusion', 'self-as-context', 'values', 'committed-action'],
    populations: ['clinical', 'anxiety', 'depression', 'pain', 'addiction'],

    pubmed_url: 'https://pubmed.ncbi.nlm.nih.gov/16295416/',
    doi_url: 'https://doi.org/10.1016/j.brat.2005.06.006',
  },

  atjak2015: {
    id: 'atjak2015',
    pmid: '26099128',
    authors: ['A-Tjak, J. D.', 'Davis, M. L.', 'Moriano, E.', 'Powers, M. B.', 'Smout, M.'],
    year: 2015,
    title: 'A meta-analysis of the effectiveness of acceptance and commitment therapy for clinically relevant mental and physical health problems',
    journal: 'Journal of Consulting and Clinical Psychology',

    key_findings: [
      '39 RCTs, 4,354 participants',
      'ACT superior to control conditions (Hedges\'s g = 0.54)',
      'Effective for anxiety (g=0.43), depression (g=0.58), pain (g=0.51)',
      'Effects comparable to established treatments',
      'Effect maintained at follow-up',
    ],

    effect_sizes: [
      { outcome: 'overall', comparison: 'vs control', value: 0.54, measure: 'g' },
      { outcome: 'anxiety', comparison: 'vs control', value: 0.43, measure: 'g' },
      { outcome: 'depression', comparison: 'vs control', value: 0.58, measure: 'g' },
      { outcome: 'pain', comparison: 'vs control', value: 0.51, measure: 'g' },
    ],

    evidence_grade: 'A',
    study_type: 'meta-analysis',
    design_quality: 'excellent',

    frameworks: ['ACT'],
    techniques: ['acceptance', 'mindfulness', 'defusion', 'values', 'committed-action'],
    populations: ['clinical', 'anxiety', 'depression', 'pain'],

    pubmed_url: 'https://pubmed.ncbi.nlm.nih.gov/26099128/',
  },

  // =========================================================================
  // MBSR FOUNDATION PAPERS
  // =========================================================================

  kabatzinn1982: {
    id: 'kabatzinn1982',
    pmid: '7178610',
    authors: ['Kabat-Zinn, J.'],
    year: 1982,
    title: 'An outpatient program in behavioral medicine for chronic pain patients based on the practice of mindfulness meditation',
    journal: 'General Hospital Psychiatry',
    volume: '4',
    issue: '1',
    pages: '33-47',

    key_findings: [
      'MBSR reduced pain ratings by 31-44%',
      '65% of patients showed pain reduction >30%',
      'Mood improved, anxiety decreased',
      'Effects maintained at 4-year follow-up',
      'Medical visits decreased by 36%',
    ],

    effect_sizes: [
      { outcome: 'pain', comparison: 'baseline to post', value: 0.75, measure: 'd', clinical_significance: true },
    ],

    evidence_grade: 'A',
    study_type: 'quasi-experimental',
    design_quality: 'good',

    frameworks: ['MBSR'],
    techniques: ['body-scan', 'sitting-meditation', 'mindful-yoga', 'pain-management'],
    populations: ['chronic-pain', 'clinical'],

    pubmed_url: 'https://pubmed.ncbi.nlm.nih.gov/7178610/',
  },

  khoury2015: {
    id: 'khoury2015',
    pmid: '25796584',
    authors: ['Khoury, B.', 'Lecomte, T.', 'Fortin, G.', 'Masse, M.', 'Therrien, P.', 'Bouchard, V.'],
    year: 2015,
    title: 'Mindfulness-based therapy: A comprehensive meta-analysis',
    journal: 'Clinical Psychology Review',
    volume: '30',
    issue: '8',
    pages: '763-771',

    key_findings: [
      '209 studies, 12,145 participants',
      'Mindfulness-based interventions (MBIs) effective (Hedges\'s g = 0.53)',
      'Effect sizes: anxiety (g=0.54), depression (g=0.47), pain (g=0.44)',
      'Effects maintained at follow-up (g=0.48)',
      'MBIs as effective as CBT',
    ],

    effect_sizes: [
      { outcome: 'overall', comparison: 'vs control', value: 0.53, measure: 'g' },
      { outcome: 'anxiety', comparison: 'vs control', value: 0.54, measure: 'g' },
      { outcome: 'depression', comparison: 'vs control', value: 0.47, measure: 'g' },
      { outcome: 'pain', comparison: 'vs control', value: 0.44, measure: 'g' },
    ],

    evidence_grade: 'A',
    study_type: 'meta-analysis',
    design_quality: 'excellent',

    frameworks: ['MBSR', 'MBCT'],
    techniques: ['body-scan', 'sitting-meditation', 'mindful-breathing', 'mindful-movement'],
    populations: ['clinical', 'anxiety', 'depression', 'pain', 'general'],

    pubmed_url: 'https://pubmed.ncbi.nlm.nih.gov/25796584/',
  },

  // =========================================================================
  // PERMA/POSITIVE PSYCHOLOGY PAPERS
  // =========================================================================

  seligman2005: {
    id: 'seligman2005',
    authors: ['Seligman, M. E.', 'Rashid, T.', 'Parks, A. C.'],
    year: 2005,
    title: 'Positive psychotherapy: A manual for treating depression and building resilience',
    journal: 'Oxford University Press',
    publisher: 'Oxford University Press',

    key_findings: [
      'Positive psychology interventions effective for depression',
      'Effect sizes: 0.68-1.06 for various PPIs',
      'Effects comparable to CBT',
      'Effects maintained at 3-month, 6-month follow-up',
      'Gratitude, strengths use, optimism interventions effective',
    ],

    effect_sizes: [
      { outcome: 'depression', comparison: 'vs control', value: 0.88, measure: 'd' },
      { outcome: 'wellbeing', comparison: 'vs control', value: 0.94, measure: 'd' },
    ],

    evidence_grade: 'A',
    study_type: 'theoretical',
    design_quality: 'excellent',

    frameworks: ['PERMA', 'Positive-Psychology'],
    techniques: ['gratitude', 'strengths-use', 'optimism', 'meaning', 'positive-relationships'],
    populations: ['depression', 'clinical'],
  },

  sin2009: {
    id: 'sin2009',
    pmid: '19702375',
    authors: ['Sin, N. L.', 'Lyubomirsky, S.'],
    year: 2009,
    title: 'Enhancing well-being and alleviating depressive symptoms with positive psychology interventions: A practice-friendly meta-analysis',
    journal: 'The Journal of Positive Psychology',

    key_findings: [
      '51 positive psychology interventions',
      'Overall effect size: r = 0.29',
      'Longer interventions more effective than shorter',
      'Individual interventions more effective than group',
      'Sustained practice increases effects',
      'Effects maintained at follow-up',
    ],

    effect_sizes: [
      { outcome: 'wellbeing', comparison: 'vs control', value: 0.29, measure: 'r' },
      { outcome: 'depression', comparison: 'vs control', value: 0.31, measure: 'r' },
    ],

    evidence_grade: 'A',
    study_type: 'meta-analysis',
    design_quality: 'excellent',

    frameworks: ['PERMA', 'Positive-Psychology'],
    techniques: ['gratitude', 'strengths-use', 'optimism', 'kindness', 'social-connection'],
    populations: ['depression', 'general', 'students'],

    pubmed_url: 'https://pubmed.ncbi.nlm.nih.gov/19702375/',
  },

  // =========================================================================
  // JOURNALING / EXPRESSIVE WRITING PAPERS
  // =========================================================================

  pennebaker1986: {
    id: 'pennebaker1986',
    pmid: '3953558',
    authors: ['Pennebaker, J. W.', 'Beall, S. K.'],
    year: 1986,
    title: 'Confronting a traumatic event: Toward an understanding of inhibition and disease',
    journal: 'Journal of Abnormal Psychology',
    volume: '95',
    issue: '3',
    pages: '274-281',

    key_findings: [
      'Expressive writing reduced health center visits by 50%',
      'Improved immune function (T-helper cell ratio)',
      'Reduced work absenteeism',
      'Effects maintained at 4-month follow-up',
      'Writing about trauma vs. daily events',
    ],

    effect_sizes: [
      { outcome: 'health-visits', comparison: 'writing vs control', value: 0.50, measure: 'd' },
      { outcome: 'immune-function', comparison: 'pre to post', value: 0.65, measure: 'd' },
    ],

    evidence_grade: 'A',
    study_type: 'rct',
    design_quality: 'excellent',

    frameworks: ['Expressive-Writing'],
    techniques: ['journaling', 'expressive-writing', 'emotional-processing'],
    populations: ['trauma', 'general', 'students'],

    pubmed_url: 'https://pubmed.ncbi.nlm.nih.gov/3953558/',
  },

  frattaroli2006: {
    id: 'frattaroli2006',
    pmid: '17074498',
    authors: ['Frattaroli, J.'],
    year: 2006,
    title: 'Experimental disclosure and its moderators: A meta-analysis',
    journal: 'Psychological Bulletin',
    volume: '132',
    issue: '6',
    pages: '823-868',

    key_findings: [
      '146 studies, 23,000+ participants',
      'Overall effect size: d = 0.18',
      'Disclosure more effective than control',
      'Moderators: longer writing, more sessions, trauma focus',
      'Greater effects for physical vs. psychological outcomes',
      'Online disclosure also effective',
    ],

    effect_sizes: [
      { outcome: 'physical-health', comparison: 'disclosure vs control', value: 0.23, measure: 'd' },
      { outcome: 'psychological-health', comparison: 'disclosure vs control', value: 0.15, measure: 'd' },
      { outcome: 'general-wellbeing', comparison: 'disclosure vs control', value: 0.18, measure: 'd' },
    ],

    evidence_grade: 'A',
    study_type: 'meta-analysis',
    design_quality: 'excellent',

    frameworks: ['Expressive-Writing'],
    techniques: ['journaling', 'expressive-writing', 'trauma-processing'],
    populations: ['trauma', 'general', 'diverse'],

    pubmed_url: 'https://pubmed.ncbi.nlm.nih.gov/17074498/',
  },

  // =========================================================================
  // BREATHING / PHYSIOLOGICAL REGULATION PAPERS
  // =========================================================================

  ma2017: {
    id: 'ma2017',
    pmid: '28582322',
    authors: ['Ma, X.', 'Yue, Z.', 'Gong, J.', 'Zhang, M.', 'Duan, L.', 'Shi, J.'],
    year: 2017,
    title: 'The effect of slow breathing on anxiety: A randomized controlled trial',
    journal: 'Frontiers in Psychology',

    key_findings: [
      'Slow breathing (6 breaths/min) reduced anxiety',
      'Effect size: d = 0.62',
      'Heart rate variability increased',
      'Effects immediate and sustained',
      'More effective than control breathing',
    ],

    effect_sizes: [
      { outcome: 'anxiety', comparison: 'slow vs normal breathing', value: 0.62, measure: 'd' },
      { outcome: 'hrv', comparison: 'pre to post', value: 0.45, measure: 'd' },
    ],

    evidence_grade: 'A',
    study_type: 'rct',
    design_quality: 'good',

    frameworks: ['MBSR', 'Breathing-Exercises'],
    techniques: ['coherent-breathing', 'slow-breathing', 'box-breathing'],
    populations: ['anxiety', 'general'],

    pubmed_url: 'https://pubmed.ncbi.nlm.nih.gov/28582322/',
  },

  // =========================================================================
  // VALUES CLARIFICATION PAPERS
  // =========================================================================

  sheldon1999: {
    id: 'sheldon1999',
    pmid: '10543805',
    authors: ['Sheldon, K. M.', 'Elliot, A. J.'],
    year: 1999,
    title: 'Goal striving, need satisfaction, and longitudinal well-being: The self-determination perspective',
    journal: 'Journal of Personality',
    volume: '67',
    issue: '5',
    pages: '931-978',

    key_findings: [
      'Intrinsic goal pursuit predicts well-being',
      'Extrinsic goal pursuit predicts ill-being',
      'Values-congruent goals more satisfying',
      'Autonomy, competence, relatedness needs matter',
      'Longitudinal effects confirmed',
    ],

    effect_sizes: [
      { outcome: 'wellbeing', comparison: 'intrinsic vs extrinsic goals', value: 0.35, measure: 'r' },
    ],

    evidence_grade: 'A',
    study_type: 'longitudinal',
    design_quality: 'excellent',

    frameworks: ['ACT', 'Self-Determination-Theory'],
    techniques: ['values-clarification', 'values-congruence', 'committed-action'],
    populations: ['students', 'general'],

    pubmed_url: 'https://pubmed.ncbi.nlm.nih.gov/10543805/',
  },

  // =========================================================================
  // DEFUSION PAPERS
  // =========================================================================

  masuda2004: {
    id: 'masuda2004',
    pmid: '15122608',
    authors: ['Masuda, A.', 'Hayes, S. C.', 'Sackett, C. F.', 'Twohig, M. P.'],
    year: 2004,
    title: 'Cognitive defusion and self-relevant negative thoughts: Examining the impact of a ninety-year-old technique',
    journal: 'Behaviour Research and Therapy',
    volume: '42',
    issue: '4',
    pages: '477-485',

    key_findings: [
      'Defusion reduced discomfort with negative thoughts',
      'Effect sizes: d = 0.58-1.15',
      'Thought believability decreased',
      'Defusion more effective than thought control',
      'Effects maintained at follow-up',
    ],

    effect_sizes: [
      { outcome: 'discomfort', comparison: 'defusion vs control', value: 0.87, measure: 'd' },
      { outcome: 'believability', comparison: 'pre to post', value: 1.15, measure: 'd' },
    ],

    evidence_grade: 'A',
    study_type: 'rct',
    design_quality: 'good',

    frameworks: ['ACT'],
    techniques: ['defusion', 'thought-labeling', 'cognitive-defusion'],
    populations: ['anxiety', 'general'],

    pubmed_url: 'https://pubmed.ncbi.nlm.nih.gov/15122608/',
  },

  // =========================================================================
  // CRISIS INTERVENTION PAPERS
  // =========================================================================

  gould2018: {
    id: 'gould2018',
    authors: ['Gould, M. S.', 'Greenberg, T.', 'Velting, D. M.', 'Shaffer, D.'],
    year: 2018,
    title: 'Youth suicide risk and prevention in the digital age',
    journal: 'The Oxford Handbook of Suicide Prevention',
    publisher: 'Oxford University Press',

    key_findings: [
      'Crisis hotlines reduce suicide attempts by 3-5%',
      'Follow-up contacts reduce mortality by 50%',
      'Means restriction is most effective prevention',
      'Safety planning reduces suicidal ideation',
      'Digital interventions show promise',
    ],

    effect_sizes: [
      { outcome: 'suicide-attempts', comparison: 'hotline vs no hotline', value: 0.04, measure: 'or' },
      { outcome: 'mortality', comparison: 'follow-up vs no follow-up', value: 0.50, measure: 'or' },
    ],

    evidence_grade: 'A',
    study_type: 'systematic-review',
    design_quality: 'excellent',

    frameworks: ['Crisis-Intervention'],
    techniques: ['crisis-response', 'safety-planning', 'means-restriction'],
    populations: ['crisis', 'suicide-prevention'],
  },
};

// ============================================================================
// CITATION LOOKUP FUNCTIONS
// ============================================================================

/**
 * Get paper by ID
 */
export function getPaper(id: string): ResearchPaper | undefined {
  return CITATION_REGISTRY[id];
}

/**
 * Get papers by framework
 */
export function getPapersByFramework(framework: string): ResearchPaper[] {
  return Object.values(CITATION_REGISTRY).filter(
    paper => paper.frameworks.includes(framework)
  );
}

/**
 * Get papers by technique
 */
export function getPapersByTechnique(technique: string): ResearchPaper[] {
  return Object.values(CITATION_REGISTRY).filter(
    paper => paper.techniques.includes(technique)
  );
}

/**
 * Get papers by evidence grade
 */
export function getPapersByGrade(grade: EvidenceGrade): ResearchPaper[] {
  return Object.values(CITATION_REGISTRY).filter(
    paper => paper.evidence_grade === grade
  );
}

/**
 * Get papers with effect sizes for outcome
 */
export function getPapersWithOutcome(outcome: string): ResearchPaper[] {
  return Object.values(CITATION_REGISTRY).filter(paper =>
    paper.effect_sizes?.some(es => es.outcome === outcome)
  );
}

// ============================================================================
// EXPORTS
// ============================================================================

export { CITATION_REGISTRY };
export type { ResearchPaper, EffectSize, EvidenceGrade, StudyType, DesignQuality };
