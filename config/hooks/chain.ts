/**
 * Hook Chain — Mental Wellness Self-Reflection Advisor
 *
 * Defines the complete hook chain with ordering, priorities, and execution logic.
 * Hooks provide lifecycle management, state synchronization, event emission,
 * and cross-cutting concerns like logging and metrics.
 */

import type {
  Hook,
  HookContext,
  HookResult,
  HookPhase,
  AgentState,
  Logger,
  Config,
} from '../schemas';

// ============================================================================
// HOOK IMPLEMENTATIONS
// ============================================================================

/**
 * Before Request Hook
 *
 * Executes at the start of request processing. Handles input validation,
 * logging, state synchronization, and crisis detection.
 */
class BeforeRequestHook implements Hook {
  name = 'before_request';
  phase: HookPhase = 'before_request';
  priority = 10;  // Execute first

  async execute(context: HookContext): Promise<void> {
    const { input, agent_state, logger } = context;

    // Log incoming request
    logger.info('Request received', {
      session_id: context.session_id,
      input_type: typeof input,
    });

    // Update agent state
    agent_state.updated_at = new Date().toISOString();
    agent_state.conversation.turn_count += 1;

    // Add to conversation history
    agent_state.conversation.history.push({
      timestamp: new Date().toISOString(),
      user_input: typeof input === 'string' ? input : JSON.stringify(input),
      skill_used: null,
      response_summary: '',
      crisis_detected: false,
    });
  }
}

/**
 * Crisis Detection Hook
 *
 * Scans input for crisis keywords and triggers immediate crisis response if detected.
 */
class CrisisDetectionHook implements Hook {
  name = 'crisis_detection';
  phase: HookPhase = 'before_request';
  priority = 20;  // Execute after basic logging

  crisis_keywords: string[];
  config: Config;

  constructor(config: Config) {
    this.config = config;
    this.crisis_keywords = config.safety.referral_triggers;
  }

  async execute(context: HookContext): Promise<HookResult> {
    const { input, agent_state, logger } = context;
    const input_text = typeof input === 'string' ? input.toLowerCase() : JSON.stringify(input).toLowerCase();

    // Check for crisis keywords
    const detected_keyword = this.crisis_keywords.find(keyword =>
      input_text.includes(keyword.toLowerCase())
    );

    if (detected_keyword) {
      logger.warn('Crisis keyword detected', {
        session_id: context.session_id,
        keyword: detected_keyword,
      });

      // Update agent state
      agent_state.user_context.risk_level = 'crisis';
      agent_state.conversation.detected_crisis = true;
      agent_state.metrics.crisis_flags += 1;

      // Return immediate crisis response
      return {
        continue: false,
        response: this.getCrisisResponse(),
      };
    }

    return { continue: true };
  }

  private getCrisisResponse(): string {
    return `
**Immediate Support Resources**

If you're experiencing a mental health crisis or having thoughts of self-harm,
please reach out for help right away:

**United States:**
- National Suicide Prevention Lifeline: 988
- Crisis Text Line: Text HOME to 741741
- 911 (Emergency)

**International:**
- Find a helpline near you: https://findahelpline.com/

**You are not alone.** Help is available 24/7, and people care about you.
Please reach out to one of these resources or contact a trusted adult,
friend, or family member.

This service is not equipped to handle crisis situations. For immediate support,
please use the resources listed above or go to your nearest emergency room.
    `.trim();
  }
}

/**
 * Diagnostic Language Filter Hook
 *
 * Filters input for diagnostic language and prevents diagnostic responses.
 */
class DiagnosticFilterHook implements Hook {
  name = 'diagnostic_filter';
  phase: HookPhase = 'before_request';
  priority = 30;  // Execute after crisis detection

  diagnostic_keywords: string[];
  config: Config;

  constructor(config: Config) {
    this.config = config;
    this.diagnostic_keywords = config.safety.diagnostic_keywords;
  }

  async execute(context: HookContext): Promise<HookResult> {
    if (!this.config.safety.diagnostic_filtering) {
      return { continue: true };
    }

    const { input, agent_state, logger } = context;
    const input_text = typeof input === 'string' ? input.toLowerCase() : JSON.stringify(input).toLowerCase();

    // Check for diagnostic keywords
    const detected_keyword = this.diagnostic_keywords.find(keyword =>
      input_text.includes(keyword.toLowerCase())
    );

    if (detected_keyword) {
      logger.info('Diagnostic language detected', {
        session_id: context.session_id,
        keyword: detected_keyword,
      });

      // Update agent state
      agent_state.conversation.detected_diagnostic_intent = true;
    }

    return { continue: true };
  }
}

/**
 * After Routing Hook
 *
 * Executes after skill resolution. Audits skill selection and resolves conflicts.
 */
class AfterRoutingHook implements Hook {
  name = 'after_routing';
  phase: HookPhase = 'after_routing';
  priority = 10;

  async execute(context: HookContext): Promise<void> {
    const { metadata, logger } = context;

    logger.info('Skills resolved', {
      session_id: context.session_id,
      selected_skills: metadata.selected_skills,
      resolution_time_ms: metadata.resolution_time_ms,
    });
  }
}

/**
 * Before Execution Hook
 *
 * Executes before skill/tool execution. Prepares context, loads references.
 */
class BeforeExecutionHook implements Hook {
  name = 'before_execution';
  phase: HookPhase = 'before_execution';
  priority = 10;

  async execute(context: HookContext): Promise<void> {
    const { metadata, logger } = context;

    logger.debug('Preparing execution', {
      session_id: context.session_id,
      skill_to_execute: metadata.skill_id,
      tool_calls: metadata.tool_calls,
    });
  }
}

/**
 * After Execution Hook
 *
 * Executes after skill/tool execution. Validates output, updates metrics.
 */
class AfterExecutionHook implements Hook {
  name = 'after_execution';
  phase: HookPhase = 'after_execution';
  priority = 10;

  async execute(context: HookContext): Promise<void> {
    const { output, metadata, agent_state, logger } = context;

    // Update metrics
    agent_state.metrics.tokens_used += metadata.tokens_used || 0;
    agent_state.metrics.execution_time_ms += metadata.execution_time_ms || 0;

    logger.info('Execution completed', {
      session_id: context.session_id,
      execution_time_ms: metadata.execution_time_ms,
      tokens_used: metadata.tokens_used,
    });

    // Validate output contains disclaimer if required
    if (metadata.requires_disclaimer && typeof output === 'string') {
      const hasDisclaimer = output.toLowerCase().includes('disclaimer');
      if (!hasDisclaimer) {
        logger.warn('Missing required disclaimer', {
          session_id: context.session_id,
        });
      }
    }
  }
}

/**
 * On Error Hook
 *
 * Executes when an error occurs. Provides fallback responses and logs errors.
 */
class OnErrorHook implements Hook {
  name = 'on_error';
  phase: HookPhase = 'on_error';
  priority = 10;

  fallback_response: string;

  constructor() {
    this.fallback_response = `
**Apologies — I'm experiencing technical difficulties**

I'm unable to process your request right now. If you need immediate support:

- For crisis situations, please use the crisis resources listed above
- For general support, please try again in a few moments

For ongoing support, consider reaching out to a qualified mental health professional.

**Disclaimer:** This service provides general educational information only and is
not a substitute for professional advice.
    `.trim();
  }

  async execute(context: HookContext): Promise<HookResult> {
    const { error, logger } = context;

    logger.error('Execution error', error, {
      session_id: context.session_id,
    });

    // Return fallback response
    return {
      continue: false,
      response: this.fallback_response,
    };
  }
}

/**
 * On Crisis Detected Hook
 *
 * Executes when crisis is detected at any point. Ensures crisis response is provided.
 */
class OnCrisisDetectedHook implements Hook {
  name = 'on_crisis_detected';
  phase: HookPhase = 'on_crisis_detected';
  priority = 10;

  async execute(context: HookContext): Promise<HookResult> {
    const { logger } = context;

    logger.warn('Crisis detected during processing', {
      session_id: context.session_id,
    });

    // Crisis response is already provided by CrisisDetectionHook
    // This hook exists for audit purposes and potential escalation
    return { continue: false };
  }
}

// ============================================================================
// HOOK CHAIN DEFINITION
// ============================================================================

/**
 * Hook chain configuration
 * Defines all hooks with their ordering and execution priorities
 */
export interface HookChainConfig {
  hooks: Hook[];
  config: Config;
}

/**
 * Create hook chain with all standard hooks
 */
export function createHookChain(config: Config): Hook[] {
  return [
    new BeforeRequestHook(),
    new CrisisDetectionHook(config),
    new DiagnosticFilterHook(config),
    new AfterRoutingHook(),
    new BeforeExecutionHook(),
    new AfterExecutionHook(),
    new OnErrorHook(),
    new OnCrisisDetectedHook(),
  ];
}

/**
 * Hook chain executor
 * Executes hooks in priority order for a given phase
 */
export class HookChainExecutor {
  private hooks: Map<HookPhase, Hook[]> = new Map();

  constructor(hooks: Hook[]) {
    // Group hooks by phase
    for (const hook of hooks) {
      const phaseHooks = this.hooks.get(hook.phase) || [];
      phaseHooks.push(hook);
      this.hooks.set(hook.phase, phaseHooks);
    }

    // Sort each phase by priority (lower = earlier)
    for (const [phase, hooks] of this.hooks.entries()) {
      hooks.sort((a, b) => a.priority - b.priority);
      this.hooks.set(phase, hooks);
    }
  }

  /**
   * Execute all hooks for a given phase
   */
  async executePhase(phase: HookPhase, context: HookContext): Promise<HookResult | null> {
    const hooks = this.hooks.get(phase) || [];

    for (const hook of hooks) {
      try {
        const result = await hook.execute(context);

        // If hook returns a result with continue: false, stop execution
        if (result && !result.continue) {
          return result;
        }
      } catch (error) {
        console.error(`Hook ${hook.name} failed:`, error);
        // Continue to next hook on failure
      }
    }

    return null;  // All hooks passed
  }

  /**
   * Get all registered hooks
   */
  getHooks(): Map<HookPhase, Hook[]> {
    return this.hooks;
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  BeforeRequestHook,
  CrisisDetectionHook,
  DiagnosticFilterHook,
  AfterRoutingHook,
  BeforeExecutionHook,
  AfterExecutionHook,
  OnErrorHook,
  OnCrisisDetectedHook,
};

export type { HookChainConfig };
