/**
 * Cultural Detection System — Identify and Adapt to Cultural Context
 *
 * System for detecting user cultural dimensions and providing
 * culturally intelligent adaptations for wellness techniques.
 */

// ============================================================================
// CULTURAL DIMENSIONS
// ============================================================================

/**
 * Cultural dimension definitions based on Hofstede, Schwartz, and GLOBE models
 */
export interface CulturalDimensions {
  individualism_collectivism: number;  // 0-100: Individualistic → Collectivist
  power_distance: number;              // 0-100: Low → High power distance
  uncertainty_avoidance: number;       // 0-100: Low → High uncertainty avoidance
  masculinity_femininity: number;      // 0-100: Masculine → Feminine
  long_term_orientation: number;      // 0-100: Short-term → Long-term
  context_style: 'low-context' | 'high-context' | 'mixed';
  language_proficiency: 'native' | 'fluent' | 'intermediate' | 'basic';
  religious_orientation: 'secular' | 'liberal' | 'moderate' | 'conservative' | 'orthodox';
}

/**
 * Default cultural dimensions (US/Western baseline)
 */
export const DEFAULT_CULTURAL_DIMENSIONS: CulturalDimensions = {
  individualism_collectivism: 91,      // Highly individualistic
  power_distance: 40,                  // Low power distance
  uncertainty_avoidance: 46,            // Low uncertainty avoidance
  masculinity_femininity: 62,          // Moderately masculine
  long_term_orientation: 26,           // Short-term orientation
  context_style: 'low-context',
  language_proficiency: 'native',
  religious_orientation: 'liberal',
};

// ============================================================================
// CULTURAL PROFILES
// ============================================================================

/**
 * Predefined cultural profiles for major regions/cultures
 */
export const CULTURAL_PROFILES: Record<string, CulturalDimensions> = {
  'united-states': {
    individualism_collectivism: 91,
    power_distance: 40,
    uncertainty_avoidance: 46,
    masculinity_femininity: 62,
    long_term_orientation: 26,
    context_style: 'low-context',
    language_proficiency: 'native',
    religious_orientation: 'liberal',
  },
  'western-europe': {
    individualism_collectivism: 89,
    power_distance: 35,
    uncertainty_avoidance: 53,
    masculinity_femininity: 57,
    long_term_orientation: 33,
    context_style: 'low-context',
    language_proficiency: 'native',
    religious_orientation: 'secular',
  },
  'east-asia': {
    individualism_collectivism: 18,     // Collectivist
    power_distance: 60,                // High power distance
    uncertainty_avoidance: 82,          // High uncertainty avoidance
    masculinity_femininity: 75,        // Masculine
    long_term_orientation: 87,          // Long-term orientation
    context_style: 'high-context',
    language_proficiency: 'native',
    religious_orientation: 'moderate',
  },
  'south-asia': {
    individualism_collectivism: 48,     // Mixed
    power_distance: 77,                // High power distance
    uncertainty_avoidance: 40,          // Low uncertainty avoidance
    masculinity_femininity: 56,        // Mixed
    long_term_orientation: 51,          // Mixed
    context_style: 'high-context',
    language_proficiency: 'native',
    religious_orientation: 'conservative',
  },
  'latin-america': {
    individualism_collectivism: 21,     // Collectivist
    power_distance: 81,                // Very high power distance
    uncertainty_avoidance: 82,          // High uncertainty avoidance
    masculinity_femininity: 69,        // Masculine
    long_term_orientation: 29,          // Short-term orientation
    context_style: 'high-context',
    language_proficiency: 'native',
    religious_orientation: 'conservative',
  },
  'middle-east': {
    individualism_collectivism: 38,     // Collectivist
    power_distance: 80,                // Very high power distance
    uncertainty_avoidance: 68,          // Moderate-high uncertainty avoidance
    masculinity_femininity: 73,        // Masculine
    long_term_orientation: 45,          // Mixed
    context_style: 'high-context',
    language_proficiency: 'native',
    religious_orientation: 'orthodox',
  },
  'africa': {
    individualism_collectivism: 27,     // Collectivist
    power_distance: 70,                // High power distance
    uncertainty_avoidance: 54,          // Moderate uncertainty avoidance
    masculinity_femininity: 55,        // Mixed
    long_term_orientation: 40,          // Mixed
    context_style: 'high-context',
    language_proficiency: 'native',
    religious_orientation: 'moderate',
  },
  'southeast-asia': {
    individualism_collectivism: 25,     // Collectivist
    power_distance: 64,                // High power distance
    uncertainty_avoidance: 48,          // Moderate uncertainty avoidance
    masculinity_femininity: 60,        // Moderately masculine
    long_term_orientation: 56,          // Mixed
    context_style: 'high-context',
    language_proficiency: 'native',
    religious_orientation: 'moderate',
  },
};

// ============================================================================
// CULTURAL DETECTION FUNCTIONS
// ============================================================================

/**
 * Detect cultural dimensions from user input
 */
export function detectCulturalDimensions(input: string, conversationHistory?: string[]): Partial<CulturalDimensions> {
  const dimensions: Partial<CulturalDimensions> = {};
  const text = input.toLowerCase() + ' ' + (conversationHistory || []).join(' ').toLowerCase();

  // Detect individualism vs collectivism
  const individualismIndicators = [
    'i want', 'i need', 'my goals', 'personal', 'autonomy', 'independence',
    'self-improvement', 'personal growth', 'my choice', 'individual',
  ];
  const collectivismIndicators = [
    'we want', 'we need', 'family', 'community', 'group', 'harmony',
    'together', 'collective', 'our goals', 'interdependence', 'duty',
  ];

  const individualismScore = countMatches(text, individualismIndicators);
  const collectivismScore = countMatches(text, collectivismIndicators);

  if (individualismScore > collectivismScore * 1.5) {
    dimensions.individualism_collectivism = 75 + Math.min(25, individualismScore * 2);
  } else if (collectivismScore > individualismScore * 1.5) {
    dimensions.individualism_collectivism = 25 - Math.min(25, collectivismScore * 2);
  } else {
    dimensions.individualism_collectivism = 50;  // Balanced
  }

  // Detect power distance (respect for authority, hierarchy)
  const highPowerDistanceIndicators = [
    'respect', 'authority', 'elder', 'teacher', 'boss', 'parents',
    'tradition', 'hierarchy', 'obey', 'deference', 'proper',
  ];
  const lowPowerDistanceIndicators = [
    'equality', 'challenge', 'question', 'direct', 'informal',
    'egalitarian', 'peer', 'flat', 'collaborative',
  ];

  const highPowerScore = countMatches(text, highPowerDistanceIndicators);
  const lowPowerScore = countMatches(text, lowPowerDistanceIndicators);

  if (highPowerScore > lowPowerScore) {
    dimensions.power_distance = 50 + Math.min(50, highPowerScore * 5);
  } else if (lowPowerScore > highPowerScore) {
    dimensions.power_distance = 50 - Math.min(50, lowPowerScore * 5);
  }

  // Detect context style
  const highContextIndicators = [
    'implied', 'understood', 'between the lines', 'reading between',
    'subtle', 'indirect', 'implicit',
  ];
  const lowContextIndicators = [
    'explicit', 'clear', 'direct', 'obvious', 'stated', 'frank',
    'straightforward', 'no ambiguity',
  ];

  const highContextScore = countMatches(text, highContextIndicators);
  const lowContextScore = countMatches(text, lowContextIndicators);

  if (highContextScore > lowContextScore) {
    dimensions.context_style = 'high-context';
  } else if (lowContextScore > highContextScore) {
    dimensions.context_style = 'low-context';
  } else {
    dimensions.context_style = 'mixed';
  }

  // Detect religious orientation
  const religiousIndicators = ['faith', 'god', 'church', 'temple', 'mosque', 'religion', 'spiritual'];
  const religiousCount = countMatches(text, religiousIndicators);

  if (religiousCount > 2) {
    dimensions.religious_orientation = 'conservative';
  } else if (religiousCount > 0) {
    dimensions.religious_orientation = 'liberal';
  } else {
    dimensions.religious_orientation = 'secular';
  }

  return dimensions;
}

/**
 * Count matches of indicators in text
 */
function countMatches(text: string, indicators: string[]): number {
  return indicators.reduce((count, indicator) => {
    return count + (text.includes(indicator) ? 1 : 0);
  }, 0);
}

/**
 * Infer cultural profile from user input
 */
export function inferCulturalProfile(input: string, conversationHistory?: string[]): string | null {
  const dimensions = detectCulturalDimensions(input, conversationHistory);

  // Match against known profiles
  let bestMatch: string | null = null;
  let bestScore = 0;

  for (const [profileName, profileDimensions] of Object.entries(CULTURAL_PROFILES)) {
    const score = calculateProfileMatch(dimensions, profileDimensions);
    if (score > bestScore && score > 0.6) {
      bestMatch = profileName;
      bestScore = score;
    }
  }

  return bestMatch;
}

/**
 * Calculate match score between detected and profile dimensions
 */
function calculateProfileMatch(detected: Partial<CulturalDimensions>, profile: CulturalDimensions): number {
  let totalScore = 0;
  let dimensionCount = 0;

  const compareDimension = (detectedValue: number | undefined, profileValue: number): number => {
    if (detectedValue === undefined) return 0;
    const difference = Math.abs(detectedValue - profileValue);
    return 1 - (difference / 100);  // 0 = no match, 1 = perfect match
  };

  if (detected.individualism_collectivism !== undefined) {
    totalScore += compareDimension(detected.individualism_collectivism, profile.individualism_collectivism);
    dimensionCount++;
  }
  if (detected.power_distance !== undefined) {
    totalScore += compareDimension(detected.power_distance, profile.power_distance);
    dimensionCount++;
  }
  if (detected.uncertainty_avoidance !== undefined) {
    totalScore += compareDimension(detected.uncertainty_avoidance, profile.uncertainty_avoidance);
    dimensionCount++;
  }

  return dimensionCount > 0 ? totalScore / dimensionCount : 0;
}

// ============================================================================
// CULTURAL ADAPTATION RULES
// ============================================================================

/**
 * Adaptation rules for different cultural dimensions
 */
export const CULTURAL_ADAPTATIONS = {
  individualism_collectivism: {
    individualistic: {
      valuesFocus: 'personal goals, autonomy, self-expression',
      language: 'I, my, personal, individual',
      examples: 'Personal achievements, self-improvement, individual choices',
      metaphors: 'Personal journeys, climbing mountains, paths',
    },
    collectivist: {
      valuesFocus: 'family harmony, community, interdependence',
      language: 'we, our, family, community, together',
      examples: 'Family contributions, social harmony, shared goals',
      metaphors: 'Garden tending, community building, weaving',
    },
    balanced: {
      valuesFocus: 'both personal and group wellbeing',
      language: 'I and we, personal and social',
      examples: 'Personal growth that benefits others, balanced goals',
      metaphors: 'Trees in a forest, musicians in an orchestra',
    },
  },

  power_distance: {
    low: {
      authorityApproach: 'collaborative, peer-to-peer, questioning',
      language: 'direct, casual, first-name basis',
      examples: 'Challenging authority, egalitarian relationships',
    },
    high: {
      authorityApproach: 'respectful, hierarchical, deferential',
      language: 'formal titles, respectful address',
      examples: 'Respecting wisdom, honoring traditions',
    },
  },

  uncertainty_avoidance: {
    low: {
      approach: 'exploratory, experimental, open-ended',
      structure: 'flexible, adaptable, multiple options',
      examples: 'Trying new things, embracing ambiguity',
    },
    high: {
      approach: 'structured, clear steps, predictable',
      structure: 'organized, sequential, proven methods',
      examples: 'Evidence-based practices, established techniques',
    },
  },

  context_style: {
    'low-context': {
      communication: 'explicit, direct, clear',
      explanations: 'detailed, step-by-step, unambiguous',
    },
    'high-context': {
      communication: 'implied, indirect, nuanced',
      explanations: 'thematic, metaphorical, between the lines',
    },
    mixed: {
      communication: 'balanced directness and nuance',
      explanations: 'clear but context-aware',
    },
  },
};

/**
 * Get adaptation recommendations based on cultural dimensions
 */
export function getAdaptationRecommendations(dimensions: CulturalDimensions): string[] {
  const recommendations: string[] = [];

  // Individualism/Collectivism adaptations
  if (dimensions.individualism_collectivism < 40) {
    recommendations.push('Emphasize family and community in values work');
    recommendations.push('Use group-focused metaphors and examples');
    recommendations.push('Frame personal goals within family/social context');
  } else if (dimensions.individualism_collectivism > 60) {
    recommendations.push('Emphasize personal autonomy and self-expression');
    recommendations.push('Use individual-focused metaphors and examples');
    recommendations.push('Frame goals in terms of personal achievement');
  } else {
    recommendations.push('Balance both individual and social perspectives');
    recommendations.push('Offer both personal and group-oriented examples');
  }

  // Power distance adaptations
  if (dimensions.power_distance > 60) {
    recommendations.push('Use respectful, formal language');
    recommendations.push('Acknowledge cultural traditions and wisdom');
    recommendations.push('Respect family hierarchy in examples');
  } else if (dimensions.power_distance < 40) {
    recommendations.push('Use collaborative, egalitarian language');
    recommendations.push('Encourage questioning and exploration');
  }

  // Uncertainty avoidance adaptations
  if (dimensions.uncertainty_avoidance > 60) {
    recommendations.push('Provide clear, structured exercises');
    recommendations.push('Emphasize evidence-based approaches');
    recommendations.push('Minimize ambiguity in instructions');
  } else if (dimensions.uncertainty_avoidance < 40) {
    recommendations.push('Offer exploratory, open-ended exercises');
    recommendations.push('Encourage experimentation and discovery');
  }

  // Context style adaptations
  if (dimensions.context_style === 'high-context') {
    recommendations.push('Use metaphorical and thematic language');
    recommendations.push('Provide context-rich explanations');
  } else if (dimensions.context_style === 'low-context') {
    recommendations.push('Use explicit, direct language');
    recommendations.push('Provide clear, unambiguous instructions');
  }

  // Religious orientation adaptations
  if (dimensions.religious_orientation === 'conservative' || dimensions.religious_orientation === 'orthodox') {
    recommendations.push('Integrate faith/spirituality where appropriate');
    recommendations.push('Respect religious values in examples');
    recommendations.push('Acknowledge spiritual dimension of wellbeing');
  } else if (dimensions.religious_orientation === 'secular') {
    recommendations.push('Focus on secular wellbeing approaches');
    recommendations.push('Use secular language and examples');
  }

  return recommendations;
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  CULTURAL_PROFILES,
  CULTURAL_ADAPTATIONS,
  DEFAULT_CULTURAL_DIMENSIONS,
};
export type {
  CulturalDimensions,
};
