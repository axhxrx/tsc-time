/**
 Heuristic to determine whether we are running under Deno.
 */
export function isDenoRuntime(): boolean
{
  return typeof Deno !== 'undefined' && typeof Deno?.Command === 'function';
}
