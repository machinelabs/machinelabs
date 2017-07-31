/**
 * Holds a couple of settings including ENV var mappings.
 *
 */

export class Config {
  static readonly ENV_PRIVATE_KEY = 'MACHINELABS_FB_PRIVATE_KEY';
  static readonly ENV_CLIENT_EMAIL = 'MACHINELABS_FB_CLIENT_EMAIL';

  static getEnv (name: string) {
    if (!process.env[name]) {
      console.log(`UNABLE TO LOCATE ENVIRONMENT VARIABLE: ${name}`);
      throw new Error(`Unable to locate environment variable: ${name}`);
    }
    return process.env[name];
  }
}
