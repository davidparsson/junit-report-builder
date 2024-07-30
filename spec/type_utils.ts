export function getSpy<T extends (...args: any[]) => any>(method: T): ReturnType<typeof vi.fn<T>> {
  return method as never;
}
