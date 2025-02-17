export function isDenoRuntime(): boolean {
  return typeof Deno !== 'undefined' && typeof Deno?.Command === 'function';
}
