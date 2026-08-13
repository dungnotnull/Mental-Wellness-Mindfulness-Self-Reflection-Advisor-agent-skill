/**
 * Configuration Loader — Mental Wellness Self-Reflection Advisor
 *
 * Type-safe configuration management with environment variable handling,
 * schema validation, and default value resolution.
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Model provider configuration
 */
export interface ModelConfig {
  provider: 'anthropic' | 'openai' | 'local';
  model_id: string;
  api_key?: string;
  temperature: number;
  max_tokens: number;
  timeout_ms: number;
}

/**
 * Safety configuration
 */
export interface SafetyConfig {
  // Crisis detection sensitivity
  crisis_detection_sensitivity: 'strict' | 'moderate' | 'permissive';

  // Language filtering
  diagnostic_filtering: boolean;
  diagnostic_keywords: string[];

  // Disclaimers
  required_disclaimer: boolean;
  disclaimer_template: string;

  // Professional referral thresholds
  referral_triggers: string[];
}

/**
 * Feature flags
 */
export interface FeatureConfig {
  enable_analytics: boolean;
  enable_caching: boolean;
  enable_fallback_responses: boolean;
  enable_audit_logging: boolean;
  enable_metrics: boolean;
}

/**
 * Resource paths
 */
export interface PathConfig {
  references: string;
  scripts: string;
  assets: string;
  cache?: string;
  logs?: string;
}

/**
 * Main configuration interface
 */
export interface Config {
  model: ModelConfig;
  safety: SafetyConfig;
  features: FeatureConfig;
  paths: PathConfig;

  // Version tracking
  version: string;
  environment: 'development' | 'testing' | 'production';
}

// ============================================================================
// DEFAULT VALUES
// ============================================================================

/**
 * Default model configuration
 */
const DEFAULT_MODEL: ModelConfig = {
  provider: 'anthropic',
  model_id: 'claude-opus-4-7',
  temperature: 0.7,
  max_tokens: 4096,
  timeout_ms: 30000,
};

/**
 * Default safety configuration
 */
const DEFAULT_SAFETY: SafetyConfig = {
  crisis_detection_sensitivity: 'strict',
  diagnostic_filtering: true,
  diagnostic_keywords: [
    'diagnos',
    'disorder',
    'condition',
    'suffer from',
    'patient with',
    'clinical',
    'pathology',
    'symptoms of',
    'treatment for',
  ],
  required_disclaimer: true,
  disclaimer_template: `
**Disclaimer:** This response provides general, educational/analytical information only.
It is not a substitute for advice from a qualified mental health professional.
Always consult with a licensed therapist, counselor, or psychiatrist before making
decisions based on this information.

If you are experiencing a mental health emergency or crisis, please contact emergency
services or a crisis hotline immediately.
  `.trim(),
  referral_triggers: [
    'suicid',
    'self-harm',
    'want to die',
    'kill myself',
    'end it all',
    'hopeless',
    'no reason to live',
  ],
};

/**
 * Default feature configuration
 */
const DEFAULT_FEATURES: FeatureConfig = {
  enable_analytics: false,
  enable_caching: true,
  enable_fallback_responses: true,
  enable_audit_logging: true,
  enable_metrics: true,
};

/**
 * Default path configuration
 */
const DEFAULT_PATHS: PathConfig = {
  references: './references',
  scripts: './scripts',
  assets: './assets',
  cache: './cache',
  logs: './logs',
};

// ============================================================================
// ENVIRONMENT VARIABLE MAPPINGS
// ============================================================================

const ENV_MAPPINGS: Record<string, keyof Config> = {
  // Model
  'MODEL_PROVIDER': 'model',
  'MODEL_ID': 'model',
  'API_KEY': 'model',
  'MODEL_TEMPERATURE': 'model',
  'MODEL_MAX_TOKENS': 'model',
  'MODEL_TIMEOUT_MS': 'model',

  // Safety
  'SAFETY_CRISIS_SENSITIVITY': 'safety',
  'SAFETY_DIAGNOSTIC_FILTERING': 'safety',
  'SAFETY_REQUIRED_DISCLAIMER': 'safety',

  // Features
  'ENABLE_ANALYTICS': 'features',
  'ENABLE_CACHING': 'features',
  'ENABLE_FALLBACK_RESPONSES': 'features',
  'ENABLE_AUDIT_LOGGING': 'features',
  'ENABLE_METRICS': 'features',

  // Paths
  'PATH_REFERENCES': 'paths',
  'PATH_SCRIPTS': 'paths',
  'PATH_ASSETS': 'paths',
  'PATH_CACHE': 'paths',
  'PATH_LOGS': 'paths',

  // Environment
  'NODE_ENV': 'environment',
};

// ============================================================================
// CONFIGURATION LOADER
// ============================================================================

/**
 * Load configuration from environment variables with defaults
 */
export function loadConfig(): Config {
  const env = process.env;

  const config: Config = {
    version: '1.0.0',
    environment: (env.NODE_ENV as Config['environment']) || 'development',

    model: {
      ...DEFAULT_MODEL,
      provider: (env.MODEL_PROVIDER as ModelConfig['provider']) || DEFAULT_MODEL.provider,
      model_id: env.MODEL_ID || DEFAULT_MODEL.model_id,
      api_key: env.API_KEY,
      temperature: env.MODEL_TEMPERATURE ? parseFloat(env.MODEL_TEMPERATURE) : DEFAULT_MODEL.temperature,
      max_tokens: env.MODEL_MAX_TOKENS ? parseInt(env.MODEL_MAX_TOKENS, 10) : DEFAULT_MODEL.max_tokens,
      timeout_ms: env.MODEL_TIMEOUT_MS ? parseInt(env.MODEL_TIMEOUT_MS, 10) : DEFAULT_MODEL.timeout_ms,
    },

    safety: {
      ...DEFAULT_SAFETY,
      crisis_detection_sensitivity: (env.SAFETY_CRISIS_SENSITIVITY as SafetyConfig['crisis_detection_sensitivity']) || DEFAULT_SAFETY.crisis_detection_sensitivity,
      diagnostic_filtering: env.SAFETY_DIAGNOSTIC_FILTERING !== 'false',
      required_disclaimer: env.SAFETY_REQUIRED_DISCLAIMER !== 'false',
    },

    features: {
      ...DEFAULT_FEATURES,
      enable_analytics: env.ENABLE_ANALYTICS === 'true',
      enable_caching: env.ENABLE_CACHING !== 'false',
      enable_fallback_responses: env.ENABLE_FALLBACK_RESPONSES !== 'false',
      enable_audit_logging: env.ENABLE_AUDIT_LOGGING !== 'false',
      enable_metrics: env.ENABLE_METRICS !== 'false',
    },

    paths: {
      ...DEFAULT_PATHS,
      references: env.PATH_REFERENCES || DEFAULT_PATHS.references,
      scripts: env.PATH_SCRIPTS || DEFAULT_PATHS.scripts,
      assets: env.PATH_ASSETS || DEFAULT_PATHS.assets,
      cache: env.PATH_CACHE || DEFAULT_PATHS.cache,
      logs: env.PATH_LOGS || DEFAULT_PATHS.logs,
    },
  };

  return config;
}

/**
 * Validate configuration against schema
 */
export function validateConfig(config: Config): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Validate model config
  if (!config.model.model_id) {
    errors.push('MODEL_ID is required');
  }
  if (config.model.temperature < 0 || config.model.temperature > 1) {
    errors.push('MODEL_TEMPERATURE must be between 0 and 1');
  }
  if (config.model.max_tokens <= 0) {
    errors.push('MODEL_MAX_TOKENS must be positive');
  }

  // Validate safety config
  const validSensitivities = ['strict', 'moderate', 'permissive'];
  if (!validSensitivities.includes(config.safety.crisis_detection_sensitivity)) {
    errors.push('Invalid crisis_detection_sensitivity');
  }

  // Validate environment
  const validEnvironments = ['development', 'testing', 'production'];
  if (!validEnvironments.includes(config.environment)) {
    errors.push('Invalid NODE_ENV');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Get environment-specific overrides
 */
export function getEnvironmentOverrides(environment: Config['environment']): Partial<Config> {
  const overrides: Record<Config['environment'], Partial<Config>> = {
    development: {
      safety: {
        ...DEFAULT_SAFETY,
        crisis_detection_sensitivity: 'moderate',
      },
      features: {
        ...DEFAULT_FEATURES,
        enable_analytics: false,
        enable_metrics: true,
      },
    },
    testing: {
      safety: {
        ...DEFAULT_SAFETY,
        crisis_detection_sensitivity: 'moderate',
      },
      features: {
        ...DEFAULT_FEATURES,
        enable_analytics: false,
        enable_caching: false,
      },
    },
    production: {
      safety: {
        ...DEFAULT_SAFETY,
        crisis_detection_sensitivity: 'strict',
      },
      features: {
        ...DEFAULT_FEATURES,
        enable_audit_logging: true,
        enable_metrics: true,
      },
    },
  };

  return overrides[environment] || {};
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

let cachedConfig: Config | null = null;

/**
 * Get or load configuration (singleton pattern)
 */
export function getConfig(): Config {
  if (!cachedConfig) {
    cachedConfig = loadConfig();
    const validation = validateConfig(cachedConfig);

    if (!validation.valid) {
      console.error('Configuration validation failed:', validation.errors);
      throw new Error(`Invalid configuration: ${validation.errors.join(', ')}`);
    }
  }

  return cachedConfig;
}

/**
 * Reset cached configuration (for testing)
 */
export function resetConfig(): void {
  cachedConfig = null;
}

// ============================================================================
// EXPORTS
// ============================================================================

export { DEFAULT_MODEL, DEFAULT_SAFETY, DEFAULT_FEATURES, DEFAULT_PATHS };
