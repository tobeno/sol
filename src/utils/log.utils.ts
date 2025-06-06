export enum LogLevel {
  DEBUG = 'debug',
}

export function log(...args: any[]): void {
  console.log(...args);
}

export function logDebug(...args: any[]): void {
  if (process.env['SOL_LOG_LEVEL']?.toLowerCase() !== LogLevel.DEBUG) {
    return;
  }

  console.debug(...args);
}

export function logError(...args: any[]): void {
  console.error(...args);
}
