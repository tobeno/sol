export function getCwd(): string {
  return process.cwd();
}

export function getEnv<
  EnvType extends Record<string, any> = Record<string, string>,
>(): EnvType {
  return process.env as EnvType;
}
