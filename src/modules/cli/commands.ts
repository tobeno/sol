/**
 * Runs the given CLI command using the given arguments.
 */
export function runCommand(command: string, args: string[]): void {
  switch (command) {
    case 'play':
      playFile(args[0] || null).replay();
      break;
    default:
      throw new Error(`Unknown command ${command}`);
  }
}
