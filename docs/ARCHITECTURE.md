# Architecture — Mental Wellness & Mindfulness Self-Reflection Advisor

## 1. System Overview

This skill implements a **modular, safety-first psychoeducation system** built on validated frameworks (CBT, ACT, MBSR, PERMA) with chain-of-thought routing, specialized sub-agents, and a declarative skill-registry pattern.

## 2. Architectural Principles

1. **Safety-First Design**: All outputs are bounded by non-diagnostic guardrails and crisis-resource surfacing
2. **Modular Composability**: Each capability is an independent, testable unit
3. **Declarative Registration**: Skills are registered with explicit schemas, not imperative code
4. **Graceful Degradation**: LLM failures fall back to deterministic safety responses
5. **Auditability**: All reasoning is traceable to specific framework components

## 3. Component Architecture

### 3.1 Core Components

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Agent Orchestrator                            │
│  (Route → Select Skills → Execute → Validate → Respond)             │
└───────────────────────────┬─────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
┌───────▼────────┐  ┌──────▼──────┐  ┌────────▼────────┐
│ Skill Registry │  │  Hook Chain │  │  Tool Executor  │
│  (Declarative) │  │ (Lifecycle) │  │  (Schema'd)     │
└────────────────┘  └─────────────┘  └─────────────────┘
        │                   │                   │
        └───────────────────┼───────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
┌───────▼────────┐  ┌──────▼──────┐  ┌────────▼────────┐
│ Sub-Agents     │  │  Reference  │  │   Config Layer   │
│ (Specialized)  │  │   Store     │  │  (Type-Safe)     │
└────────────────┘  └─────────────┘  └─────────────────┘
```

### 3.2 Sub-Agent Specialization

Each sub-agent has a **single responsibility** with **bounded scope**:

| Sub-Agent | Responsibility | Boundaries |
|-----------|----------------|------------|
| `safety-router` | Crisis detection & resource surfacing | Never diagnoses, always flags crisis |
| `journaling-advisor` | CBT/ACT reflective prompts | Non-diagnostic framing only |
| `mindfulness-guide` | MBSR-informed practices | Technique instruction, not treatment |
| `values-coach` | ACT values clarification | Exploration, not prescription |
| `wellbeing-educator` | PERMA psychoeducation | General concepts, not assessment |
| `defusion-helper` | Cognitive defusion techniques | Skill-building, not clinical intervention |

### 3.3 Skill Registry Pattern

Skills are registered declaratively with **input/output schemas**, **trigger conditions**, and **safety predicates**:

```typescript
interface SkillRegistration {
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
  handler: SkillHandler;
  fallback_response?: string;
  
  // Metadata
  frameworks: string[];  // e.g., ["CBT", "ACT"]
  version: string;
}
```

## 4. Data Flow Patterns

### 4.1 Request Processing Pipeline

```
User Input
    │
    ▼
┌─────────────────┐
│ Safety Router   │  ← Crisis keywords? → Immediate crisis resources
│ (Triage)        │  ← Diagnostic language? → Rejection + disclaimer
└────────┬────────┘
         │ Is safe?
         ▼
┌─────────────────┐
│ Skill Resolver  │  ← Match input to registered skills
│ (Declarative)   │  ← Resolve conflicts by specificity
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Hook Chain       │  ← before_exec (state sync, logging)
│ (Lifecycle)      │  ← execute (tool invocation)
└────────┬────────┘  ← after_exec (validation, metrics)
         │
         ▼
┌─────────────────┐
│ Tool Executor    │  ← Schema validation
│ (Schema'd)       │  ← Deterministic handlers
└────────┬────────┘  ← Error handling with fallback
         │
         ▼
┌─────────────────┐
│ Response Builder│  ← Apply disclaimers
│ (Safe Output)    │  ← Format to schema
└────────┬────────┘
         │
         ▼
User Response (always includes disclaimer)
```

### 4.2 Error Handling & Fallbacks

```typescript
interface SafeExecution<T> {
  execute(): Promise<Result<T, FallbackResponse>>;
  
  // Fallback hierarchy:
  // 1. Cached safe response
  // 2. Deterministic template
  // 3. Generic safety message with crisis resources
  // 4. Error + referral to professional
}
```

## 5. Hooks System

### 5.1 Hook Types

| Hook | Purpose | Context |
|------|---------|---------|
| `before_request` | Input validation, logging, state sync | Raw input |
| `after_routing` | Skill selection audit, conflict resolution | Selected skills |
| `before_execution` | Tool preparation, context loading | Pre-execution |
| `after_execution` | Output validation, metrics, error handling | Post-execution |
| `on_error` | Fallback response, crisis flagging | Error state |
| `on_crisis_detected` | Immediate crisis resource surfacing | Crisis state |

### 5.2 Hook Interface

```typescript
interface Hook {
  name: string;
  priority: number;  // Lower = earlier
  execute(context: HookContext): Promise<HookResult | void>;
}

interface HookContext {
  phase: 'before_request' | 'after_routing' | 'before_execution' | 'after_execution' | 'on_error' | 'on_crisis_detected';
  input: any;
  output?: any;
  error?: Error;
  metadata: Record<string, any>;
}
```

## 6. Tools System

### 6.1 Tool Schema

All tools are **schema-validated** on input and output:

```typescript
interface ToolDefinition {
  id: string;
  name: string;
  description: string;
  
  input_schema: JSONSchema;
  output_schema: JSONSchema;
  
  handler: ToolHandler;
  
  // Safety
  requires_professional_referral?: boolean;
  crisis_keywords?: string[];
  
  // Execution
  timeout_ms: number;
  max_retries: number;
}
```

### 6.2 Tool Categories

| Category | Tools | Purpose |
|----------|-------|---------|
| **Safety** | `detect_crisis`, `validate_nondiagnostic` | Input validation |
| **CBT** | `thought_record`, `cognitive_restructure` | Journaling support |
| **ACT** | `values_explore`, `defusion_technique` | Values/defusion |
| **MBSR** | `breathing_exercise`, `body_scan` | Mindfulness |
| **PERMA** | `wellbeing_assess`, `strengths_identify` | Wellbeing education |

## 7. Configuration Layer

### 7.1 Type-Safe Configuration

```typescript
interface Config {
  // LLM parameters
  model: {
    provider: 'anthropic' | 'openai' | 'local';
    model_id: string;
    temperature: number;
    max_tokens: number;
  };
  
  // Safety thresholds
  safety: {
    crisis_detection_sensitivity: 'strict' | 'moderate' | 'permissive';
    diagnostic_filtering: boolean;
    required_disclaimer: boolean;
  };
  
  // Feature flags
  features: {
    enable_analytics: boolean;
    enable_caching: boolean;
    enable_fallback_responses: boolean;
  };
  
  // Resource paths
  paths: {
    references: string;
    scripts: string;
    assets: string;
  };
}
```

### 7.2 Environment Variables

```bash
# Required
MODEL_PROVIDER=anthropic
MODEL_ID=claude-opus-4-7
API_KEY=<from-secret-manager>

# Optional (with defaults)
SAFETY_CRISIS_SENSITIVITY=strict
ENABLE_ANALYTICS=false
ENABLE_CACHING=true
TIMEOUT_MS=30000
```

## 8. Reference Store Structure

```
references/
├── frameworks/
│   ├── cbt.md                 # CBT operational principles
│   ├── act.md                 # ACT operational principles
│   ├── mbsr.md                # MBSR operational principles
│   └── perma.md               # PERMA operational principles
├── safety/
│   ├── crisis-keywords.md     # Crisis detection patterns
│   ├── nondiagnostic-guide.md  # Language guardrails
│   └── disclaimers.md         # Required disclaimer templates
├── prompts/
│   ├── journaling.md          # Reflective journaling prompts
│   ├── mindfulness.md         # Guided mindfulness scripts
│   ├── values.md              # Values-clarification templates
│   └── defusion.md            # Cognitive defusion techniques
└── assessments/
    ├── wellbeing-check.md     # PERMA wellbeing checklist
    └── values-card-sort.md    # Values exercise template
```

## 9. Script Directory

```
scripts/
├── setup/
│   ├── seed-references.ts    # Initial reference data seeding
│   └── validate-config.ts     # Configuration validation
├── maintenance/
│   ├── refresh-cache.ts      # LLM response cache refresh
│   └── audit-safety.ts       # Safety compliance audit
└── utils/
    ├── schema-validator.ts    # JSON schema validation utility
    └── crisis-detector.ts     # Crisis keyword detection
```

## 10. Assets Directory

```
assets/
├── templates/
│   ├── disclaimer.md         # Standard disclaimer template
│   ├── crisis-response.md     # Immediate crisis response template
│   └── fallback-response.md  # Generic fallback response
├── schemas/
│   ├── input-schemas.json    # All tool input schemas
│   └── output-schemas.json   # All tool output schemas
└── resources/
    ├── crisis-hotlines.md    # Global crisis resources
    └── professional-referral.md # Referral guidance
```

## 11. State Management

### 11.1 State Schema

```typescript
interface AgentState {
  session_id: string;
  user_context: {
    locale: string;
    timezone: string;
    risk_level: 'none' | 'elevated' | 'crisis';
  };
  conversation: {
    turn_count: number;
    last_skill_used: string | null;
    detected_crisis: boolean;
  };
  metrics: {
    tokens_used: number;
    execution_time_ms: number;
    error_count: number;
  };
}
```

### 11.2 State Synchronization

State is synchronized **before each hook execution** via the `before_request` hook and persisted **after each response** via the `after_execution` hook.

## 12. Logging & Observability

### 12.1 Structured Logging

```typescript
interface LogEntry {
  timestamp: ISO8601;
  level: 'debug' | 'info' | 'warn' | 'error';
  phase: string;  // Hook name
  session_id: string;
  
  // Contextual data
  input_summary?: string;
  output_summary?: string;
  error?: Error;
  
  // Metrics
  duration_ms?: number;
  tokens_used?: number;
}
```

### 12.2 Audit Trail

All **safety-critical events** are logged to a separate audit trail:
- Crisis detection events
- Professional referral triggers
- Diagnostic language filter activations
- Fallback response invocations

## 13. Extension Points

### 13.1 Adding a New Skill

1. Define skill registration in `config/skills/`
2. Add handler in `scripts/handlers/`
3. Register in skill registry via `registerSkill()`
4. Add test cases to `evals/skills/`

### 13.2 Adding a New Tool

1. Define tool schema in `assets/schemas/`
2. Implement handler in `scripts/tools/`
3. Register in tool registry via `registerTool()`
4. Add safety predicates if applicable

### 13.3 Adding a New Framework

1. Create `references/frameworks/<framework>.md`
2. Extract operational principles (not just citations)
3. Map principles to concrete skills/tools
4. Add test cases validating framework application

## 14. Security Considerations

1. **Input Validation**: All inputs are validated against JSON schemas before processing
2. **Output Filtering**: All outputs are filtered for diagnostic language
3. **Crisis Detection**: All inputs are scanned for crisis keywords
4. **Disclaimer Injection**: All outputs include required disclaimers
5. **Error Boundaries**: All errors are caught and handled with fallback responses
6. **Audit Logging**: All safety-critical events are logged

## 15. Performance Optimization

1. **Context Window Management**: Reference files are loaded on-demand, not all at once
2. **Caching**: LLM responses for common prompts are cached
3. **Schema Validation**: Fast schema validation before LLM calls
4. **Fallback Responses**: Deterministic responses for common errors
5. **Tool Chaining**: Tools are chained to minimize LLM calls

## 16. Deployment Considerations

### 16.1 Environment Matrix

| Environment | Purpose | Config Overrides |
|--------------|---------|------------------|
| `development` | Local development | Permissive safety, debug logging |
| `testing` | Integration testing | Moderate safety, mock LLM |
| `production` | Live deployment | Strict safety, minimal logging |

### 16.2 Health Checks

```typescript
interface HealthCheck {
  status: 'healthy' | 'degraded' | 'unhealthy';
  checks: {
    config_loaded: boolean;
    references_loaded: boolean;
    llm_connected: boolean;
    safety_systems_active: boolean;
  };
  timestamp: ISO8601;
}
```

## 17. Compliance & Ethics

1. **Non-Diagnostic**: All outputs explicitly state they are not diagnoses
2. **Professional Referral**: All clinical-level symptoms trigger referral
3. **Crisis Resources**: All crisis indicators trigger immediate resource surfacing
4. **Privacy**: No user data is stored beyond session boundaries
5. **Transparency**: All framework applications are explicit, not hidden

## 18. Testing Strategy

### 18.1 Test Categories

| Category | Purpose | Examples |
|----------|---------|----------|
| **Safety** | Crisis detection, diagnostic filtering | "I want to hurt myself" → crisis resources |
| **Framework** | Correct framework application | Values exercise → ACT principles |
| **Schema** | Input/output validation | Malformed input → validation error |
| **Fallback** | Error handling | LLM failure → safe fallback |
| **Integration** | End-to-end flows | Full request → response |

### 18.2 Test Data Management

Test prompts are stored in `evals/evals.json` with assertions. See `skill-creator` methodology for evaluation loop.

## 19. Version Compatibility

| Component | Version | Notes |
|-----------|---------|-------|
| Node.js | >=18.0.0 | ES2020+ features required |
| TypeScript | >=5.0.0 | Strict mode enabled |
| Schema Validation | JSON Schema Draft 2020-12 | |

## 20. Migration Notes

When upgrading from earlier versions:
1. Backup existing `config/` and `references/`
2. Run `scripts/setup/seed-references.ts` to update reference data
3. Re-run `evals/` to validate new skill registrations
4. Update environment variables for new config options

---

**Architecture Version:** 1.0.0
**Last Updated:** 2025-01-04
**Maintainer:** See CLAUDE.md for operating instructions
