/**
 * Evidence Grading System — Research Quality Assessment
 *
 * System for grading research evidence quality and communicating
 * confidence levels to users transparently.
 */

// ============================================================================
// EVIDENCE GRADE SYSTEM
// ============================================================================

/**
 * Evidence grade with explanation
 */
export interface EvidenceGradeInfo {
  grade: EvidenceGrade;
  label: string;
  description: string;
  color: string;  // For UI display
  requirements: string[];
  confidence_level: string;
  suitable_for: string[];
}

/**
 * Evidence grade definitions (A-F system based on research quality)
 */
export const EVIDENCE_GRADES: Record<EvidenceGrade, EvidenceGradeInfo> = {
  A: {
    grade: 'A',
    label: 'Strong Evidence',
    description: 'Supported by multiple high-quality studies or meta-analyses',
    color: '#2ecc71',  // Green
    requirements: [
      'Multiple RCTs or meta-analyses',
      'Large sample sizes (n > 100)',
      'Consistent findings across studies',
      'Low risk of bias',
      'Published in peer-reviewed journals',
      'Effects maintained at follow-up',
    ],
    confidence_level: 'High (95%+ confidence)',
    suitable_for: ['Clinical practice', 'Self-help interventions', 'Policy decisions'],
  },
  B: {
    grade: 'B',
    label: 'Moderate Evidence',
    description: 'Supported by good quality studies with some limitations',
    color: '#3498db',  // Blue
    requirements: [
      'At least one RCT or multiple quasi-experimental studies',
      'Moderate sample sizes (n > 50)',
      'Generally consistent findings',
      'Some risk of bias',
      'Published in peer-reviewed journals',
    ],
    confidence_level: 'Moderate (75-94% confidence)',
    suitable_for: ['Self-help interventions', 'Exploratory use', 'Consideration in practice'],
  },
  C: {
    grade: 'C',
    label: 'Limited Evidence',
    description: 'Supported by preliminary studies or expert consensus',
    color: '#f39c12',  // Orange
    requirements: [
      'Small sample sizes (n < 50)',
      'Single studies or case series',
      'Inconsistent findings',
      'Higher risk of bias',
      'Published or unpublished',
    ],
    confidence_level: 'Low (50-74% confidence)',
    suitable_for: ['Exploratory use', 'Consideration with caution', 'Experimental approaches'],
  },
  D: {
    grade: 'D',
    label: 'Preliminary Evidence',
    description: 'Supported by theoretical work or early-stage research',
    color: '#e74c3c',  // Red
    requirements: [
      'Theoretical papers',
      'Expert opinion',
      'Case studies',
      'No experimental validation',
      'May be contradicted by later research',
    ],
    confidence_level: 'Very Low (<50% confidence)',
    suitable_for: ['Consideration with caution', 'Experimental use only'],
  },
  F: {
    grade: 'F',
    label: 'Insufficient Evidence',
    description: 'No supporting research found',
    color: '#95a5a6',  // Gray
    requirements: ['No research', 'Contradicted by research', 'Theoretical only'],
    confidence_level: 'None (cannot assess)',
    suitable_for: ['Not recommended', 'Experimental with extreme caution'],
  },
};

// ============================================================================
// CONFIDENCE INTERVAL COMMUNICATION
// ============================================================================

/**
 * Confidence interval interpretation
 */
export interface ConfidenceInterval {
  lower: number;
  upper: number;
  level: number;  // Usually 95
  interpretation: string;
  clinical_significance: boolean;
}

/**
 * Format confidence interval for display
 */
export function formatConfidenceInterval(ci: string): string {
  return `95% CI ${ci}`;
}

/**
 * Interpret confidence interval
 */
export function interpretConfidenceInterval(lower: number, upper: number, includes_zero: boolean): string {
  if (includes_zero) {
    return 'Result not statistically significant (includes zero)';
  } else if (lower > 0) {
    return 'Statistically significant positive effect';
  } else {
    return 'Statistically significant negative effect';
  }
}

// ============================================================================
// EFFECT SIZE INTERPRETATION
// ============================================================================

/**
 * Effect size interpretation standards
 */
export const EFFECT_SIZE_INTERPRETATION = {
  d_small: { min: 0.2, max: 0.49, label: 'Small' },
  d_medium: { min: 0.5, max: 0.79, label: 'Medium' },
  d_large: { min: 0.8, max: Infinity, label: 'Large' },

  r_small: { min: 0.1, max: 0.29, label: 'Small' },
  r_medium: { min: 0.3, max: 0.49, label: 'Medium' },
  r_large: { min: 0.5, max: 1.0, label: 'Large' },

  or_small: { min: 1.0, max: 1.49, label: 'Small' },
  or_medium: { min: 1.5, max: 2.49, label: 'Medium' },
  or_large: { min: 2.5, max: Infinity, label: 'Large' },
};

/**
 * Interpret effect size value based on measure type
 */
export function interpretEffectSize(value: number, measure: string): string {
  if (measure === 'd' || measure === 'g') {
    if (value < 0.5) return 'Small effect';
    if (value < 0.8) return 'Medium effect';
    return 'Large effect';
  }
  if (measure === 'r') {
    if (value < 0.3) return 'Small effect';
    if (value < 0.5) return 'Medium effect';
    return 'Large effect';
  }
  if (measure === 'or' || measure === 'OR' || measure === 'hr') {
    if (value < 1.5) return 'Small effect';
    if (value < 2.5) return 'Medium effect';
    return 'Large effect';
  }
  return 'Unknown measure';
}

/**
 * Check if effect size is clinically significant
 */
export function isClinicallySignificant(value: number, measure: string): boolean {
  // Clinical significance thresholds (Cohen's d or similar)
  if (measure === 'd' || measure === 'g') {
    return value >= 0.5;  // Medium or larger
  }
  if (measure === 'r') {
    return value >= 0.3;  // Medium or larger
  }
  if (measure === 'or' || measure === 'OR') {
    return value >= 2.0;  // Medium or larger
  }
  return false;
}

// ============================================================================
// RESEARCH QUALITY ASSESSMENT
// ============================================================================

/**
 * Study type hierarchy (strongest to weakest)
 */
export const STUDY_TYPE_HIERARCHY: string[] = [
  'meta-analysis',
  'systematic-review',
  'rct',
  'quasi-experimental',
  'cohort-study',
  'case-control',
  'cross-sectional',
  'longitudinal',
  'theoretical',
  'expert-consensus',
];

/**
 * Design quality ratings
 */
export const DESIGN_QUALITY_RATINGS = {
  excellent: { score: 4, description: 'Rigorous methodology, large sample, low bias' },
  good: { score: 3, description: 'Sound methodology, adequate sample, some bias' },
  fair: { score: 2, description: 'Acceptable methodology, small sample, moderate bias' },
  poor: { score: 1, description: 'Weak methodology, very small sample, high bias' },
};

/**
 * Calculate overall evidence quality score
 */
export function calculateQualityScore(paper: any): number {
  let score = 0;

  // Study type contribution
  const typeIndex = STUDY_TYPE_HIERARCHY.indexOf(paper.study_type);
  if (typeIndex >= 0) {
    score += (STUDY_TYPE_HIERARCHY.length - typeIndex) * 2;
  }

  // Design quality contribution
  if (paper.design_quality && DESIGN_QUALITY_RATINGS[paper.design_quality]) {
    score += DESIGN_QUALITY_RATINGS[paper.design_quality].score;
  }

  // Sample size bonus
  if (paper.sample_size) {
    if (paper.sample_size >= 500) score += 3;
    else if (paper.sample_size >= 200) score += 2;
    else if (paper.sample_size >= 100) score += 1;
  }

  // Evidence grade
  if (paper.evidence_grade === 'A') score += 3;
  else if (paper.evidence_grade === 'B') score += 2;
  else if (paper.evidence_grade === 'C') score += 1;

  return score;
}

// ============================================================================
// CITATION DISPLAY FORMATTING
// ============================================================================

/**
 * Citation styles
 */
export const CITATION_STYLES = {
  apa: (paper: any) => {
    const authors = paper.authors.join(', ');
    const year = paper.year;
    const title = paper.title;
    const journal = paper.journal;
    const volume = paper.volume || '';
    const issue = paper.issue ? `(${paper.issue})` : '';
    const pages = paper.pages || '';

    if (volume && pages) {
      return `${authors} (${year}). ${title}. *${journal}, ${volume}${issue}, ${pages}.`;
    }
    return `${authors} (${year}). ${title}. *${journal}.*`;
  },

  mla: (paper: any) => {
    const authors = paper.authors.join(', ');
    const title = `"${paper.title}."`;
    const journal = paper.journal;
    const volume = paper.volume || '';
    const issue = paper.issue ? `.${paper.issue}` : '';
    const pages = paper.pages || '';
    const year = paper.year;

    if (volume && pages) {
      return `${authors}. ${title} *${journal}.${volume}${issue} (${year}): ${pages}.`;
    }
    return `${authors}. ${title} *${journal}.* (${year}).`;
  },

  simple: (paper: any) => {
    const authors = paper.authors[0].split(' ')[0] + ' et al.';
    const year = paper.year;
    return `${authors} (${year})`;
  },
};

/**
 * Format citation for display
 */
export function formatCitation(paperId: string, style: 'apa' | 'mla' | 'simple' = 'apa'): string {
  const paper = CITATION_REGISTRY[paperId];
  if (!paper) return '[Unknown Paper]';

  return CITATION_STYLES[style](paper);
}

// ============================================================================
// UNCERTAINTY COMMUNICATION
// ============================================================================

/**
 * Uncertainty level descriptions
 */
export const UNCERTAINTY_LEVELS = {
  very_certain: { level: '95-100%', label: 'Very Certain', description: 'Extensive research support' },
  certain: { level: '75-94%', label: 'Certain', description: 'Strong research support' },
  moderately_certain: { level: '50-74%', label: 'Moderately Certain', description: 'Moderate research support' },
  uncertain: { level: '25-49%', label: 'Uncertain', description: 'Limited research support' },
  very_uncertain: { level: '0-24%', label: 'Very Uncertain', description: 'Very limited research support' },
};

/**
 * Get uncertainty level for evidence grade
 */
export function getUncertaintyLevel(grade: EvidenceGrade): typeof UNCERTAINTY_LEVELS[keyof typeof UNCERTAINTY_LEVELS] {
  switch (grade) {
    case 'A':
      return UNCERTAINTY_LEVELS.very_certain;
    case 'B':
      return UNCERTAINTY_LEVELS.certain;
    case 'C':
      return UNCERTAINTY_LEVELS.moderately_certain;
    case 'D':
      return UNCERTAINTY_LEVELS.uncertain;
    case 'F':
      return UNCERTAINTY_LEVELS.very_uncertain;
  }
}

/**
 * Generate uncertainty statement for technique
 */
export function generateUncertaintyStatement(technique: string, papers: string[]): string {
  const grades = papers.map(id => CITATION_REGISTRY[id]?.evidence_grade).filter(Boolean);
  const avgGrade = getAverageGrade(grades);

  if (avgGrade === 'A') {
    return `Strong evidence supports ${technique} (multiple high-quality studies, 95%+ confidence).`;
  } else if (avgGrade === 'B') {
    return `Moderate evidence supports ${technique} (good quality studies, 75-94% confidence).`;
  } else if (avgGrade === 'C') {
    return `Limited evidence supports ${technique} (preliminary studies, 50-74% confidence).`;
  } else {
    return `Very limited evidence supports ${technique} (theoretical or early-stage research, <50% confidence).`;
  }
}

/**
 * Get average grade from list of grades
 */
function getAverageGrade(grades: EvidenceGrade[]): EvidenceGrade {
  if (grades.length === 0) return 'F';

  const gradeValues = { A: 5, B: 4, C: 3, D: 2, F: 1 };
  const sum = grades.reduce((acc, grade) => acc + gradeValues[grade], 0);
  const avg = sum / grades.length;

  if (avg >= 4.5) return 'A';
  if (avg >= 3.5) return 'B';
  if (avg >= 2.5) return 'C';
  if (avg >= 1.5) return 'D';
  return 'F';
}

// ============================================================================
// EVIDENCE COMMUNICATION PROTOCOLS
// ============================================================================

/**
 * Language strength levels for communicating evidence
 */
export const EVIDENCE_LANGUAGE = {
  strong: [
    'Strong evidence suggests...',
    'Robust research shows...',
    'Multiple high-quality studies demonstrate...',
    'Meta-analyses confirm...',
    'We are very confident that...',
  ],
  moderate: [
    'Research indicates...',
    'Studies suggest...',
    'Evidence supports...',
    'We are reasonably confident that...',
    'Available research shows...',
  ],
  tentative: [
    'Preliminary evidence suggests...',
    'Early research indicates...',
    'Some studies show...',
    'Limited evidence supports...',
    'We are tentatively suggesting...',
  ],
  uncertain: [
    'Theoretical frameworks suggest...',
    'Expert opinion indicates...',
    'Limited research is available...',
    'We are uncertain whether...',
    'Current evidence is insufficient...',
  ],
};

/**
 * Get appropriate language strength for evidence grade
 */
export function getEvidenceLanguage(grade: EvidenceGrade): string[] {
  switch (grade) {
    case 'A':
      return EVIDENCE_LANGUAGE.strong;
    case 'B':
      return EVIDENCE_LANGUAGE.moderate;
    case 'C':
      return EVIDENCE_LANGUAGE.tentative;
    default:
      return EVIDENCE_LANGUAGE.uncertain;
  }
}

/**
 * Select random phrase from language set
 */
export function selectEvidencePhrase(grade: EvidenceGrade, context: string): string {
  const phrases = getEvidenceLanguage(grade);
  return phrases[Math.floor(Math.random() * phrases.length)];
}

// ============================================================================
// RESEARCH LIMITATION COMMUNICATION
// ============================================================================

/**
 * Common research limitations to communicate
 */
export const COMMON_LIMITATIONS = [
  'Most research conducted in Western, educated, industrialized, rich, and democratic (WEIRD) populations',
  'Limited research on diverse cultural groups',
  'Most studies exclude severe comorbidities',
  'Self-report measures may be biased',
  'Long-term effects less studied',
  'Publication bias may overestimate effects',
  'Industry funding may influence outcomes',
  'Sample sizes may be underpowered',
  'Control conditions vary across studies',
];

/**
 * Get limitations for a paper or technique
 */
export function getLimitations(paperId?: string, technique?: string): string[] {
  if (paperId) {
    const paper = CITATION_REGISTRY[paperId];
    return paper?.limitations || COMMON_LIMITATIONS;
  }
  return COMMON_LIMITATIONS;
}

/**
 * Format limitation statement
 */
export function formatLimitationStatement(limitations: string[]): string {
  if (limitations.length === 0) return '';
  return `Limitations: ${limitations.join('; ')}.`;
}

// ============================================================================
// IMPORTS
// ============================================================================

import { CITATION_REGISTRY } from '../citations/registry';
import type { ResearchPaper, EvidenceGrade, StudyType, DesignQuality } from '../citations/registry';

// ============================================================================
// EXPORTS
// ============================================================================

export {
  EVIDENCE_GRADES,
  EFFECT_SIZE_INTERPRETATION,
  STUDY_TYPE_HIERARCHY,
  DESIGN_QUALITY_RATINGS,
  UNCERTAINTY_LEVELS,
  EVIDENCE_LANGUAGE,
  COMMON_LIMITATIONS,
};
export type {
  EvidenceGradeInfo,
  ConfidenceInterval,
};
