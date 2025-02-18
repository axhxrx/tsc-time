import { getTscCommandComponents } from './getTscCommandComponents.ts';
import { parseDiagnostics } from './parseDiagnostics.ts';
import type { TscExecutionResult } from './TscExecutionResult.ts';

/**
 The Node flavor of `runTsc`. This should also work when runnig on Bun.
 */
export const runTscWithNode = async (file: string): Promise<TscExecutionResult> =>
{
  const start = performance.now();

  let tscExitCode = -1;

  const cp = await import('child_process');
  const args = getTscCommandComponents(file, false);

  const { status, stdout: rawStdout, stderr: rawStderr } = cp.spawnSync('npx', args);
  tscExitCode = status ?? -1;

  const stdout = new TextDecoder().decode(rawStdout);
  const stderr = new TextDecoder().decode(rawStderr);
  const diagnostics = parseDiagnostics(stdout);

  const result: TscExecutionResult = {
    tscExitCode,
    elapsedMs: performance.now() - start,
    stdout,
    stderr,
    tscCommand: 'npx ' + args.join(' '),
    diagnostics,
  };

  return result;
};
