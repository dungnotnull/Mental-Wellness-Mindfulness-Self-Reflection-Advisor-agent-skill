/**
 * Cultural Adaptation Pathways — Adapt Techniques for Different Cultural Contexts
 *
 * System for adapting wellness techniques based on cultural dimensions
 * and providing culturally appropriate alternatives.
 */

import { CulturalDimensions, CULTURAL_ADAPTATIONS } from './detection';

// ============================================================================
// ADAPTATION PATHWAYS
// ============================================================================

/**
 * Technique adaptation options for different cultural contexts
 */
export interface TechniqueAdaptation {
  technique: string;
  culturalDimension: keyof CulturalDimensions;
  adaptationType: 'language' | 'examples' | 'metaphors' | 'values' | 'structure';
  original: string;
  adapted: string;
  culturalContext: string;
}

/**
 * Adaptation library for common techniques
 */
export const TECHNIQUE_ADAPTATIONS: TechniqueAdaptation[] = [
  // Values Work Adaptations
  {
    technique: 'Values Bull\'s Eye',
    culturalDimension: 'individualism_collectivism',
    adaptationType: 'values',
    original: 'What matters to YOU in this area? What are YOUR personal values?',
    adapted: 'What matters to YOUR FAMILY/COMMUNITY in this area? What values do YOU share with YOUR GROUP?',
    culturalContext: 'Collectivist cultures prioritize family and community values over individual preferences.',
  },
  {
    technique: 'Values Bull\'s Eye',
    culturalDimension: 'individualism_collectivism',
    adaptationType: 'examples',
    original: 'Personal achievement, independence, self-expression',
    adapted: 'Family harmony, community contribution, fulfilling duties',
    culturalContext: 'Collectivist cultures emphasize interdependence and social responsibility.',
  },
  {
    technique: 'Eulogy Exercise',
    culturalDimension: 'individualism_collectivism',
    adaptationType: 'examples',
    original: 'What would YOU want said about YOUR life?',
    adapted: 'What would YOUR FAMILY/COMMUNITY want said about YOUR CONTRIBUTION to the GROUP?',
    culturalContext: 'Collectivist cultures view legacy through family and community impact.',
  },

  // Mindfulness Adaptations
  {
    technique: 'Body Scan',
    culturalDimension: 'context_style',
    adaptationType: 'language',
    original: 'Notice sensations in your body. Feel each part directly.',
    adapted: 'Notice the energy flow in your body. Sense the connection between body parts.',
    culturalContext: 'High-context cultures may relate better to energy/metaphorical language than direct sensation.',
  },
  {
    technique: 'Sitting Meditation',
    culturalDimension: 'religious_orientation',
    adaptationType: 'language',
    original: 'Focus on your breath. Observe thoughts without judgment.',
    adapted: 'Connect with your breath as a divine gift. Observe thoughts with compassionate awareness.',
    culturalContext: 'Religious cultures may integrate spiritual language into meditation practice.',
  },

  // Journaling Adaptations
  {
    technique: 'Thought Record',
    culturalDimension: 'power_distance',
    adaptationType: 'language',
    original: 'Challenge the thought. Is there evidence against it?',
    adapted: 'Consider the thought respectfully. What might wise voices say about this?',
    culturalContext: 'High power distance cultures may prefer respectful questioning over direct challenging.',
  },
  {
    technique: 'Thought Record',
    culturalDimension: 'context_style',
    adaptationType: 'structure',
    original: 'Situation → Automatic Thought → Emotion → Alternative Thought',
    adapted: 'Describe the context → Notice the feeling → Reflect on the meaning → Consider wiser perspectives',
    culturalContext: 'High-context cultures may prefer thematic flow over rigid structure.',
  },

  // Gratitude Adaptations
  {
    technique: 'Gratitude Journaling',
    culturalDimension: 'individualism_collectivism',
    adaptationType: 'examples',
    original: 'I\'m grateful for my personal achievements',
    adapted: 'I\'m grateful for family support, community help, shared blessings',
    culturalContext: 'Collectivist cultures emphasize gratitude for relationships and community.',
  },
  {
    technique: 'Gratitude Letter',
    culturalDimension: 'power_distance',
    adaptationType: 'language',
    original: 'Write to anyone who helped you',
    adapted: 'Write to elders, parents, teachers, or community leaders who guided you',
    culturalContext: 'High power distance cultures emphasize gratitude for authority and guidance.',
  },

  // Strengths Adaptations
  {
    technique: 'Signature Strengths',
    culturalDimension: 'individualism_collectivism',
    adaptationType: 'values',
    original: 'Use YOUR strengths for YOUR benefit',
    adapted: 'Use YOUR strengths to benefit YOUR FAMILY/COMMUNITY',
    culturalContext: 'Collectivist cultures view strengths as tools for group benefit.',
  },
];

// ============================================================================
// CULTURAL FRAMEWORK ADAPTATIONS
// ============================================================================

/**
 * Framework-specific cultural adaptations
 */
export const FRAMEWORK_ADAPTATIONS = {
  CBT: {
    collectivist: {
      challenge: 'Individualistic focus may feel self-centered',
      adaptation: 'Frame cognitive work within family/social context',
      examples: 'How thoughts affect family relationships, how thinking impacts community',
      language: 'We-thinking alongside I-thinking',
    },
    highPowerDistance: {
      challenge: 'Direct thought challenging may feel disrespectful',
      adaptation: 'Use respectful questioning, invite consideration',
      examples: 'What might wise elders say? What does tradition teach?',
      language: 'Respectful exploration versus direct challenge',
    },
    highUncertaintyAvoidance: {
      challenge: 'Open-ended exploration may create anxiety',
      adaptation: 'Provide structured, evidence-based approach',
      examples: 'Proven techniques, research-backed methods',
      language: 'Clear steps, predictable progression',
    },
  },

  ACT: {
    collectivist: {
      challenge: 'Individual values may conflict with family duty',
      adaptation: 'Explore values within family/social context',
      examples: 'Values harmony, interdependence, contribution',
      language: 'Living values in relationship to others',
    },
    highPowerDistance: {
      challenge: 'Defusion may feel disrespectful to thoughts/authority',
      adaptation: 'Frame defusion as respectful observation',
      examples: 'Noticing thoughts with curiosity, not dismissal',
      language: 'Observing versus controlling thoughts',
    },
    highUncertaintyAvoidance: {
      challenge: 'Acceptance of uncertainty is difficult',
      adaptation: 'Gradual exposure to uncertainty within safety',
      examples: 'Small steps toward accepting unknown',
      language: 'Making space for uncertainty gradually',
    },
  },

  MBSR: {
    collectivist: {
      challenge: 'Individual meditation practice may feel self-focused',
      adaptation: 'Frame practice as benefiting others through self-regulation',
      examples: 'Calm presence for family, regulated emotions for community',
      language: 'Practice for self and others',
    },
    religious: {
      challenge: 'Secular mindfulness may conflict with faith',
      adaptation: 'Integrate spiritual language and concepts',
      examples: 'Mindful prayer, sacred pause, divine awareness',
      language: 'Breath as gift, body as temple, awareness as devotion',
    },
    highUncertaintyAvoidance: {
      challenge: 'Open awareness meditation may feel unsafe',
      adaptation: 'Start with structured breath awareness, gradually open',
      examples: 'Anchor to breath before expanding awareness',
      language: 'Safe, structured progression',
    },
  },

  PERMA: {
    collectivist: {
      challenge: 'Individual achievement focus may feel selfish',
      adaptation: 'Emphasize contribution and relationship accomplishment',
      examples: 'Shared goals, community projects, family achievements',
      language: 'We accomplishment alongside I accomplishment',
    },
    religious: {
      challenge: 'Secular wellbeing may exclude spiritual dimension',
      adaptation: 'Integrate faith/spirituality as meaning source',
      examples: 'Faith community, divine purpose, spiritual growth',
      language: 'Blessings, gratitude to divine, sacred meaning',
    },
    lowPowerDistance: {
      challenge: 'Achievement focus may conflict with egalitarian values',
      adaptation: 'Emphasize collaborative achievement and shared success',
      examples: 'Team accomplishments, collective mastery',
      language: 'We did it, together we grew',
    },
  },
};

// ============================================================================
// ADAPTATION GENERATION
// ============================================================================

/**
 * Get adapted version of a technique based on cultural dimensions
 */
export function getAdaptedTechnique(
  technique: string,
  dimensions: CulturalDimensions
): { original: string; adapted: string; adaptations: TechniqueAdaptation[] } {
  const relevantAdaptations = TECHNIQUE_ADAPTATIONS.filter(
    (a) => a.technique === technique
  );

  const appliedAdaptations: TechniqueAdaptation[] = [];

  for (const adaptation of relevantAdaptations) {
    const dimension = dimensions[adaptation.culturalDimension];

    let shouldApply = false;

    // Determine if adaptation should be applied based on dimension values
    switch (adaptation.culturalDimension) {
      case 'individualism_collectivism':
        shouldApply = dimension < 40 || dimension > 60;  // Apply if strongly individualistic or collectivist
        break;
      case 'power_distance':
        shouldApply = dimension > 60 || dimension < 40;
        break;
      case 'uncertainty_avoidance':
        shouldApply = dimension > 60 || dimension < 40;
        break;
      case 'context_style':
        shouldApply = dimension !== 'mixed';
        break;
      case 'religious_orientation':
        shouldApply = dimension === 'conservative' || dimension === 'orthodox';
        break;
    }

    if (shouldApply) {
      appliedAdaptations.push(adaptation);
    }
  }

  return {
    original: 'Original technique text',
    adapted: generateAdaptedText(technique, appliedAdaptations, dimensions),
    adaptations: appliedAdaptations,
  };
}

/**
 * Generate adapted text for a technique
 */
function generateAdaptedText(
  technique: string,
  adaptations: TechniqueAdaptation[],
  dimensions: CulturalDimensions
): string {
  let adaptedText = technique;

  // Apply each adaptation
  for (const adaptation of adaptations) {
    if (adaptation.adaptationType === 'language') {
      adaptedText = adaptedText.replace(new RegExp(adaptation.original, 'gi'), adaptation.adapted);
    }
  }

  // Add cultural context header
  if (adaptations.length > 0) {
    const contextNotes = adaptations.map((a) => a.culturalContext).join('\n');
    adaptedText = `**Culturally Adapted Version**\n\n${adaptedText}\n\n**Cultural Context:**\n${contextNotes}`;
  }

  return adaptedText;
}

/**
 * Get cultural competence notes for a session
 */
export function getCulturalNotes(dimensions: CulturalDimensions): string[] {
  const notes: string[] = [];

  // Individualism/Collectivism notes
  if (dimensions.individualism_collectivism < 40) {
    notes.push('Collectivist cultural context detected. Emphasize family/community values and interdependence.');
  } else if (dimensions.individualism_collectivism > 60) {
    notes.push('Individualist cultural context detected. Emphasize personal autonomy and self-expression.');
  } else {
    notes.push('Balanced individualism/collectivism. Offer both personal and social perspectives.');
  }

  // Power distance notes
  if (dimensions.power_distance > 60) {
    notes.push('High power distance detected. Use respectful language and acknowledge hierarchy/tradition.');
  } else if (dimensions.power_distance < 40) {
    notes.push('Low power distance detected. Use collaborative, egalitarian language.');
  }

  // Uncertainty avoidance notes
  if (dimensions.uncertainty_avoidance > 60) {
    notes.push('High uncertainty avoidance detected. Provide structured, clear exercises with evidence base.');
  } else if (dimensions.uncertainty_avoidance < 40) {
    notes.push('Low uncertainty avoidance detected. Offer exploratory, open-ended approaches.');
  }

  // Context style notes
  if (dimensions.context_style === 'high-context') {
    notes.push('High-context communication detected. Use metaphorical language and provide rich context.');
  } else if (dimensions.context_style === 'low-context') {
    notes.push('Low-context communication detected. Use explicit, direct language.');
  }

  // Religious orientation notes
  if (dimensions.religious_orientation === 'conservative' || dimensions.religious_orientation === 'orthodox') {
    notes.push('Religious cultural context detected. Integrate faith/spirituality where appropriate.');
  } else if (dimensions.religious_orientation === 'secular') {
    notes.push('Secular cultural context detected. Use secular, evidence-based language.');
  }

  return notes;
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  FRAMEWORK_ADAPTATIONS,
};
export type {
  TechniqueAdaptation,
};
