import * as child_process from 'node:child_process';
import { getTscCommandComponents } from './getTscCommandComponents.ts';
import type { TscExecutionResultBare } from './TscExecutionResult.ts';

/**
 The Node flavor of `runTsc`. This should also work when runnig on Bun.
 */
export const runTscWithNode = async (file: string): Promise<TscExecutionResultBare> =>
{
  const start = performance.now();

  let tscExitCode = -1;

  const args = getTscCommandComponents(file, false);

  const { status, stdout: rawStdout, stderr: rawStderr } = child_process.spawnSync('npx', args);
  tscExitCode = status ?? -1;

  const stdout = new TextDecoder().decode(rawStdout);
  const stderr = new TextDecoder().decode(rawStderr);

  const result: TscExecutionResultBare = {
    tscExitCode,
    elapsedMs: performance.now() - start,
    stdout,
    stderr,
    tscCommand: 'npx ' + args.join(' '),
  };

  return result;
};
