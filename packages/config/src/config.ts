import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { ConfigProvider, SupabaseConfig } from './interfaces.js';
import { validateSupabaseEnv } from './validation.js';

/**
 * Environment types
 */
export enum Environment {
  Development = 'development',
  Staging = 'staging',
  Production = 'production',
  Test = 'test'
}

/**
 * Configuration error class
 */
export class ConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConfigError';
  }
}

/**
 * Configuration manager class
 */
export class ConfigManager implements ConfigProvider {
  private environment: Environment;
  private envVars: Record<string, string | undefined>;
  private static instance: ConfigManager;

  /**
   * Get singleton instance of ConfigManager
   */
  public static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  /**
   * Private constructor to enforce singleton pattern
   */
  private constructor() {
    this.environment = this.determineEnvironment();
    this.envVars = this.loadEnvironmentVariables();
  }

  /**
   * Determine the current environment based on NODE_ENV
   */
  private determineEnvironment(): Environment {
    const nodeEnv = process.env.NODE_ENV?.toLowerCase() || 'development';
    
    switch (nodeEnv) {
      case 'production':
        return Environment.Production;
      case 'staging':
        return Environment.Staging;
      case 'test':
        return Environment.Test;
      case 'development':
      default:
        return Environment.Development;
    }
  }

  /**
   * Load environment variables from .env files
   */
  private loadEnvironmentVariables(): Record<string, string | undefined> {
    // Determine the project root directory
    const projectRoot = this.findProjectRoot();
    
    // Load environment variables from .env files
    const envFiles = [
      // Base .env file
      path.join(projectRoot, '.env'),
      // Environment-specific .env file
      path.join(projectRoot, `.env.${this.environment}`),
      // Local overrides (not committed to version control)
      path.join(projectRoot, `.env.${this.environment}.local`),
      path.join(projectRoot, '.env.local')
    ];

    // Load each env file if it exists
    for (const envFile of envFiles) {
      if (fs.existsSync(envFile)) {
        const envConfig = dotenv.parse(fs.readFileSync(envFile));
        
        // Merge with process.env
        for (const key in envConfig) {
          process.env[key] = envConfig[key];
        }
      }
    }

    return process.env;
  }

  /**
   * Find the project root directory (where package.json is located)
   */
  private findProjectRoot(): string {
    let currentDir = process.cwd();
    
    // Traverse up the directory tree until we find package.json
    while (currentDir !== '/') {
      if (fs.existsSync(path.join(currentDir, 'package.json'))) {
        return currentDir;
      }
      currentDir = path.dirname(currentDir);
    }
    
    // If we can't find it, use the current directory
    return process.cwd();
  }

  /**
   * Get the current environment
   */
  public getEnvironment(): Environment {
    return this.environment;
  }

  /**
   * Get Supabase configuration
   */
  public getSupabaseConfig(): SupabaseConfig {
    try {
      // Validate environment variables
      const validatedEnv = validateSupabaseEnv(this.envVars);
      
      // Create and return the config object
      return {
        environment: this.environment,
        url: validatedEnv.SUPABASE_URL,
        apiKey: validatedEnv.SUPABASE_API_KEY,
        jwtSecret: validatedEnv.SUPABASE_JWT_SECRET,
        storageBucket: validatedEnv.SUPABASE_STORAGE_BUCKET,
        dbConnectionString: validatedEnv.SUPABASE_DB_CONNECTION_STRING
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new ConfigError(`Failed to load Supabase configuration: ${error.message}`);
      }
      throw new ConfigError('Failed to load Supabase configuration');
    }
  }
}

/**
 * Get the configuration provider instance
 */
export function getConfigProvider(): ConfigProvider {
  return ConfigManager.getInstance();
}

/**
 * Get Supabase configuration
 */
export function getSupabaseConfig(): SupabaseConfig {
  return getConfigProvider().getSupabaseConfig();
}