# Crisis Keywords — Detection Patterns

**Purpose:** Define crisis detection patterns for immediate resource surfacing. These keywords are organized by severity level and used by the crisis detection tool.

> **Important:** This is a safety-critical component. All crisis detection must be followed by immediate resource provision.

## Severity Levels

### Severe (Immediate Crisis Response Required)

**Keywords:**
- `suicid` (suicide, suicidal, suicidal ideation)
- `kill myself` / `kill myself` / `want to kill myself`
- `end it all` / `end my life` / `end my life`
- `want to die` / `don't want to live`
- `planning to harm` / `planning to hurt myself`
- `going to end it` / `going to do it`
- `have a plan` (in context of self-harm)
- `means to harm` / `have the means`
- `goodbye forever` (in concerning context)
- `final goodbye` / `last time`

**Response:** Immediate crisis resources + emergency contacts
**Action:** Bypass normal skill execution, provide crisis response immediately

### Moderate (Professional Referral Recommended)

**Keywords:**
- `hopeless` / `hopelessness` / `feeling hopeless`
- `no reason to live` / `nothing to live for`
- `burden` / `burden to others` / `I'm a burden`
- `better off without me` / `everyone better off without me`
- `can't go on` / `can't continue` / `can't keep going`
- `want it all to end` / `wish it would end`
- `don't see a point` / `no point to anything`
- `everything is pointless` / `nothing matters`
- `wish I wasn't here` / `wish I didn't exist`

**Response:** Professional referral + crisis resources + support
**Action:** Provide crisis resources, encourage professional support, offer to discuss further

### Mild (Supportive Response with Professional Option)

**Keywords:**
- `overwhelmed` / `can't cope` / `too much to handle`
- `struggling to cope` / `struggling to manage`
- `drowning` / `in over my head`
- `can't handle this` / `can't take it anymore`
- `falling apart` / `breaking down`
- `at the end of my rope` / `at my wit's end`
- `don't know what to do` / `lost`
- `barely holding on` / `hanging by a thread`

**Response:** Supportive listening + self-care suggestions + professional option
**Action:** Normalize experience, offer support, suggest professional resources if needed

## Contextual Indicators

### Red Flags (Elevate Severity)

These phrases, when combined with any crisis keywords, elevate the severity level:

- `I have a plan`
- `I know how I would do it`
- `I've been thinking about it for a while`
- `I'm ready` / `it's time`
- `no one can stop me`
- `I've already started` / `I tried`
- `tonight` / `tomorrow` / `soon` (in planning context)

### Protective Factors (May Lower Severity)

These phrases may indicate lower immediate risk (but still require professional follow-up):

- `I would never actually do it`
- `I just have these thoughts but wouldn't act`
- `I know I need help`
- `I'm already in therapy`
- `I'm talking to my doctor`
- `My family knows` / `my friends are helping`

**Caution:** Protective factors reduce but don't eliminate risk. Professional referral still recommended.

## Combination Detection

Crisis detection considers **keyword combinations**:

### High-Risk Combinations (Severe)
- `suicide` + `plan`
- `kill myself` + `when/how`
- `want to die` + `can`
- `end it` + `ready`
- `hopeless` + `plan`

### Elevated-Risk Combinations (Moderate)
- `hopeless` + `can't go on`
- `burden` + `better off without me`
- `want to die` + `wish` (without plan)
- `no reason to live` + `alone`

## Detection Algorithm

The crisis detection tool uses this logic:

```typescript
function detectCrisis(text: string, sensitivity: 'strict' | 'moderate' | 'permissive'): CrisisResult {
  const normalizedText = text.toLowerCase();

  // Check severe keywords first (always checked regardless of sensitivity)
  for (const keyword of SEVERE_KEYWORDS) {
    if (normalizedText.includes(keyword)) {
      return { severity: 'severe', immediate: true };
    }
  }

  // Check moderate keywords (strict or moderate sensitivity)
  if (sensitivity === 'strict' || sensitivity === 'moderate') {
    for (const keyword of MODERATE_KEYWORDS) {
      if (normalizedText.includes(keyword)) {
        // Check for red flags
        if (hasRedFlags(normalizedText, keyword)) {
          return { severity: 'severe', immediate: true };
        }
        return { severity: 'moderate', immediate: false };
      }
    }
  }

  // Check mild keywords (permissive sensitivity)
  if (sensitivity === 'permissive') {
    for (const keyword of MILD_KEYWORDS) {
      if (normalizedText.includes(keyword)) {
        return { severity: 'mild', immediate: false };
      }
    }
  }

  return { severity: 'none', immediate: false };
}
```

## International Crisis Resources

### United States
- **988 Suicide & Crisis Lifeline:** Dial or text 988
- **Crisis Text Line:** Text HOME to 741741
- **Veterans Crisis Line:** Dial 988 then press 1, or text 838255
- **Lifeline Network:** 1-800-273-TALK (8255)

### International
- **Find A Helpline:** https://findahelpline.com/
- **Befrienders Worldwide:** https://www.befrienders.org/

### Additional Resources
- **National Suicide Prevention Lifeline:** https://suicidepreventionlifeline.org/
- **International Association for Suicide Prevention:** https://www.iasp.info/

## Usage Guidelines

### When to Use Crisis Detection

**Always use crisis detection:**
- On all user inputs before skill execution
- During skill execution if new language appears
- In response validation if output contains concerning content

**Sensitivity settings:**
- `strict`: Production environment (lowest false negative rate)
- `moderate`: Testing environment (balanced)
- `permissive`: Development environment (lowest false positive rate)

### Response Requirements

All crisis responses must include:
1. Validation and empathy
2. Immediate crisis resources (phone/text/chat)
3. Encouragement to reach out for help
4. Offer to continue conversation
5. Required disclaimer

## Testing

Test crisis detection with these cases:

| Input | Expected Severity | Reason |
|-------|------------------|--------|
| "I want to kill myself" | Severe | Direct self-harm intent |
| "I'm feeling hopeless" | Moderate | Elevated distress |
| "I'm overwhelmed" | Mild | General distress (permissive only) |
| "I'm feeling great today" | None | No crisis indicators |
| "I have a plan to end it" | Severe | Plan + intent keywords |
| "I feel like a burden" | Moderate | Concerning language |
| "I wish I wasn't here but I wouldn't do anything" | Mild | Passive ideation with protective factor |

## Maintenance

**Review schedule:** Quarterly
**Stakeholders:** Mental health professionals, crisis hotline experts
**Update criteria:** New research on crisis language patterns, emerging terminology

---

**Version:** 1.0.0
**Last Updated:** 2025-01-04
**Next Review:** 2025-04-04
