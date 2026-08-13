# Directory Structure — Mental Wellness Self-Reflection Advisor

## Overview

This document describes the complete directory structure of the mental wellness skill, explaining the purpose of each directory and what types of files belong in each location.

## Root Structure

```
mental-wellness-self-reflection-advisor/
├── README.md                           # Project overview and orientation
├── CLAUDE.md                           # Operating instructions for Claude
├── PROJECT-detail.md                   # Functional and technical specification
├── DEVELOPMENT-TASK-BY-PHASES.md      # Phased build plan
├── SECOND-BRAIN-KNOWLEDGE-PAPER.md    # Research paper knowledge base
├── PROJECT-DEVELOPMENT-PHASE-TRACKING.md # Development phase tracking
├── DEVELOPMENT-TRACKING.md              # Ongoing development progress
├── SKILL.md                            # Main skill definition (when packaged)
│
├── docs/                               # Architecture and design documentation
│   ├── ARCHITECTURE.md                 # System architecture specification
│   └── DIRECTORY-STRUCTURE.md          # This file
│
├── config/                             # Type-safe configuration management
│   ├── config.ts                       # Main configuration loader
│   ├── schemas.ts                      # Configuration schemas
│   ├── defaults.ts                     # Default configuration values
│   ├── skills/                         # Skill registration configurations
│   │   └── registry.ts                 # Skill registry declarations
│   ├── hooks/                          # Hook configurations
│   │   └── chain.ts                    # Hook chain definitions
│   └── tools/                          # Tool configurations
│       └── registry.ts                 # Tool registry declarations
│
├── scripts/                            # Executable automation scripts
│   ├── setup/                          # Initial setup and seeding
│   │   ├── seed-references.ts          # Reference data seeding
│   │   └── validate-config.ts         # Configuration validation
│   ├── maintenance/                    # Maintenance operations
│   │   ├── refresh-cache.ts            # Cache refresh
│   │   └── audit-safety.ts             # Safety compliance audit
│   └── utils/                          # Utility scripts
│       ├── schema-validator.ts         # JSON schema validation
│       └── crisis-detector.ts          # Crisis keyword detection
│
├── references/                         # Domain knowledge and prompts
│   ├── frameworks/                     # Framework operational principles
│   │   ├── cbt.md                      # CBT principles and techniques
│   │   ├── act.md                      # ACT principles and techniques
│   │   ├── mbsr.md                     # MBSR principles and practices
│   │   └── perma.md                    # PERMA wellbeing model
│   ├── safety/                         # Safety guidelines and resources
│   │   ├── crisis-keywords.md          # Crisis detection patterns
│   │   ├── nondiagnostic-guide.md      # Language guardrails
│   │   └── disclaimers.md              # Disclaimer templates
│   ├── prompts/                        # Prompt templates
│   │   ├── journaling.md               # Reflective journaling prompts
│   │   ├── mindfulness.md              # Guided mindfulness scripts
│   │   ├── values.md                   # Values-clarification prompts
│   │   └── defusion.md                 # Cognitive defusion techniques
│   └── assessments/                    # Assessment templates
│       ├── wellbeing-check.md          # PERMA wellbeing checklist
│       └── values-card-sort.md         # Values exercise template
│
├── assets/                             # Static resources
│   ├── templates/                      # Response templates
│   │   ├── disclaimer.md               # Standard disclaimer
│   │   ├── crisis-response.md         # Immediate crisis response
│   │   └── fallback-response.md        # Generic fallback
│   ├── schemas/                        # JSON schemas for validation
│   │   ├── input-schemas.json          # Tool input schemas
│   │   └── output-schemas.json         # Tool output schemas
│   └── resources/                      # External resources
│       ├── crisis-hotlines.md          # Global crisis resources
│       └── professional-referral.md    # Referral guidance
│
└── evals/                              # Evaluation and testing
    ├── evals.json                      # Test case definitions
    └── skills/                         # Skill-specific test cases
        ├── safety/                      # Safety test cases
        ├── journaling/                  # Journaling test cases
        ├── mindfulness/                 # Mindfulness test cases
        └── values/                      # Values test cases
```

## Directory Purposes

### `/config` - Configuration Management

Contains all configuration-related code and type definitions. All configuration is type-safe and validated against schemas.

**Key Files:**
- `config.ts` - Main configuration loader with environment variable handling
- `schemas.ts` - TypeScript interfaces and JSON schemas for config validation
- `defaults.ts` - Default values for all configuration options

**Subdirectories:**
- `config/skills/` - Skill registration declarations with metadata
- `config/hooks/` - Hook chain definitions and ordering
- `config/tools/` - Tool registration with schemas

### `/scripts` - Executable Scripts

Contains TypeScript scripts for automation, maintenance, and utilities. These scripts are executed directly, not loaded as part of the skill runtime.

**Subdirectories:**
- `scripts/setup/` - One-time setup scripts (seeding, validation)
- `scripts/maintenance/` - Periodic maintenance (cache refresh, audits)
- `scripts/utils/` - Reusable utility functions

**Usage:**
```bash
# Run setup
npm run setup:seed-references

# Run maintenance
npm run maintenance:refresh-cache

# Run utilities
npm run utils:validate-schema
```

### `/references` - Domain Knowledge

Contains the knowledge base of frameworks, techniques, and prompts. These files are loaded into context on-demand during skill execution.

**Subdirectories:**
- `references/frameworks/` - Operational principles from research papers
- `references/safety/` - Safety guidelines and crisis resources
- `references/prompts/` - Prompt templates for different capabilities
- `references/assessments/` - Assessment and exercise templates

**File Format:**
- Markdown with frontmatter metadata
- Structured sections for easy parsing
- Inline examples and templates

### `/assets` - Static Resources

Contains static files used in skill responses, including templates, schemas, and external resource references.

**Subdirectories:**
- `assets/templates/` - Response templates with placeholders
- `assets/schemas/` - JSON schemas for input/output validation
- `assets/resources/` - External resource references (hotlines, referrals)

**Usage:**
Templates are loaded and filled with context-specific data during skill execution.

### `/evals` - Evaluation

Contains test case definitions and test data for skill evaluation.

**Key Files:**
- `evals.json` - Main test case registry
- Subdirectories contain skill-specific test cases

**Test Case Format:**
```json
{
  "id": 1,
  "prompt": "User's task prompt",
  "expected_output": "Description of expected result",
  "assertions": [
    {
      "name": "assertion_name",
      "check": "assertion_function",
      "expected": true
    }
  ]
}
```

### `/docs` - Documentation

Contains architecture, design, and reference documentation.

**Key Files:**
- `ARCHITECTURE.md` - Complete system architecture
- `DIRECTORY-STRUCTURE.md` - This file

## File Naming Conventions

| Pattern | Usage | Examples |
|---------|-------|----------|
| `kebab-case.ts` | TypeScript files | `seed-references.ts` |
| `kebab-case.md` | Markdown files | `crisis-keywords.md` |
| `kebab-case.json` | JSON data files | `input-schemas.json` |
| `PascalCase.ts` | Type definitions | `Config.ts`, `Schema.ts` |

## Adding New Content

### Adding a New Framework

1. Create `references/frameworks/<name>.md`
2. Extract operational principles (not just citations)
3. Add to `config/skills/registry.ts`
4. Create test cases in `evals/skills/`

### Adding a New Tool

1. Define schema in `assets/schemas/input-schemas.json` and `output-schemas.json`
2. Create handler in `scripts/tools/`
3. Register in `config/tools/registry.ts`
4. Add test cases

### Adding a New Prompt Template

1. Create template in `references/prompts/<category>.md`
2. Register in appropriate skill configuration
3. Test with sample inputs

## Version Control

All directories are tracked in version control. Generated files (e.g., cache files, temporary files) should be in `.gitignore`.

---

**Last Updated:** 2025-01-04
