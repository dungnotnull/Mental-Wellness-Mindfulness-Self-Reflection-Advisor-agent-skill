/**
 * Tool Registry — Mental Wellness Self-Reflection Advisor
 *
 * Defines all available tools with their schemas, handlers, and safety configurations.
 * Tools are schema-validated on input and output, with built-in error handling
 * and fallback responses.
 */

import type {
  ToolDefinition,
  ToolHandler,
  ToolResult,
  ToolExecutionContext,
  JSONSchema,
  Config,
} from '../schemas';

// ============================================================================
// JSON SCHEMAS
// ============================================================================

/**
 * Common string schema
 */
const STRING_SCHEMA: JSONSchema = {
  type: 'string',
  description: 'A text string value',
};

/**
 * Common boolean schema
 */
const BOOLEAN_SCHEMA: JSONSchema = {
  type: 'boolean',
  description: 'A boolean value',
};

/**
 * Common object schema
 */
const OBJECT_SCHEMA: JSONSchema = {
  type: 'object',
  description: 'A structured object',
};

/**
 * Common array schema
 */
const ARRAY_SCHEMA: JSONSchema = {
  type: 'array',
  description: 'An array of items',
};

// ============================================================================
// TOOL INPUT SCHEMAS
// ============================================================================

/**
 * Crisis detection input schema
 */
const CRISIS_DETECTION_INPUT_SCHEMA: JSONSchema = {
  type: 'object',
  properties: {
    text: { type: 'string', description: 'Text to analyze for crisis indicators' },
    sensitivity: {
      type: 'string',
      enum: ['strict', 'moderate', 'permissive'],
      description: 'Detection sensitivity level',
    },
  },
  required: ['text'],
};

/**
 * Journaling prompt input schema
 */
const JOURNALING_INPUT_SCHEMA: JSONSchema = {
  type: 'object',
  properties: {
    situation: { type: 'string', description: 'The situation or event to reflect on' },
    emotions: {
      type: 'array',
      items: { type: 'string' },
      description: 'List of emotions experienced',
    },
    thoughts: { type: 'string', description: 'Automatic thoughts that arose' },
    framework: {
      type: 'string',
      enum: ['cbt', 'act', 'general'],
      description: 'Framework to use for guidance',
    },
  },
  required: ['situation'],
};

/**
 * Values exploration input schema
 */
const VALUES_EXPLORE_INPUT_SCHEMA: JSONSchema = {
  type: 'object',
  properties: {
    domain: {
      type: 'string',
      enum: ['relationships', 'work', 'health', 'personal-growth', 'community', 'leisure', 'all'],
      description: 'Life domain to explore',
    },
    current_focus: { type: 'string', description: 'Current area of focus or concern' },
  },
  required: ['domain'],
};

/**
 * Mindfulness exercise input schema
 */
const MINDFULNESS_INPUT_SCHEMA: JSONSchema = {
  type: 'object',
  properties: {
    exercise_type: {
      type: 'string',
      enum: ['breathing', 'body-scan', 'grounding', 'loving-kindness'],
      description: 'Type of mindfulness exercise',
    },
    duration_minutes: { type: 'number', description: 'Duration in minutes' },
    experience_level: {
      type: 'string',
      enum: ['beginner', 'intermediate', 'advanced'],
      description: 'Experience level with mindfulness',
    },
  },
  required: ['exercise_type'],
};

/**
 * Wellbeing assessment input schema
 */
const WELLBEING_ASSESS_INPUT_SCHEMA: JSONSchema = {
  type: 'object',
  properties: {
    domain_focus: {
      type: 'string',
      enum: ['all', 'positive-emotion', 'engagement', 'relationships', 'meaning', 'accomplishment'],
      description: 'PERMA domain to focus on',
    },
    time_frame: {
      type: 'string',
      enum: ['today', 'this-week', 'this-month'],
      description: 'Time frame to assess',
    },
  },
  required: ['domain_focus'],
};

/**
 * Defusion technique input schema
 */
const DEFUSION_INPUT_SCHEMA: JSONSchema = {
  type: 'object',
  properties: {
    thought: { type: 'string', description: 'The troubling thought to work with' },
    technique: {
      type: 'string',
      enum: ['labeling', 'silly-voice', 'leaves-on-stream', 'observer', 'generic'],
      description: 'Defusion technique to use',
    },
  },
  required: ['thought'],
};

// ============================================================================
// TOOL OUTPUT SCHEMAS
// ============================================================================

/**
 * Crisis detection output schema
 */
const CRISIS_DETECTION_OUTPUT_SCHEMA: JSONSchema = {
  type: 'object',
  properties: {
    crisis_detected: { type: 'boolean' },
    detected_keywords: { type: 'array', items: { type: 'string' } },
    severity: { type: 'string', enum: ['none', 'mild', 'moderate', 'severe'] },
    recommended_action: { type: 'string' },
  },
};

/**
 * Journaling prompt output schema
 */
const JOURNALING_OUTPUT_SCHEMA: JSONSchema = {
  type: 'object',
  properties: {
    prompts: { type: 'array', items: { type: 'string' } },
    framework_guidance: { type: 'string' },
    suggested_structure: { type: 'string' },
  },
};

/**
 * Values exploration output schema
 */
const VALUES_EXPLORE_OUTPUT_SCHEMA: JSONSchema = {
  type: 'object',
  properties: {
    identified_values: { type: 'array', items: { type: 'string' } },
    exploration_questions: { type: 'array', items: { type: 'string' } },
    next_steps: { type: 'array', items: { type: 'string' } },
  },
};

/**
 * Mindfulness exercise output schema
 */
const MINDFULNESS_OUTPUT_SCHEMA: JSONSchema = {
  type: 'object',
  properties: {
    exercise_script: { type: 'string' },
    duration_minutes: { type: 'number' },
    instructions: { type: 'string' },
    post_reflection_prompts: { type: 'array', items: { type: 'string' } },
  },
};

/**
 * Wellbeing assessment output schema
 */
const WELLBEING_ASSESS_OUTPUT_SCHEMA: JSONSchema = {
  type: 'object',
  properties: {
    domain_scores: { type: 'object' },
    overall_wellbeing: { type: 'string' },
    recommendations: { type: 'array', items: { type: 'string' } },
  },
};

/**
 * Defusion technique output schema
 */
const DEFUSION_OUTPUT_SCHEMA: JSONSchema = {
  type: 'object',
  properties: {
    technique_name: { type: 'string' },
    instructions: { type: 'string' },
    example_application: { type: 'string' },
    expected_benefit: { type: 'string' },
  },
};

// ============================================================================
// TOOL HANDLERS
// ============================================================================

/**
 * Crisis detection handler
 *
 * Analyzes text for crisis indicators and returns appropriate response.
 * This is a critical safety tool with deterministic behavior.
 */
const crisisDetectionHandler: ToolHandler = async (
  input: any,
  context: ToolExecutionContext
): Promise<ToolResult> => {
  const start_time = Date.now();

  try {
    const { text, sensitivity = 'moderate' } = input;

    // Crisis keyword lists by sensitivity
    const SEVERE_KEYWORDS = [
      'suicid', 'kill myself', 'end it all', 'want to die',
      'planning to harm', 'going to end it',
    ];

    const MODERATE_KEYWORDS = [
      'hopeless', 'no reason to live', 'burden',
      'better off without me', 'can\'t go on',
    ];

    const MILD_KEYWORDS = [
      'overwhelmed', 'can\'t cope', 'struggling',
      'too much', 'not sure I can handle this',
    ];

    let detected_keywords: string[] = [];
    let severity: 'none' | 'mild' | 'moderate' | 'severe' = 'none';

    // Check for keywords based on sensitivity
    if (sensitivity === 'strict' || sensitivity === 'moderate') {
      for (const keyword of SEVERE_KEYWORDS) {
        if (text.toLowerCase().includes(keyword)) {
          detected_keywords.push(keyword);
          severity = 'severe';
        }
      }
    }

    if (severity !== 'severe' && (sensitivity === 'moderate' || sensitivity === 'permissive')) {
      for (const keyword of MODERATE_KEYWORDS) {
        if (text.toLowerCase().includes(keyword)) {
          detected_keywords.push(keyword);
          severity = severity === 'none' ? 'moderate' : severity;
        }
      }
    }

    if (severity === 'none' && sensitivity === 'permissive') {
      for (const keyword of MILD_KEYWORDS) {
        if (text.toLowerCase().includes(keyword)) {
          detected_keywords.push(keyword);
          severity = 'mild';
        }
      }
    }

    // Determine recommended action
    let recommended_action = 'No immediate action required';
    if (severity === 'severe') {
      recommended_action = 'Immediate crisis resources required - see crisis response';
    } else if (severity === 'moderate') {
      recommended_action = 'Consider reaching out to a mental health professional or trusted support';
    } else if (severity === 'mild') {
      recommended_action = 'Practice self-care and consider professional support if symptoms persist';
    }

    // Log crisis detection
    if (severity !== 'none') {
      await context.logger.warn('Crisis indicators detected', {
        session_id: context.session_id,
        severity,
        keywords: detected_keywords,
      });
    }

    return {
      success: true,
      data: {
        crisis_detected: severity !== 'none',
        detected_keywords,
        severity,
        recommended_action,
      },
      execution_time_ms: Date.now() - start_time,
    };
  } catch (error) {
    return {
      success: false,
      error: `Crisis detection failed: ${error}`,
      execution_time_ms: Date.now() - start_time,
    };
  }
};

/**
 * Journaling prompt handler
 *
 * Generates reflective journaling prompts based on CBT/ACT frameworks.
 */
const journalingPromptHandler: ToolHandler = async (
  input: any,
  context: ToolExecutionContext
): Promise<ToolResult> => {
  const start_time = Date.now();

  try {
    const { situation, emotions = [], thoughts = '', framework = 'general' } = input;

    // Load framework-specific prompts
    const prompts: string[] = [];

    if (framework === 'cbt' || framework === 'general') {
      // CBT-style prompts
      prompts.push(
        `What was the situation? ${situation}`,
        'What emotions did you feel? (Rate intensity 1-10)',
        thoughts ? 'What automatic thoughts arose?' : 'What thoughts went through your mind?',
        'Is there evidence for and against these thoughts?',
        'What alternative perspectives might exist?',
        'What would you say to a friend in this situation?'
      );
    }

    if (framework === 'act' || framework === 'general') {
      // ACT-style prompts
      prompts.push(
        'What values does this situation connect to?',
        'What emotions are present? (Can you observe them without judgment?)',
        'What would matter most in how you respond to this?',
        'If you were acting in line with your values, what would you do?',
        'Can you make space for difficult feelings while taking valued action?'
      );
    }

    const framework_guidance = framework === 'cbt'
      ? 'Using CBT framework: Focus on identifying thought patterns and cognitive restructuring.'
      : framework === 'act'
      ? 'Using ACT framework: Focus on acceptance, values, and committed action.'
      : 'Using general reflective framework: Explore thoughts, emotions, and values openly.';

    const suggested_structure = `
**Journal Entry Structure:**
1. **Situation:** Describe the situation objectively
2. **Emotions:** List and rate intensity of emotions
3. **Thoughts:** Document automatic thoughts
4. **Exploration:** Use the prompts above to explore
5. **Insights:** What did you learn? What might you do differently?
    `.trim();

    return {
      success: true,
      data: {
        prompts,
        framework_guidance,
        suggested_structure,
      },
      execution_time_ms: Date.now() - start_time,
    };
  } catch (error) {
    return {
      success: false,
      error: `Journaling prompt generation failed: ${error}`,
      execution_time_ms: Date.now() - start_time,
    };
  }
};

/**
 * Values exploration handler
 *
 * Guides users through ACT-style values clarification exercises.
 */
const valuesExploreHandler: ToolHandler = async (
  input: any,
  context: ToolExecutionContext
): Promise<ToolResult> => {
  const start_time = Date.now();

  try {
    const { domain, current_focus } = input;

    // Domain-specific value prompts
    const DOMAIN_VALUES: Record<string, string[]> = {
      'relationships': ['connection', 'trust', 'vulnerability', 'support', 'intimacy'],
      'work': ['creativity', 'growth', 'contribution', 'integrity', 'excellence'],
      'health': ['vitality', 'balance', 'self-care', 'discipline', 'respect-for-body'],
      'personal-growth': ['learning', 'curiosity', 'authenticity', 'challenge', 'wisdom'],
      'community': ['service', 'belonging', 'justice', 'contribution', 'citizenship'],
      'leisure': ['play', 'joy', 'relaxation', 'adventure', 'expression'],
      'all': ['love', 'growth', 'peace', 'authenticity', 'contribution', 'health', 'learning'],
    };

    const identified_values = DOMAIN_VALUES[domain] || DOMAIN_VALUES['all'];

    const exploration_questions = [
      `In the domain of ${domain}, what matters most to you?`,
      'What kind of person do you want to be in this area?',
      'What would success look like if you were living your values here?',
      current_focus ? `How does "${current_focus}" relate to your values?` : '',
      'What small action could you take today to move toward your values?',
      'What gets in the way of living these values?',
      'If you were fully living this value, what would be different?',
    ].filter(Boolean);

    const next_steps = [
      'Choose one value to focus on this week',
      'Identify one specific action that aligns with this value',
      'Notice when you move toward or away from this value',
      'Consider what support you need to live this value more fully',
      'Reflect on how this value connects to other life domains',
    ];

    return {
      success: true,
      data: {
        identified_values,
        exploration_questions,
        next_steps,
      },
      execution_time_ms: Date.now() - start_time,
    };
  } catch (error) {
    return {
      success: false,
      error: `Values exploration failed: ${error}`,
      execution_time_ms: Date.now() - start_time,
    };
  }
};

/**
 * Mindfulness exercise handler
 *
 * Provides MBSR-informed guided mindfulness exercises.
 */
const mindfulnessExerciseHandler: ToolHandler = async (
  input: any,
  context: ToolExecutionContext
): Promise<ToolResult> => {
  const start_time = Date.now();

  try {
    const { exercise_type, duration_minutes = 5, experience_level = 'beginner' } = input;

    // Exercise scripts
    const EXERCISE_SCRIPTS: Record<string, { script: string; instructions: string }> = {
      'breathing': {
        script: `
**Guided Breathing Exercise**

**Preparation:**
Find a comfortable position, either sitting or lying down. Let your body settle and relax.

**The Exercise:**
1. Bring your attention to your breath
2. Notice the sensation of air entering and leaving your body
3. Count silently: breathe in for 4 counts, hold for 4, breathe out for 4, hold for 4
4. Continue for ${duration_minutes} minutes

**If your mind wanders:**
Gently return attention to your breath without judgment. This is normal and part of the practice.

**Closing:**
When you're ready, slowly open your eyes and notice how you feel.
        `.trim(),
        instructions: 'Sit comfortably. Focus on your breath. Count 4-4-4-4 rhythm.',
      },
      'body-scan': {
        script: `
**Body Scan Meditation**

**Preparation:**
Lie down comfortably on your back with arms at your sides. Close your eyes if comfortable.

**The Scan:**
1. Start at the top of your head
2. Slowly move attention down through your body
3. Notice any sensations without trying to change them
4. Progress through: forehead → jaw → neck → shoulders → arms → hands → chest → abdomen → hips → thighs → calves → feet

**Closing:**
Feel your whole body at once. Notice any changes. Slowly bring movement back when ready.
        `.trim(),
        instructions: 'Lie down comfortably. Slowly scan attention from head to toe.',
      },
      'grounding': {
        script: `
**Grounding Exercise (5-4-3-2-1)**

**Purpose:**
Bring yourself fully into the present moment using your senses.

**The Exercise:**
Acknowledge:
- **5** things you can SEE
- **4** things you can TOUCH
- **3** things you can HEAR
- **2** things you can SMELL
- **1** thing you can TASTE

**Take your time** with each sense. Really notice the details.

**Closing:**
Notice how you feel now - more present? More grounded?
        `.trim(),
        instructions: 'Use your senses to ground in the present moment.',
      },
      'loving-kindness': {
        script: `
**Loving-Kindness Meditation**

**Preparation:**
Sit comfortably. Take a few moments to settle.

**The Exercise:**
Silently repeat these phrases, first for yourself, then for others:

**For yourself:**
"May I be happy. May I be healthy. May I be safe. May I live with ease."

**For someone you care about:**
"May you be happy. May you be healthy. May you be safe. May you live with ease."

**For a neutral person:**
"May you be happy. May you be healthy. May you be safe. May you live with ease."

**For someone difficult:** (optional)
"May you be happy. May you be healthy. May you be safe. May you live with ease."

**For all beings:**
"May all beings be happy. May all beings be healthy. May all beings be safe. May all beings live with ease."

**Closing:**
Notice any feelings of warmth or connection. Carry this with you.
        `.trim(),
        instructions: 'Silently repeat phrases of well-wishing for yourself and others.',
      },
    };

    const exercise = EXERCISE_SCRIPTS[exercise_type] || EXERCISE_SCRIPTS['breathing'];

    const post_reflection_prompts = [
      'What did you notice during this practice?',
      'How do you feel physically, mentally, emotionally?',
      'What was challenging? What came easily?',
      'How might you use this practice in daily life?',
      'What would support you in practicing regularly?',
    ];

    return {
      success: true,
      data: {
        exercise_script: exercise.script,
        duration_minutes,
        instructions: exercise.instructions,
        post_reflection_prompts,
      },
      execution_time_ms: Date.now() - start_time,
    };
  } catch (error) {
    return {
      success: false,
      error: `Mindfulness exercise failed: ${error}`,
      execution_time_ms: Date.now() - start_time,
    };
  }
};

/**
 * Wellbeing assessment handler
 *
 * Provides PERMA-model wellbeing assessment and recommendations.
 */
const wellbeingAssessHandler: ToolHandler = async (
  input: any,
  context: ToolExecutionContext
): Promise<ToolResult> => {
  const start_time = Date.now();

  try {
    const { domain_focus, time_frame = 'this-week' } = input;

    // PERMA domains
    const PERMA_DOMAINS = {
      'positive-emotion': {
        name: 'Positive Emotion',
        description: 'Experiences of positive feelings and emotions',
        questions: [
          'What brought you joy or pleasure this week?',
          'When did you feel most alive or energized?',
          'What made you smile or laugh?',
          'What are you grateful for?',
        ],
      },
      'engagement': {
        name: 'Engagement',
        description: 'Being fully absorbed and interested in activities',
        questions: [
          'When did you feel most engaged or absorbed this week?',
          'What activities caused you to lose track of time?',
          'What strengths were you using when you felt most engaged?',
          'What would engagement look like more of the time?',
        ],
      },
      'relationships': {
        name: 'Relationships',
        description: 'Feeling connected to and supported by others',
        questions: [
          'Who supported you this week?',
          'When did you feel most connected to others?',
          'What relationships energized you? Drained you?',
          'How did you contribute to others\' wellbeing?',
        ],
      },
      'meaning': {
        name: 'Meaning',
        description: 'Feeling that life has purpose and matters',
        questions: [
          'What felt most meaningful this week?',
          'How did your actions this week connect to what matters most?',
          'When did you feel you were contributing to something larger than yourself?',
          'What gives your life purpose and direction?',
        ],
      },
      'accomplishment': {
        name: 'Accomplishment',
        description: 'Making progress toward goals and achieving things',
        questions: [
          'What did you accomplish this week, however small?',
          'What progress did you make toward your goals?',
          'What are you proud of from this week?',
          'What would you like to accomplish next week?',
        ],
      },
    };

    if (domain_focus === 'all') {
      // Return all domains
      const domain_questions: Record<string, string[]> = {};
      for (const [key, domain] of Object.entries(PERMA_DOMAINS)) {
        domain_questions[key] = domain.questions;
      }

      return {
        success: true,
        data: {
          domain_scores: {},  // User needs to assess
          overall_wellbeing: 'Reflect on each domain and consider which areas need attention',
          recommendations: [
            'Rate each domain 1-10 based on your reflection',
            'Choose one domain to focus on improving this week',
            'Consider how domains interact - improving one often helps others',
          ],
        },
        execution_time_ms: Date.now() - start_time,
      };
    }

    // Single domain focus
    const domain = PERMA_DOMAINS[domain_focus];
    if (!domain) {
      throw new Error(`Unknown domain: ${domain_focus}`);
    }

    return {
      success: true,
      data: {
        domain_scores: {},
        overall_wellbeing: `Focus on ${domain.name}: ${domain.description}`,
        recommendations: domain.questions,
      },
      execution_time_ms: Date.now() - start_time,
    };
  } catch (error) {
    return {
      success: false,
      error: `Wellbeing assessment failed: ${error}`,
      execution_time_ms: Date.now() - start_time,
    };
  }
};

/**
 * Defusion technique handler
 *
 * Provides ACT cognitive defusion techniques for working with difficult thoughts.
 */
const defusionTechniqueHandler: ToolHandler = async (
  input: any,
  context: ToolExecutionContext
): Promise<ToolResult> => {
  const start_time = Date.now();

  try {
    const { thought, technique = 'labeling' } = input;

    // Defusion techniques
    const TECHNIQUES: Record<string, { name: string; instructions: string; example: string; benefit: string }> = {
      'labeling': {
        name: 'Thought Labeling',
        instructions: `
1. Notice the difficult thought
2. Instead of getting caught up in the content, label it
3. Say "I'm having the thought that..." or "I notice I'm thinking..."
4. Add the label: "...about [topic]"

**Example:**
Instead of: "I'm a failure"
Try: "I notice I'm having the thought that I'm a failure about my work performance"
        `.trim(),
        example: `"I'm having the thought that ${thought}"`,
        benefit: 'Creates distance from the thought, reminding you it\'s just a thought, not a fact',
      },
      'silly-voice': {
        name: 'Silly Voice',
        instructions: `
1. Identify the difficult thought
2. Say it in a silly voice (cartoon character, opera singer, etc.)
3. Notice how the thought feels different

**Example:**
Say "${thought}" in the voice of [choose a silly character]
        `.trim(),
        example: `Say "${thought}" in your favorite cartoon character's voice`,
        benefit: 'Reduces the thought\'s power by changing how you hear it',
      },
      'leaves-on-stream': {
        name: 'Leaves on a Stream',
        instructions: `
1. Imagine you're sitting by a stream with leaves floating by
2. When a thought appears, place it on a leaf
3. Watch it float away, staying with it briefly then letting it go
4. Return to watching the stream

**For your thought:**
Place "${thought}" on a leaf and watch it float away
        `.trim(),
        example: `Picture "${thought}" written on a leaf, floating downstream`,
        benefit: 'Practices observing thoughts without holding onto them',
      },
      'observer': {
        name: 'Observer Perspective',
        instructions: `
1. Notice you are the one observing the thought
2. Ask: "Who is noticing this thought?"
3. Rest in the awareness of being the observer

**For your thought:**
Ask: "Who is aware of the thought '${thought}'?"
        `.trim(),
        example: `Notice there is a "you" aware of thinking "${thought}"`,
        benefit: 'Connects you to the observing self, separate from thoughts',
      },
      'generic': {
        name: 'Generic Defusion',
        instructions: `
1. Notice the thought: "${thought}"
2. Recognize it as words in your mind
3. Thank your mind for the thought
4. Choose your next action based on what matters to you

Remember: You don't have to believe, follow, or fight with your thoughts.
You can simply notice them and carry them with you while you do what matters.
        `.trim(),
        example: `Notice "${thought}" as just words, then choose your action`,
        benefit: 'Reduces struggle with thoughts while increasing psychological flexibility',
      },
    };

    const selected_technique = TECHNIQUES[technique] || TECHNIQUES['generic'];

    return {
      success: true,
      data: {
        technique_name: selected_technique.name,
        instructions: selected_technique.instructions,
        example_application: selected_technique.example,
        expected_benefit: selected_technique.benefit,
      },
      execution_time_ms: Date.now() - start_time,
    };
  } catch (error) {
    return {
      success: false,
      error: `Defusion technique failed: ${error}`,
      execution_time_ms: Date.now() - start_time,
    };
  }
};

// ============================================================================
// TOOL DEFINITIONS
// ============================================================================

/**
 * Complete tool definitions registry
 */
export const TOOL_DEFINITIONS: ToolDefinition[] = [
  {
    id: 'crisis_detection',
    name: 'Crisis Detection',
    description: 'Detects crisis indicators in text and returns appropriate response',
    input_schema: CRISIS_DETECTION_INPUT_SCHEMA,
    output_schema: CRISIS_DETECTION_OUTPUT_SCHEMA,
    handler: crisisDetectionHandler,
    requires_professional_referral: true,
    crisis_keywords: ['suicide', 'self-harm', 'crisis'],
    timeout_ms: 5000,
    max_retries: 0,  // No retries for crisis detection
    frameworks: ['safety'],
    version: '1.0.0',
  },
  {
    id: 'journaling_prompt',
    name: 'Journaling Prompt Generator',
    description: 'Generates reflective journaling prompts based on CBT/ACT frameworks',
    input_schema: JOURNALING_INPUT_SCHEMA,
    output_schema: JOURNALING_OUTPUT_SCHEMA,
    handler: journalingPromptHandler,
    requires_professional_referral: false,
    timeout_ms: 10000,
    max_retries: 2,
    frameworks: ['CBT', 'ACT'],
    version: '1.0.0',
  },
  {
    id: 'values_explore',
    name: 'Values Exploration',
    description: 'Guides ACT-style values clarification exercises',
    input_schema: VALUES_EXPLORE_INPUT_SCHEMA,
    output_schema: VALUES_EXPLORE_OUTPUT_SCHEMA,
    handler: valuesExploreHandler,
    requires_professional_referral: false,
    timeout_ms: 10000,
    max_retries: 2,
    frameworks: ['ACT'],
    version: '1.0.0',
  },
  {
    id: 'mindfulness_exercise',
    name: 'Mindfulness Exercise',
    description: 'Provides MBSR-informed guided mindfulness exercises',
    input_schema: MINDFULNESS_INPUT_SCHEMA,
    output_schema: MINDFULNESS_OUTPUT_SCHEMA,
    handler: mindfulnessExerciseHandler,
    requires_professional_referral: false,
    timeout_ms: 15000,
    max_retries: 1,
    frameworks: ['MBSR'],
    version: '1.0.0',
  },
  {
    id: 'wellbeing_assess',
    name: 'Wellbeing Assessment',
    description: 'Provides PERMA-model wellbeing assessment and recommendations',
    input_schema: WELLBEING_ASSESS_INPUT_SCHEMA,
    output_schema: WELLBEING_ASSESS_OUTPUT_SCHEMA,
    handler: wellbeingAssessHandler,
    requires_professional_referral: false,
    timeout_ms: 10000,
    max_retries: 2,
    frameworks: ['PERMA'],
    version: '1.0.0',
  },
  {
    id: 'defusion_technique',
    name: 'Defusion Technique',
    description: 'Provides ACT cognitive defusion techniques',
    input_schema: DEFUSION_INPUT_SCHEMA,
    output_schema: DEFUSION_OUTPUT_SCHEMA,
    handler: defusionTechniqueHandler,
    requires_professional_referral: false,
    timeout_ms: 10000,
    max_retries: 2,
    frameworks: ['ACT'],
    version: '1.0.0',
  },
];

// ============================================================================
// TOOL REGISTRY IMPLEMENTATION
// ============================================================================

/**
 * Tool registry implementation
 */
class ToolRegistryImpl {
  private tools: Map<string, ToolDefinition> = new Map();

  constructor() {
    // Register all default tools
    for (const tool of TOOL_DEFINITIONS) {
      this.register(tool);
    }
  }

  register<TInput, TOutput>(tool: ToolDefinition<TInput, TOutput>): void {
    this.tools.set(tool.id, tool);
  }

  get(id: string): ToolDefinition | undefined {
    return this.tools.get(id);
  }

  async execute<TInput, TOutput>(id: string, input: TInput): Promise<ToolResult<TOutput>> {
    const tool = this.get(id);
    if (!tool) {
      return {
        success: false,
        error: `Tool not found: ${id}`,
      };
    }

    // Validate input against schema
    const validation = this.validateInput(input, tool.input_schema);
    if (!validation.valid) {
      return {
        success: false,
        error: `Input validation failed: ${validation.errors.join(', ')}`,
      };
    }

    // Create execution context
    const context: ToolExecutionContext = {
      session_id: 'session-id-placeholder',  // Would be injected
      config: null as any,  // Would be injected
      agent_state: null as any,  // Would be injected
      logger: {
        debug: console.debug,
        info: console.info,
        warn: console.warn,
        error: console.error,
      },
    };

    // Execute with retries
    let last_error: string | undefined;
    for (let attempt = 0; attempt <= tool.max_retries; attempt++) {
      try {
        const result = await tool.handler(input, context);

        // Validate output
        if (result.success && result.data) {
          const output_validation = this.validateOutput(result.data, tool.output_schema);
          if (!output_validation.valid) {
            return {
              success: false,
              error: `Output validation failed: ${output_validation.errors.join(', ')}`,
            };
          }
        }

        return result;
      } catch (error) {
        last_error = String(error);
        if (attempt < tool.max_retries) {
          // Wait before retry
          await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
        }
      }
    }

    return {
      success: false,
      error: last_error || 'Unknown error',
    };
  }

  list(): ToolDefinition[] {
    return Array.from(this.tools.values());
  }

  private validateInput(input: any, schema: JSONSchema): { valid: boolean; errors: string[] } {
    // Simplified validation - full JSON schema validation would use a library
    const errors: string[] = [];

    if (schema.required) {
      for (const field of schema.required) {
        if (!(field in input)) {
          errors.push(`Missing required field: ${field}`);
        }
      }
    }

    return { valid: errors.length === 0, errors };
  }

  private validateOutput(output: any, schema: JSONSchema): { valid: boolean; errors: string[] } {
    // Simplified validation
    return { valid: true, errors: [] };
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

let toolRegistryInstance: ToolRegistryImpl | null = null;

export function getToolRegistry(): ToolRegistryImpl {
  if (!toolRegistryInstance) {
    toolRegistryInstance = new ToolRegistryImpl();
  }
  return toolRegistryInstance;
}

export function resetToolRegistry(): void {
  toolRegistryInstance = null;
}

// ============================================================================
// EXPORTS
// ============================================================================

export { ToolRegistryImpl };
export type { ToolRegistryImpl as ToolRegistry };
