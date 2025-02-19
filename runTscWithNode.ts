import * as child_process from 'node:child_process';
import { getTscCommandComponents } from './getTscCommandComponents.ts';
import type { TscExecutionResultBare } from './TscExecutionResult.ts';

/**
 NOTE: This does NOT work in Node or Bun if you are inside a project that isn't using ESM. Like if you have some crusty old monorepo with some Angular apps in it and a bunch of CommonJS dependencies.

 For that scenario, use `runTscWithNodeSubprocessThatRunsDeno()`.

 Otherwise, this is the Node flavor of `runTsc`. This should also work when running on Bun.
 */
export const runTscWithNode = (file: string): TscExecutionResultBare =>
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
