---
name: mental-wellness-self-reflection-advisor
description: A comprehensive psychoeducational wellness skill that helps users reflect on their emotional wellbeing and build mindfulness/stress-management skills using validated frameworks (CBT, ACT, MBSR, PERMA). Always includes disclaimer. Triggers on wellness queries, journaling prompts, mindfulness exercises, values exploration, crisis situations, stress management requests, emotional support needs, and mental health education requests.
version: 1.0.0
compatibility: Requires TypeScript 5.0+, Node.js 18+
---

# Mental Wellness & Mindfulness Self-Reflection Advisor

**A psychoeducational wellness skill** that helps users reflect on their emotional wellbeing and build mindfulness/stress-management skills using validated psychoeducational frameworks. This skill never diagnoses mental health conditions and consistently encourages consultation with licensed professionals.

> **Important:** This skill provides general, educational/analytical information only. It is not a substitute for advice from a qualified mental health professional. Always consult with a licensed therapist, counselor, or psychiatrist before making decisions based on this information.

## Core Capabilities

This skill provides six primary capabilities, each grounded in validated psychological frameworks:

| Capability | Framework | Purpose |
|------------|-----------|---------|
| **Reflective Journaling** | CBT/ACT | Guide structured self-reflection on thoughts, emotions, and situations |
| **Mindfulness Exercises** | MBSR | Provide guided meditation and stress-reduction techniques |
| **Values Clarification** | ACT | Help users identify what truly matters to them |
| **Wellbeing Education** | PERMA | Teach evidence-based wellbeing principles |
| **Cognitive Defusion** | ACT | Help users relate differently to difficult thoughts |
| **Crisis Detection** | Safety | Identify crisis indicators and provide immediate resources |

## When to Use

This skill triggers when users request help with:

- **Self-reflection & journaling:** "Help me reflect on my day", "I want to journal about my feelings"
- **Mindfulness & stress:** "Guide me through a breathing exercise", "I need to relax"
- **Values & meaning:** "What are my values?", "Help me find what matters"
- **Emotional support:** "I'm feeling overwhelmed", "Help me understand my emotions"
- **Wellbeing improvement:** "How can I be happier?", "I want to improve my wellbeing"
- **Crisis situations:** Any mention of self-harm, suicide, or crisis (triggers immediate response)

## Skill Registry System

This skill uses a **declarative skill registry** pattern where each capability is registered with:

### Registration Schema

```typescript
interface SkillRegistration {
  // Identity
  id: string;              // Unique identifier
  name: string;            // Human-readable name
  description: string;     // When to trigger

  // Schema-based validation
  input_schema: JSONSchema;      // Validates user input
  output_schema: JSONSchema;     // Validates skill output

  // Triggering
  trigger_phrases: string[];      // Phrases that trigger this skill
  trigger_contexts: string[];     // Contextual triggers

  // Safety
  safety_predicates: SafetyPredicate[];  // Pre-execution checks
  crisis_keywords: string[];            // Crisis detection keywords
  requires_disclaimer: boolean;          // Must include disclaimer

  // Execution
  handler: SkillHandler;        // Execution logic
  fallback_response?: string;   // Fallback if execution fails

  // Metadata
  frameworks: string[];         // Frameworks used (CBT, ACT, etc.)
  version: string;
  dependencies?: string[];     // Other skills this depends on
}
```

### Registered Skills

#### 1. Journaling Advisor Skill

**ID:** `journaling-advisor`
**Frameworks:** CBT, ACT

**Triggers:**
- "help me journal", "reflect on", "write about my feelings"
- "process my thoughts", "make sense of my day"
- "journaling prompt", "self-reflection help"

**Input Schema:**
```json
{
  "type": "object",
  "properties": {
    "situation": {"type": "string"},
    "emotions": {"type": "array", "items": {"type": "string"}},
    "thoughts": {"type": "string"},
    "framework": {"type": "string", "enum": ["cbt", "act", "general"]}
  },
  "required": ["situation"]
}
```

**Output Schema:**
```json
{
  "type": "object",
  "properties": {
    "prompts": {"type": "array", "items": {"type": "string"}},
    "framework_guidance": {"type": "string"},
    "suggested_structure": {"type": "string"}
  }
}
```

**Safety:**
- Diagnostic language filter active
- Requires disclaimer

#### 2. Mindfulness Guide Skill

**ID:** `mindfulness-guide`
**Frameworks:** MBSR

**Triggers:**
- "breathing exercise", "meditation", "mindfulness"
- "help me relax", "calm down", "reduce stress"
- "grounding exercise", "body scan"

**Input Schema:**
```json
{
  "type": "object",
  "properties": {
    "exercise_type": {
      "type": "string",
      "enum": ["breathing", "body-scan", "grounding", "loving-kindness"]
    },
    "duration_minutes": {"type": "number"},
    "experience_level": {
      "type": "string",
      "enum": ["beginner", "intermediate", "advanced"]
    }
  },
  "required": ["exercise_type"]
}
```

**Output Schema:**
```json
{
  "type": "object",
  "properties": {
    "exercise_script": {"type": "string"},
    "duration_minutes": {"type": "number"},
    "instructions": {"type": "string"},
    "post_reflection_prompts": {"type": "array", "items": {"type": "string"}}}
  }
}
```

**Safety:**
- Requires disclaimer
- Crisis monitoring active

#### 3. Values Coach Skill

**ID:** `values-coach`
**Frameworks:** ACT

**Triggers:**
- "what are my values", "find what matters"
- "values clarification", "what's important to me"
- "life priorities", "meaning and purpose"

**Input Schema:**
```json
{
  "type": "object",
  "properties": {
    "domain": {
      "type": "string",
      "enum": ["relationships", "work", "health", "personal-growth", "community", "leisure", "all"]
    },
    "current_focus": {"type": "string"}
  },
  "required": ["domain"]
}
```

**Output Schema:**
```json
{
  "type": "object",
  "properties": {
    "identified_values": {"type": "array", "items": {"type": "string"}},
    "exploration_questions": {"type": "array", "items": {"type": "string"}},
    "next_steps": {"type": "array", "items": {"type": "string"}}
  }
}
```

**Safety:**
- Requires disclaimer
- Non-diagnostic framing

#### 4. Wellbeing Educator Skill

**ID:** `wellbeing-educator`
**Frameworks:** PERMA, Positive Psychology

**Triggers:**
- "improve my wellbeing", "how to be happier"
- "wellbeing tips", "positive psychology"
- "life satisfaction", "flourishing"

**Input Schema:**
```json
{
  "type": "object",
  "properties": {
    "domain_focus": {
      "type": "string",
      "enum": ["all", "positive-emotion", "engagement", "relationships", "meaning", "accomplishment"]
    },
    "time_frame": {
      "type": "string",
      "enum": ["today", "this-week", "this-month"]
    }
  },
  "required": ["domain_focus"]
}
```

**Output Schema:**
```json
{
  "type": "object",
  "properties": {
    "domain_scores": {"type": "object"},
    "overall_wellbeing": {"type": "string"},
    "recommendations": {"type": "array", "items": {"type": "string"}}}
  }
}
```

**Safety:**
- Requires disclaimer
- Non-diagnostic language

#### 5. Defusion Helper Skill

**ID:** `defusion-helper`
**Frameworks:** ACT

**Triggers:**
- "difficult thought", "stuck in my head"
- "obsessive thinking", "can't stop thinking about"
- "defusion technique", "help with this thought"

**Input Schema:**
```json
{
  "type": "object",
  "properties": {
    "thought": {"type": "string"},
    "technique": {
      "type": "string",
      "enum": ["labeling", "silly-voice", "leaves-on-stream", "observer", "generic"]
    }
  },
  "required": ["thought"]
}
```

**Output Schema:**
```json
{
  "type": "object",
  "properties": {
    "technique_name": {"type": "string"},
    "instructions": {"type": "string"},
    "example_application": {"type": "string"},
    "expected_benefit": {"type": "string"}
  }
}
```

**Safety:**
- Requires disclaimer
- Crisis monitoring active

#### 6. Safety Router Skill

**ID:** `safety-router`
**Frameworks:** Safety

**Triggers:**
- Crisis keywords detected in any input
- Explicit crisis/self-harm language

**Input Schema:**
```json
{
  "type": "object",
  "properties": {
    "text": {"type": "string"},
    "sensitivity": {
      "type": "string",
      "enum": ["strict", "moderate", "permissive"]
    }
  },
  "required": ["text"]
}
```

**Output Schema:**
```json
{
  "type": "object",
  "properties": {
    "crisis_detected": {"type": "boolean"},
    "detected_keywords": {"type": "array", "items": {"type": "string"}}},
    "severity": {"type": "string", "enum": ["none", "mild", "moderate", "severe"]},
    "recommended_action": {"type": "string"}
  }
}
```

**Safety:**
- Highest priority execution
- Bypasses normal flow
- Immediate crisis response

## Skill Resolution Process

1. **Input Analysis:** User input is analyzed against all skill trigger phrases
2. **Context Matching:** Input context (conversation history, emotional tone) is considered
3. **Conflict Resolution:** If multiple skills match, specificity and priority determine selection
4. **Safety Check:** All skills are checked for safety predicates before execution
5. **Execution:** Selected skill executes with validated input
6. **Response Validation:** Output is validated against schema and checked for disclaimers

## Execution Flow

```
User Input
    ↓
Crisis Detection (Safety Router)
    ↓ (if safe)
Skill Resolution (Match triggers)
    ↓
Safety Predicate Checks
    ↓
Skill Execution
    ↓
Output Validation
    ↓
Disclaimer Injection
    ↓
User Response
```

## Tool System Integration

Skills use a **tool registry** for common operations:

| Tool ID | Purpose | Used By |
|---------|---------|---------|
| `crisis_detection` | Crisis keyword detection | All skills |
| `journaling_prompt` | Generate prompts | Journaling Advisor |
| `mindfulness_exercise` | Exercise scripts | Mindfulness Guide |
| `values_explore` | Values exploration | Values Coach |
| `wellbeing_assess` | PERMA assessment | Wellbeing Educator |
| `defusion_technique` | Defusion methods | Defusion Helper |

Tools are invoked via `executeTool(toolId, input)` with automatic schema validation.

## Framework Application

This skill operationalizes research frameworks into concrete techniques:

### CBT (Cognitive Behavioral Therapy)
- **Thought Records:** Structure for identifying and restructuring thoughts
- **Evidence Testing:** Examining evidence for and against thoughts
- **Alternative Perspectives:** Generating balanced viewpoints

### ACT (Acceptance and Commitment Therapy)
- **Values Work:** Identifying what truly matters
- **Defusion:** Relating differently to thoughts
- **Committed Action:** Taking action aligned with values

### MBSR (Mindfulness-Based Stress Reduction)
- **Body Scan:** Systematic body awareness
- **Sitting Meditation:** Breath and sensation awareness
- **Mindful Movement:** Gentle movement with awareness

### PERMA (Positive Psychology)
- **Positive Emotion:** savoring, gratitude, optimism
- **Engagement:** flow, strengths use
- **Relationships:** connection, support
- **Meaning:** purpose, contribution
- **Accomplishment:** goals, mastery

## Guardrails & Safety

### Non-Diagnostic Language
All responses explicitly state they are NOT diagnoses:
- Never say "you have X"
- Use phrases like "some people experience", "common patterns include"
- Always recommend professional consultation for clinical concerns

### Crisis Detection
Three-tier crisis response:
- **Severe:** Immediate crisis resources (suicide, self-harm keywords)
- **Moderate:** Professional referral recommendation
- **Mild:** Self-care with professional option

### Disclaimer Requirement
All outputs include:
```
**Disclaimer:** This response provides general, educational/analytical information only.
It is not a substitute for advice from a qualified mental health professional.
```

## Error Handling & Fallbacks

### Error Hierarchy
1. **Schema Validation Errors:** Return specific validation feedback
2. **LLM Execution Errors:** Use cached safe responses
3. **Unknown Errors:** Generic fallback with crisis resources

### Fallback Response Template
```markdown
**Apologies — I'm experiencing technical difficulties**

I'm unable to process your request right now.

If you need immediate support, please use the crisis resources listed above.
For general support, please try again in a few moments.

**Disclaimer:** This service provides general educational information only.
```

## Reference Materials

The skill references operational framework principles from:

- `references/frameworks/cbt.md` — CBT techniques and applications
- `references/frameworks/act.md` — ACT principles and exercises
- `references/frameworks/mbsr.md` — MBSR practices and scripts
- `references/frameworks/perma.md` — PERMA wellbeing model
- `references/safety/crisis-keywords.md` — Crisis detection patterns
- `references/safety/nondiagnostic-guide.md` — Language guardrails
- `references/prompts/` — Prompt templates by capability

## Evaluation & Testing

Test cases in `evals/evals.json` validate:

- Crisis detection accuracy
- Framework application correctness
- Disclaimer presence
- Non-diagnostic language compliance
- Schema validation
- Error handling

## Configuration

Environment variables (see `config/config.ts`):

```bash
# Required
MODEL_PROVIDER=anthropic
MODEL_ID=claude-opus-4-7
API_KEY=<from-secret-manager>

# Safety Configuration
SAFETY_CRISIS_SENSITIVITY=strict
SAFETY_DIAGNOSTIC_FILTERING=true

# Feature Flags
ENABLE_ANALYTICS=false
ENABLE_CACHING=true
ENABLE_FALLBACK_RESPONSES=true
```

## Version History

- **1.0.0** (2025-01-04): Initial production-ready release
  - Complete skill registry with 6 skills
  - Full tool system with schema validation
  - Comprehensive safety framework
  - Crisis detection and response
  - Hook system for lifecycle management

---

**For technical details, see:**
- `docs/ARCHITECTURE.md` — Complete system architecture
- `docs/DIRECTORY-STRUCTURE.md` — Directory organization
- `config/` — Type-safe configuration management

**For development tasks, see:**
- `DEVELOPMENT-TASK-BY-PHASES.md` — Phased build plan
- `PROJECT-DEVELOPMENT-PHASE-TRACKING.md` — Progress tracking
