# PROJECT-detail.md — Mental Wellness & Mindfulness Self-Reflection Advisor

## 1. Problem Statement

A psychoeducational wellness skill that helps users reflect on their emotional wellbeing and build mindfulness/stress-management skills using validated psychoeducational frameworks (not diagnostic instruments). It never diagnoses any mental health condition, never labels a user's experience with a clinical diagnosis, and consistently encourages consultation with a licensed mental-health professional, with crisis resources surfaced when appropriate.

## 2. Target Users

Describe the primary user personas for this skill (fill in based on real usage once built): e.g., students, professionals, hobbyists, or practitioners in the relevant domain.

## 3. Functional Specification

### 3.1 Core Capabilities

- Guide reflective journaling prompts grounded in CBT/ACT psychoeducational frameworks
- Teach mindfulness and stress-reduction techniques (MBSR-informed)
- Explain general wellbeing concepts (stress, mood, coping) in plain, non-diagnostic language
- Support values-clarification exercises (ACT-informed)
- Always encourage professional consultation rather than self-diagnosis
- Surface crisis resources immediately if any signs of crisis appear, per safety-first design

### 3.2 Key Methodologies & Frameworks Applied

- **Cognitive Behavioral Therapy (CBT) psychoeducational principles**
- **Acceptance and Commitment Therapy (ACT) values-and-defusion framework**
- **Mindfulness-Based Stress Reduction (MBSR, Kabat-Zinn)**
- **Positive psychology / PERMA wellbeing model (Seligman)**
- **Non-diagnostic, strengths-based psychoeducation design principles**

Each framework above should be operationalized as a concrete step, checklist, or template inside the skill's SKILL.md and reference files once this scaffold is turned into a runnable skill (see `DEVELOPMENT-TASK-BY-PHASES.md`).

### 3.3 Expected Input

Typical user requests this skill should handle (fill in with real example prompts during development and testing).

### 3.4 Expected Output Format

Define the structured output format(s) this skill should produce (e.g., structured report, checklist, scored recommendation, memo). Align with the methodologies above so outputs are consistent and auditable.

## 4. Out of Scope / Guardrails

- Always include the standing disclaimer for this domain (see CLAUDE.md).
- Never present output as a certified/professional determination (e.g., not a diagnosis, not a legal opinion, not a guaranteed forecast).
- Where the skill involves a named third party (e.g., a partner, a suspect, a specific person), do not produce a definitive judgment about that individual — stay at the level of general, population-based information and structured reasoning support.
- Flag explicitly when a licensed professional (doctor, lawyer, engineer, certified analyst, etc.) should be consulted.

## 5. Knowledge Base Dependency

This skill's reasoning quality depends on the research foundations catalogued in `SECOND-BRAIN-KNOWLEDGE-PAPER.md`. When building the actual skill (SKILL.md + references/), extract the operational principles from each paper into concrete reference files rather than leaving them as a flat reading list.

## 6. Success Criteria

- Output correctly applies the named methodologies rather than generic reasoning.
- Output is well-structured and consistent across repeated runs on similar inputs.
- Domain-appropriate guardrails/disclaimers are respected in every response.
- Test prompts (see `DEVELOPMENT-TASK-BY-PHASES.md`, Phase 5) produce outputs a subject-matter-competent reviewer would rate as sound.
