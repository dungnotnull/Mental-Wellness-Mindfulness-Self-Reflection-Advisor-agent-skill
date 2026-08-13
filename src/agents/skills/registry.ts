/**
 * Skill Registry — Declarative Skill Registration
 *
 * Central registry of all available skills with their metadata,
 * triggering conditions, and capabilities.
 */

// ============================================================================
// SKILL DEFINITIONS
// ============================================================================

export interface SkillDefinition {
  id: string;
  name: string;
  description: string;
  triggerPhrases: string[];
  frameworks: string[];
  tools: string[];
  researchSupport: {
    citationIds: string[];
    effectSize: string;
    evidenceGrade: string;
  };
  capabilities: string[];
}

/**
 * Complete skill registry
 */
export const SKILL_REGISTRY: Record<string, SkillDefinition> = {
  'journaling-advisor': {
    id: 'journaling-advisor',
    name: 'Journaling Advisor',
    description: 'Guided reflective journaling using CBT/ACT frameworks',
    triggerPhrases: [
      'journal',
      'write',
      'reflect',
      'thought record',
      'cbt',
      'cognitive',
      'automatic thoughts',
      'situation exploration',
    ],
    frameworks: ['CBT', 'ACT'],
    tools: ['journaling_prompt', 'crisis_detection'],
    researchSupport: {
      citationIds: ['hofmann-2012', 'beck-1979', 'sin-lyubomirsky-2009'],
      effectSize: 'd=0.82 for depression, d=0.90 for anxiety',
      evidenceGrade: 'A (Strong Evidence)',
    },
    capabilities: [
      'Thought record guidance',
      'Situation exploration',
      'Cognitive restructuring',
      'Weekly reflection',
      'Daily check-in',
    ],
  },

  'mindfulness-guide': {
    id: 'mindfulness-guide',
    name: 'Mindfulness Guide',
    description: 'Guided mindfulness and stress-reduction exercises (MBSR)',
    triggerPhrases: [
      'mindful',
      'meditation',
      'breath',
      'breathe',
      'body scan',
      'grounding',
      'stress',
      'relax',
      'mbsr',
    ],
    frameworks: ['MBSR'],
    tools: ['mindfulness_exercise', 'crisis_detection'],
    researchSupport: {
      citationIds: ['kabat-zinn-1982', 'khoury-2015', 'tang-2015'],
      effectSize: 'g=0.53 for distress, d=0.65 for stress',
      evidenceGrade: 'A (Strong Evidence)',
    },
    capabilities: [
      'Diaphragmatic breathing',
      'Body scan meditation',
      'Sitting meditation',
      'STOP practice',
      '5-4-3-2-1 grounding',
      'Mindful walking',
    ],
  },

  'values-coach': {
    id: 'values-coach',
    name: 'Values Coach',
    description: 'Values clarification and committed action (ACT)',
    triggerPhrases: [
      'value',
      'values',
      'meaning',
      'purpose',
      'what matters',
      'clarify',
      'act',
      'committed action',
      'life direction',
    ],
    frameworks: ['ACT'],
    tools: ['values_explore', 'crisis_detection'],
    researchSupport: {
      citationIds: ['hayes-2006', 'a-tjak-2015', 'sheldon-1999'],
      effectSize: 'g=0.54 for psychological flexibility',
      evidenceGrade: 'A (Strong Evidence)',
    },
    capabilities: [
      'Values Bull\'s Eye',
      'Eulogy exercise',
      'Values card sort',
      'Values timeline',
      'Committed action planning',
      'Barrier exploration',
    ],
  },

  'wellbeing-educator': {
    id: 'wellbeing-educator',
    name: 'Wellbeing Educator',
    description: 'PERMA model education and positive psychology interventions',
    triggerPhrases: [
      'wellbeing',
      'well-being',
      'flourish',
      'thrive',
      'gratitude',
      'strengths',
      'perma',
      'positive psychology',
      'accomplishment',
      'meaning',
      'relationships',
    ],
    frameworks: ['PERMA'],
    tools: ['wellbeing_assess', 'crisis_detection'],
    researchSupport: {
      citationIds: ['seligman-2005', 'sin-lyubomirsky-2009', 'peterson-2004'],
      effectSize: 'd=0.68-1.06 for gratitude, r=0.29 overall',
      evidenceGrade: 'A (Strong Evidence)',
    },
    capabilities: [
      'Gratitude journaling',
      'Strengths use',
      'Meaning reflection',
      'Relationship building',
      'Goal setting',
      'Positive emotion practices',
    ],
  },

  'defusion-helper': {
    id: 'defusion-helper',
    name: 'Defusion Helper',
    description: 'Cognitive defusion techniques (ACT)',
    triggerPhrases: [
      'defusion',
      'thought',
      'fusion',
      'unsticky',
      'observe thoughts',
      'cognitive',
      'ruminate',
      'overthinking',
      'stuck in thoughts',
    ],
    frameworks: ['ACT'],
    tools: ['defusion_technique', 'crisis_detection'],
    researchSupport: {
      citationIds: ['masuda-2004', 'healy-2008', 'hayes-2006'],
      effectSize: 'd=0.58-1.15 for discomfort reduction',
      evidenceGrade: 'A (Strong Evidence)',
    },
    capabilities: [
      'Thought labeling',
      'Silly voice defusion',
      'Leaves on stream',
      'Observer exercise',
      'Thank your mind',
      'Expansion exercises',
    ],
  },

  'safety-router': {
    id: 'safety-router',
    name: 'Safety Router',
    description: 'Crisis detection and emergency response',
    triggerPhrases: [
      'suicide',
      'kill myself',
      'end it all',
      'crisis',
      'emergency',
      'hurt myself',
      'danger',
    ],
    frameworks: ['Safety'],
    tools: ['crisis_detection'],
    researchSupport: {
      citationIds: [],  // Safety system based on clinical protocols
      effectSize: 'N/A (safety protocols)',
      evidenceGrade: 'A (Clinical Standards)',
    },
    capabilities: [
      'Crisis detection',
      'Severity assessment',
      'Resource provision',
      'Professional referral',
      'Safety planning',
    ],
  },
};

// ============================================================================
// SKILL LOOKUP FUNCTIONS
// ============================================================================

/**
 * Find skill by trigger phrase
 */
export function findSkillByTrigger(phrase: string): SkillDefinition | null {
  const normalizedPhrase = phrase.toLowerCase();

  for (const [skillId, skill] of Object.entries(SKILL_REGISTRY)) {
    for (const triggerPhrase of skill.triggerPhrases) {
      if (normalizedPhrase.includes(triggerPhrase.toLowerCase())) {
        return skill;
      }
    }
  }

  return null;
}

/**
 * Get skills by framework
 */
export function getSkillsByFramework(framework: string): SkillDefinition[] {
  return Object.values(SKILL_REGISTRY).filter((skill) =>
    skill.frameworks.includes(framework)
  );
}

/**
 * Get skill by ID
 */
export function getSkillById(skillId: string): SkillDefinition | null {
  return SKILL_REGISTRY[skillId] || null;
}

/**
 * Get all skill IDs
 */
export function getAllSkillIds(): string[] {
  return Object.keys(SKILL_REGISTRY);
}

/**
 * Search skills by capability
 */
export function searchSkillsByCapability(capability: string): SkillDefinition[] {
  return Object.values(SKILL_REGISTRY).filter((skill) =>
    skill.capabilities.some((cap) => cap.toLowerCase().includes(capability.toLowerCase()))
  );
}

// ============================================================================
// EXPORTS
// ============================================================================

export type { SkillDefinition };
