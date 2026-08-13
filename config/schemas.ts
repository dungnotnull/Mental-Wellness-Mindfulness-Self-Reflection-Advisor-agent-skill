/**
 * Configuration Schemas — Mental Wellness Self-Reflection Advisor
 *
 * TypeScript type definitions and JSON schemas for configuration validation.
 */

// ============================================================================
// HOOK SYSTEM TYPES
// ============================================================================

/**
 * Hook phase identifiers
 */
export type HookPhase =
  | 'before_request'
  | 'after_routing'
  | 'before_execution'
  | 'after_execution'
  | 'on_error'
  | 'on_crisis_detected';

/**
 * Hook execution context
 */
export interface HookContext {
  phase: HookPhase;
  session_id: string;
  timestamp: string;

  // Input/output
  input: any;
  output?: any;

  // Error state
  error?: Error;

  // Metadata
  metadata: Record<string, any>;

  // Agent state
  agent_state: AgentState;
}

/**
 * Hook execution result
 */
export interface HookResult {
  continue: boolean;  // If false, stops execution chain
  modified_context?: Partial<HookContext>;
  response?: any;  // Direct response (bypasses normal flow)
}

/**
 * Hook definition
 */
export interface Hook {
  name: string;
  phase: HookPhase;
  priority: number;  // Lower = earlier execution
  execute: (context: HookContext) => Promise<HookResult | void>;
}

// ============================================================================
// TOOL SYSTEM TYPES
// ============================================================================

/**
 * JSON Schema type (simplified)
 */
export interface JSONSchema {
  type: string;
  properties?: Record<string, JSONSchema>;
  required?: string[];
  items?: JSONSchema;
  enum?: any[];
  description?: string;
  additionalProperties?: boolean;
}

/**
 * Tool execution result
 */
export interface ToolResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  execution_time_ms?: number;
  tokens_used?: number;
}

/**
 * Tool handler function
 */
export type ToolHandler<TInput = any, TOutput = any> = (
  input: TInput,
  context: ToolExecutionContext
) => Promise<ToolResult<TOutput>>;

/**
 * Tool execution context
 */
export interface ToolExecutionContext {
  session_id: string;
  config: Config;
  agent_state: AgentState;
  logger: Logger;
}

/**
 * Tool definition
 */
export interface ToolDefinition<TInput = any, TOutput = any> {
  id: string;
  name: string;
  description: string;

  // Schema validation
  input_schema: JSONSchema;
  output_schema: JSONSchema;

  // Handler
  handler: ToolHandler<TInput, TOutput>;

  // Safety
  requires_professional_referral?: boolean;
  crisis_keywords?: string[];
  diagnostic_filter?: boolean;

  // Execution
  timeout_ms: number;
  max_retries: number;

  // Metadata
  frameworks?: string[];
  version: string;
}

// ============================================================================
// SKILL SYSTEM TYPES
// ============================================================================

/**
 * Skill safety predicate
 */
export interface SafetyPredicate {
  name: string;
  check: (input: any) => boolean;
  error_message: string;
}

/**
 * Skill handler function
 */
export type SkillHandler<TInput = any, TOutput = any> = (
  input: TInput,
  context: SkillExecutionContext
) => Promise<TOutput>;

/**
 * Skill execution context
 */
export interface SkillExecutionContext {
  session_id: string;
  config: Config;
  agent_state: AgentState;
  logger: Logger;

  // Tool access
  tools: ToolRegistry;

  // Reference access
  references: ReferenceStore;
}

/**
 * Skill registration
 */
export interface SkillRegistration<TInput = any, TOutput = any> {
  id: string;
  name: string;
  description: string;

  // Schema-based validation
  input_schema: JSONSchema;
  output_schema: JSONSchema;

  // Triggering
  trigger_phrases: string[];
  trigger_contexts: string[];

  // Safety
  safety_predicates: SafetyPredicate[];
  crisis_keywords: string[];
  requires_disclaimer: boolean;

  // Execution
  handler: SkillHandler<TInput, TOutput>;
  fallback_response?: string;

  // Metadata
  frameworks: string[];
  version: string;
  dependencies?: string[];  // Other skills this depends on
}

// ============================================================================
// AGENT STATE TYPES
// ============================================================================

/**
 * User risk level
 */
export type RiskLevel = 'none' | 'elevated' | 'crisis';

/**
 * User context within agent state
 */
export interface UserContext {
  locale: string;
  timezone: string;
  risk_level: RiskLevel;
}

/**
 * Conversation state
 */
export interface ConversationState {
  turn_count: number;
  last_skill_used: string | null;
  detected_crisis: boolean;
  detected_diagnostic_intent: boolean;
  history: ConversationTurn[];
}

/**
 * Single conversation turn
 */
export interface ConversationTurn {
  timestamp: string;
  user_input: string;
  skill_used: string | null;
  response_summary: string;
  crisis_detected: boolean;
}

/**
 * Metrics state
 */
export interface MetricsState {
  tokens_used: number;
  execution_time_ms: number;
  error_count: number;
  crisis_flags: number;
}

/**
 * Complete agent state
 */
export interface AgentState {
  session_id: string;
  started_at: string;
  updated_at: string;

  user_context: UserContext;
  conversation: ConversationState;
  metrics: MetricsState;
}

// ============================================================================
// LOGGING TYPES
// ============================================================================

/**
 * Log level
 */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

/**
 * Structured log entry
 */
export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  phase: string;
  session_id: string;

  // Contextual data
  input_summary?: string;
  output_summary?: string;
  error?: Error;

  // Metrics
  duration_ms?: number;
  tokens_used?: number;

  // Additional context
  context?: Record<string, any>;
}

/**
 * Logger interface
 */
export interface Logger {
  debug(message: string, context?: Record<string, any>): void;
  info(message: string, context?: Record<string, any>): void;
  warn(message: string, context?: Record<string, any>): void;
  error(message: string, error?: Error, context?: Record<string, any>): void;
}

// ============================================================================
// REGISTRY TYPES
// ============================================================================

/**
 * Tool registry interface
 */
export interface ToolRegistry {
  register<TInput, TOutput>(tool: ToolDefinition<TInput, TOutput>): void;
  get(id: string): ToolDefinition | undefined;
  execute<TInput, TOutput>(id: string, input: TInput): Promise<ToolResult<TOutput>>;
  list(): ToolDefinition[];
}

/**
 * Skill registry interface
 */
export interface SkillRegistry {
  register<TInput, TOutput>(skill: SkillRegistration<TInput, TOutput>): void;
  get(id: string): SkillRegistration | undefined;
  resolve(input: string): SkillRegistration[];  // Resolve skills from input
  list(): SkillRegistration[];
}

/**
 * Reference store interface
 */
export interface ReferenceStore {
  load(path: string): Promise<string>;
  loadSync(path: string): string;
  list(pattern?: string): string[];
}

// ============================================================================
// CONFIG IMPORTS
// ============================================================================

import type { Config } from './config';

// ============================================================================
// EXPORTS
// ============================================================================

export type {
  HookPhase,
  HookContext,
  HookResult,
  Hook,
  ToolResult,
  ToolHandler,
  ToolExecutionContext,
  ToolDefinition,
  SafetyPredicate,
  SkillHandler,
  SkillExecutionContext,
  SkillRegistration,
  RiskLevel,
  UserContext,
  ConversationState,
  ConversationTurn,
  MetricsState,
  AgentState,
  LogLevel,
  LogEntry,
  Logger,
  ToolRegistry,
  SkillRegistry,
  ReferenceStore,
};
