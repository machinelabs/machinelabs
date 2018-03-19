export function getEnv(name: string) {
  if (!process.env[name]) {
    console.log(`UNABLE TO LOCATE ENVIRONMENT VARIABLE: ${name}`);
    throw new Error(`Unable to locate environment variable: ${name}`);
  }
  return process.env[name];
}
