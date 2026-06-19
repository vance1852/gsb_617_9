let idCounter = 0;

export function useId(prefix = "nexa"): string {
  return `${prefix}-${++idCounter}`;
}
