/**
 * Agent Orchestrator — Main Request Processing and Routing
 *
 * Coordinates all agent components: skill registry, tool execution,
 * hook chain, safety systems, and LLM integration.
 */

import { SKILL_REGISTRY } from './skills/registry';
import { TOOL_REGISTRY } from '../../config/tools/registry';
import { HOOK_CHAIN } from '../../config/hooks/chain';
import { CrisisDetectionTool } from './tools/crisis-detection';
import { detectCulturalDimensions, getCulturalNotes } from '../../config/cultural/detection';
import { scoreAssessment, calculateProgressMetrics } from '../../config/assessments/registry';
import { formatCitation } from '../../config/citations/registry';

// ============================================================================
// REQUEST/RESPONSE TYPES
// ============================================================================

export interface AgentRequest {
  userId: string;
  sessionId: string;
  message: string;
  conversationHistory?: ConversationMessage[];
  userContext?: UserContext;
  metadata?: Record<string, unknown>;
}

export interface ConversationMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

export interface UserContext {
  culturalProfile?: string;
  assessmentHistory?: AssessmentRecord[];
  preferences?: {
    language: string;
    evidenceDetail: 'minimal' | 'moderate' | 'comprehensive';
    culturalAdaptation: boolean;
    researchIntegration: boolean;
  };
}

export interface AssessmentRecord {
  assessmentId: string;
  timestamp: Date;
  score: number;
  interpretation: string;
}

export interface AgentResponse {
  message: string;
  metadata: ResponseMetadata;
  suggestions?: string[];
  citations?: Citation[];
  crisisAlert?: CrisisAlert;
  assessmentPrompt?: AssessmentPrompt;
}

export interface ResponseMetadata {
  skill?: string;
  tools: string[];
  confidence: number;
  processingTime: number;
  culturalNotes?: string[];
  evidenceGrade?: string;
  effectSize?: string;
}

export interface Citation {
  id: string;
  authors: string;
  year: number;
  title: string;
  journal?: string;
  doi?: string;
  pmid?: string;
  url?: string;
  effectSize?: string;
  evidenceGrade?: string;
}

export interface CrisisAlert {
  detected: boolean;
  severity: 'severe' | 'moderate' | 'mild';
  message: string;
  resources: string[];
}

export interface AssessmentPrompt {
  assessmentId: string;
  reason: string;
  urgency: 'recommended' | 'suggested' | 'optional';
}

// ============================================================================
// AGENT ORCHESTRATOR
// ============================================================================

export class AgentOrchestrator {
  private crisisDetection: CrisisDetectionTool;
  private skillRegistry: typeof SKILL_REGISTRY;
  private toolRegistry: typeof TOOL_REGISTRY;
  private hookChain: typeof HOOK_CHAIN;

  constructor() {
    this.crisisDetection = new CrisisDetectionTool();
    this.skillRegistry = SKILL_REGISTRY;
    this.toolRegistry = TOOL_REGISTRY;
    this.hookChain = HOOK_CHAIN;
  }

  /**
   * Process user request and generate response
   */
  async processRequest(request: AgentRequest): Promise<AgentResponse> {
    const startTime = Date.now();

    // Execute BeforeRequest hook
    await this.hookChain.beforeRequest.execute(request);

    // Detect cultural dimensions
    const culturalDimensions = request.userContext?.preferences?.culturalAdaptation
      ? detectCulturalDimensions(request.message, request.conversationHistory?.map(m => m.content))
      : null;

    // Detect crisis
    const crisisAlert = await this.crisisDetection.detect(request.message);

    if (crisisAlert.detected) {
      // Execute OnCrisisDetected hook
      await this.hookChain.onCrisisDetected.execute(request, crisisAlert);

      return this.generateCrisisResponse(crisisAlert);
    }

    // Execute DiagnosticFilter hook
    await this.hookChain.diagnosticFilter.execute(request);

    // Route to appropriate skill
    const skill = this.routeToSkill(request, crisisAlert);

    // Execute AfterRouting hook
    await this.hookChain.afterRouting.execute(request, skill);

    // Prepare context
    const context = this.prepareContext(request, skill, culturalDimensions);

    // Execute BeforeExecution hook
    await this.hookChain.beforeExecution.execute(context);

    // Execute skill with tools
    const response = await this.executeSkill(skill, context);

    // Inject citations if research integration enabled
    if (request.userContext?.preferences?.researchIntegration) {
      response.citations = this.injectCitations(skill, request.message);
    }

    // Add metadata
    response.metadata = {
      skill,
      tools: this.getUsedTools(request),
      confidence: this.calculateConfidence(request, response),
      processingTime: Date.now() - startTime,
      culturalNotes: culturalDimensions ? getCulturalNotes(culturalDimensions) : undefined,
      evidenceGrade: this.getEvidenceGrade(skill),
      effectSize: this.getEffectSize(skill),
    };

    // Execute AfterExecution hook
    await this.hookChain.afterExecution.execute(request, response);

    // Check if assessment recommended
    response.assessmentPrompt = this.checkAssessmentNeed(request, skill);

    return response;
  }

  /**
   * Route request to appropriate skill
   */
  private routeToSkill(request: AgentRequest, crisisAlert: CrisisAlert): string {
    // If crisis detected, route to safety skill
    if (crisisAlert.detected) {
      return 'safety-router';
    }

    const message = request.message.toLowerCase();

    // Check for journaling-related requests
    if (this.matchesKeywords(message, ['journal', 'write', 'reflect', 'thought record', 'cbt'])) {
      return 'journaling-advisor';
    }

    // Check for mindfulness-related requests
    if (this.matchesKeywords(message, ['mindful', 'meditation', 'breath', 'breathe', 'body scan', 'grounding'])) {
      return 'mindfulness-guide';
    }

    // Check for values-related requests
    if (this.matchesKeywords(message, ['value', 'meaning', 'purpose', 'what matters', 'clarify'])) {
      return 'values-coach';
    }

    // Check for wellbeing-related requests
    if (this.matchesKeywords(message, ['wellbeing', 'well-being', 'flourish', 'thrive', 'gratitude', 'strengths'])) {
      return 'wellbeing-educator';
    }

    // Check for defusion-related requests
    if (this.matchesKeywords(message, ['defusion', 'thought', 'fusion', 'unsticky', 'observe thoughts'])) {
      return 'defusion-helper';
    }

    // Default to journaling advisor
    return 'journaling-advisor';
  }

  /**
   * Check if message matches keywords
   */
  private matchesKeywords(message: string, keywords: string[]): boolean {
    return keywords.some((keyword) => message.includes(keyword));
  }

  /**
   * Prepare context for skill execution
   */
  private prepareContext(
    request: AgentRequest,
    skill: string,
    culturalDimensions: any
  ): Record<string, unknown> {
    return {
      message: request.message,
      conversationHistory: request.conversationHistory,
      userContext: request.userContext,
      culturalDimensions,
      sessionId: request.sessionId,
      userId: request.userId,
    };
  }

  /**
   * Execute skill with tools
   */
  private async executeSkill(
    skill: string,
    context: Record<string, unknown>
  ): Promise<AgentResponse> {
    const skillDefinition = this.skillRegistry[skill];
    if (!skillDefinition) {
      throw new Error(`Skill not found: ${skill}`);
    }

    // Execute skill logic
    let message: string;
    let suggestions: string[] = [];

    switch (skill) {
      case 'journaling-advisor':
        message = this.generateJournalingResponse(context);
        suggestions = ['Try a daily check-in', 'Use thought records for difficult thoughts', 'Explore situation patterns'];
        break;
      case 'mindfulness-guide':
        message = this.generateMindfulnessResponse(context);
        suggestions = ['Start with 5 minutes of breath awareness', 'Try body scan for stress', 'Use STOP practice during the day'];
        break;
      case 'values-coach':
        message = this.generateValuesResponse(context);
        suggestions = ['Try Values Bull\'s Eye exercise', 'Consider Eulogy perspective', 'Explore domains that matter'];
        break;
      case 'wellbeing-educator':
        message = this.generateWellbeingResponse(context);
        suggestions = ['Practice gratitude journaling', 'Use your strengths in new ways', 'Set meaningful goals'];
        break;
      case 'defusion-helper':
        message = this.generateDefusionResponse(context);
        suggestions = ['Label thoughts as thoughts', 'Try silly voice defusion', 'Observe thoughts like leaves on stream'];
        break;
      default:
        message = 'I\'m here to support your mental wellbeing journey. How can I help you today?';
    }

    return {
      message,
      suggestions,
      metadata: {
        skill,
        tools: [],
        confidence: 0.8,
        processingTime: 0,
      },
    };
  }

  /**
   * Generate journaling response
   */
  private generateJournalingResponse(context: Record<string, unknown>): string {
    const message = context.message as string;

    // Check for thought record request
    if (message.toLowerCase().includes('thought record')) {
      return this.generateThoughtRecordTemplate();
    }

    // Check for situation exploration
    if (message.toLowerCase().includes('situation') || message.toLowerCase().includes('explore')) {
      return this.generateSituationExploration();
    }

    // Default journaling guidance
    return `I'd be happy to support your journaling practice. Journaling is a powerful tool for self-reflection and emotional processing.

**Journaling Options:**

1. **Daily Check-In** — Reflect on your thoughts, emotions, and experiences from today
2. **Thought Record** — Work through difficult thoughts using cognitive restructuring
3. **Weekly Reflection** — Look back on patterns and themes from the week

**Research Foundation:** Journaling is supported by meta-analyses showing moderate effects on wellbeing (r=0.29) and specific techniques like thought records show large effects for depression (d=0.82).

Which type of journaling would you like to explore?`;
  }

  /**
   * Generate thought record template
   */
  private generateThoughtRecordTemplate(): string {
    return `Let's work through a Thought Record together. This CBT technique has strong evidence for reducing depressive symptoms (d=0.82) and anxiety (d=0.90).

**Thought Record Template:**

**1. SITUATION** — What happened? (Describe objectively, like a camera recording it)
- [Describe the situation here]

**2. AUTOMATIC THOUGHT** — What thought went through your mind?
- [Capture the exact thought]
- How much do you believe it? (0-100%): ___

**3. EMOTION** — What did you feel?
- [Name each emotion]
- How intense? (0-100 each): ___

**4. COGNITIVE DISTORTION CHECK** — Are any distortions present?
- [Check for: all-or-nothing, overgeneralization, mental filter, etc.]

**5. EVIDENCE** — Evidence for and against the automatic thought
- Evidence FOR: [List]
- Evidence AGAINST: [List]
- What would you tell a friend? [Consider]

**6. ALTERNATIVE THOUGHT** — What's a more balanced thought?
- [Craft balanced thought]
- How much do you believe it now? (0-100%): ___

**7. OUTCOME** — How do you feel now?
- [Reflect on shift]

Would you like to work through a specific situation together?`;
  }

  /**
   * Generate situation exploration
   */
  private generateSituationExploration(): string {
    return `Let's explore a situation that's been on your mind. Cognitive restructuring helps us examine thoughts more clearly (supported by research with d=0.82 for depression reduction).

**To start, could you describe:**

1. **What happened?** — Just the facts, as a camera would record them
2. **What went through your mind?** — The exact thought or interpretation
3. **What did you feel?** — The emotions that arose

Once you share these, we can work through identifying any cognitive distortions and finding a more balanced perspective.

What situation would you like to explore?`;
  }

  /**
   * Generate mindfulness response
   */
  private generateMindfulnessResponse(context: Record<string, unknown>): string {
    return `I'd be happy to guide you through a mindfulness practice. Mindfulness-Based Interventions show moderate effects for reducing psychological distress (g=0.53) and stress (d=0.65).

**Mindfulness Options:**

1. **Diaphragmatic Breathing** (5-10 min) — Activates the vagus nerve, reduces stress
2. **Body Scan Meditation** (20-45 min) — MBSR foundational practice
3. **Sitting Meditation** (10-45 min) — Breath awareness and open monitoring
4. **Brief Practices** — STOP technique, 5-4-3-2-1 grounding, mindful walking

**Research Foundation:** Breathing exercises show d=0.65 for stress reduction, body scan shows g=0.53 for distress reduction.

Which practice would you like to try? I can guide you through it step by step.`;
  }

  /**
   * Generate values response
   */
  private generateValuesResponse(context: Record<string, unknown>): string {
    return `Values clarification is a core ACT process with strong support for psychological flexibility (g=0.54) and values-congruent goal pursuit increases life satisfaction by 35% more than extrinsic goals.

**Values Exploration Options:**

1. **Values Bull's Eye** — Explore values across life domains and current alignment
2. **Eulogy Exercise** — Gain end-of-life perspective on what truly matters
3. **Values Card Sort** — Identify and prioritize your core values

**Research Foundation:** Values work is a core ACT process with meta-analytic support (g=0.54). Values-congruent action predicts significantly higher wellbeing than extrinsic goals (r=0.35).

Which values exercise resonates with you?`;
  }

  /**
   * Generate wellbeing response
   */
  private generateWellbeingResponse(context: Record<string, unknown>): string {
    return `Let's explore practices that enhance wellbeing. Positive Psychology Interventions (PPIs) show small-to-moderate effects for overall wellbeing (r=0.29), with gratitude showing particularly strong effects (d=0.68-1.06).

**Wellbeing Practices:**

1. **Gratitude Journaling** — Three good things, gratitude letter
2. **Strengths Use** — Identify and use signature strengths in new ways
3. **Positive Relationships** — Active Constructive Responding
4. **Meaning & Purpose** — Reflect on what gives life meaning
5. **Accomplishment** — SMART goal setting with growth mindset

**Research Foundation:** Gratitude journaling shows d=0.68-1.06 for life satisfaction. Using signature strengths increases happiness by d=0.48.

Which wellbeing practice would you like to explore?`;
  }

  /**
   * Generate defusion response
   */
  private generateDefusionResponse(context: Record<string, unknown>): string {
    return `Cognitive defusion is a core ACT process showing strong effects for reducing thought believability and discomfort (d=0.58-1.15).

**Defusion Techniques:**

1. **Thought Labeling** — "I'm having the thought that..."
2. **Silly Voice** — Say difficult thoughts in a silly voice
3. **Leaves on Stream** — Visualize thoughts floating by
4. **Observer Exercise** — Notice who's noticing the thoughts
5. **Thank Your Mind** — Acknowledge thoughts without engaging

**Research Foundation:** Defusion techniques reduce thought discomfort by d=0.58-1.15 and increase behavioral flexibility.

Which technique would you like to try?`;
  }

  /**
   * Inject citations into response
   */
  private injectCitations(skill: string, message: string): Citation[] {
    const citations: Citation[] = [];

    // Add citations based on skill
    switch (skill) {
      case 'journaling-advisor':
        citations.push({
          id: 'hofmann-2012',
          authors: 'Hofmann et al.',
          year: 2012,
          title: 'The efficacy of cognitive behavioral therapy: A review of meta-analyses',
          journal: 'Cognitive Therapy and Research',
          effectSize: 'd=0.82 for depression, d=0.90 for anxiety',
          evidenceGrade: 'A (Strong Evidence)',
        });
        citations.push({
          id: 'sin-lyubomirsky-2009',
          authors: 'Sin & Lyubomirsky',
          year: 2009,
          title: 'Enhancing well-being and alleviating depressive symptoms with positive psychology interventions',
          journal: 'The Journal of Positive Psychology',
          effectSize: 'r=0.29 for PPIs overall',
          evidenceGrade: 'A (Strong Evidence)',
        });
        break;
      case 'mindfulness-guide':
        citations.push({
          id: 'khoury-2015',
          authors: 'Khoury et al.',
          year: 2015,
          title: 'Mindfulness-based therapy: A comprehensive meta-analysis',
          journal: 'Clinical Psychology Review',
          effectSize: 'g=0.53 for MBIs overall',
          evidenceGrade: 'A (Strong Evidence)',
        });
        break;
      case 'values-coach':
        citations.push({
          id: 'hayes-2006',
          authors: 'Hayes et al.',
          year: 2006,
          title: 'Acceptance and commitment therapy: Model, processes and outcomes',
          journal: 'Behaviour Research and Therapy',
          effectSize: 'g=0.54 for psychological flexibility',
          evidenceGrade: 'A (Strong Evidence)',
        });
        break;
      case 'wellbeing-educator':
        citations.push({
          id: 'seligman-2005',
          authors: 'Seligman et al.',
          year: 2005,
          title: 'Positive psychotherapy: A manual for treating depression',
          journal: 'Oxford University Press',
          effectSize: 'd=0.68-1.06 for gratitude',
          evidenceGrade: 'A (Strong Evidence)',
        });
        break;
      case 'defusion-helper':
        citations.push({
          id: 'masuda-2004',
          authors: 'Masuda et al.',
          year: 2004,
          title: 'Cognitive defusion and self-relevant negative thoughts',
          journal: 'Behaviour Research and Therapy',
          effectSize: 'd=0.58-1.15 for discomfort reduction',
          evidenceGrade: 'A (Strong Evidence)',
        });
        break;
    }

    return citations;
  }

  /**
   * Get tools used in request
   */
  private getUsedTools(request: AgentRequest): string[] {
    const tools: string[] = [];

    // Check if crisis detection was used
    if (request.message.toLowerCase().match(/suicide|kill myself|end it all/)) {
      tools.push('crisis-detection');
    }

    // Check if assessment was administered
    if (request.message.toLowerCase().includes('assess') || request.message.toLowerCase().includes('measure')) {
      tools.push('wellbeing-assess');
    }

    return tools;
  }

  /**
   * Calculate confidence in response
   */
  private calculateConfidence(request: AgentRequest, response: AgentResponse): number {
    // Base confidence
    let confidence = 0.8;

    // Adjust based on message clarity
    if (request.message.length < 20) {
      confidence -= 0.1;
    }

    // Adjust based on conversation history
    if (request.conversationHistory && request.conversationHistory.length > 0) {
      confidence += 0.1;
    }

    return Math.max(0, Math.min(1, confidence));
  }

  /**
   * Get evidence grade for skill
   */
  private getEvidenceGrade(skill: string): string {
    const grades: Record<string, string> = {
      'journaling-advisor': 'A (Strong Evidence)',
      'mindfulness-guide': 'A (Strong Evidence)',
      'values-coach': 'A (Strong Evidence)',
      'wellbeing-educator': 'A (Strong Evidence)',
      'defusion-helper': 'A (Strong Evidence)',
    };

    return grades[skill] || 'B (Moderate Evidence)';
  }

  /**
   * Get effect size for skill
   */
  private getEffectSize(skill: string): string {
    const effects: Record<string, string> = {
      'journaling-advisor': 'd=0.82 for depression, d=0.90 for anxiety',
      'mindfulness-guide': 'g=0.53 for distress, d=0.65 for stress',
      'values-coach': 'g=0.54 for psychological flexibility',
      'wellbeing-educator': 'd=0.68-1.06 for gratitude, r=0.29 overall',
      'defusion-helper': 'd=0.58-1.15 for thought discomfort',
    };

    return effects[skill] || 'Moderate effects';
  }

  /**
   * Check if assessment is recommended
   */
  private checkAssessmentNeed(request: AgentRequest, skill: string): AssessmentPrompt | undefined {
    // Check if user has mentioned symptoms
    const symptomKeywords = ['depressed', 'anxious', 'stressed', 'overwhelmed', 'worried'];
    const hasSymptoms = symptomKeywords.some((keyword) =>
      request.message.toLowerCase().includes(keyword)
    );

    if (hasSymptoms && (!request.userContext?.assessmentHistory || request.userContext.assessmentHistory.length === 0)) {
      return {
        assessmentId: 'phq-9',
        reason: 'Baseline assessment recommended for tracking progress',
        urgency: 'recommended',
      };
    }

    return undefined;
  }

  /**
   * Generate crisis response
   */
  private generateCrisisResponse(crisisAlert: CrisisAlert): AgentResponse {
    return {
      message: this.getCrisisMessage(crisisAlert),
      metadata: {
        tools: ['crisis-detection'],
        confidence: 1.0,
        processingTime: 0,
      },
      crisisAlert,
    };
  }

  /**
   * Get crisis message based on severity
   */
  private getCrisisMessage(crisisAlert: CrisisAlert): string {
    if (crisisAlert.severity === 'severe') {
      return `**CRISIS SUPPORT IMMEDIATELY AVAILABLE**

I'm concerned about your safety. Please reach out for support right away:

**Immediate Resources:**
- **988 Suicide & Crisis Lifeline:** Dial or text 988 (available 24/7, free, confidential)
- **Crisis Text Line:** Text HOME to 741741 (available 24/7)
- **Emergency Services:** Dial 911 or go to nearest emergency room

**You are not alone.** Help is available 24/7, and people want to support you through this.

${crisisAlert.message}

Please reach out to one of these resources now. Your life matters.`;
    } else if (crisisAlert.severity === 'moderate') {
      return `**Support Available**

I hear that you're going through a difficult time. Support is available:

**Resources:**
- **988 Suicide & Crisis Lifeline:** Dial or text 988 (available 24/7, free, confidential)
- **Crisis Text Line:** Text HOME to 741741
- **International:** https://findahelpline.com/

${crisisAlert.message}

Would you like to talk more about what you're experiencing? I'm here to listen.`;
    } else {
      return `**I'm Here to Listen**

${crisisAlert.message}

I'm here to listen and support you. Would you like to talk more about what's going on?`;
    }
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export { AgentOrchestrator };
export type {
  AgentRequest,
  AgentResponse,
  ConversationMessage,
  UserContext,
  AssessmentRecord,
  ResponseMetadata,
  Citation,
  CrisisAlert,
  AssessmentPrompt,
};
