export function delay(timeMs: number): Promise<void> {
  return new Promise((resolve: () => void) => {
    setTimeout(resolve, timeMs);
  });
}
