/**
 * Holds a couple of settings including ENV var mappings.
 * 
 */

export class Config {
  static readonly ENV_USERNAME = 'MACHINELABS_FB_BOT_USERNAME';
  static readonly ENV_PASSWORD = 'MACHINELABS_FB_BOT_PASSWORD';

  static getEnv (name: string) {
    if (!process.env[name]){
      console.log(`UNABLE TO LOCATE ENVIRONMENT VARIABLE: ${name}`);
      throw new Error(`Unable to locate environment variable: ${name}`);
    }
    return process.env[name];
  }
}