import { getTscCommandComponents } from './geTscCommandComponents.ts';
import { TscExecutionResult } from './TscExecutionResult.ts';

export const runTscWithNode = async (file: string): Promise<TscExecutionResult> =>
{
  const start = performance.now();

  let code = -1;
  let rawStdout = new Uint8Array();
  let rawStderr = new Uint8Array();

  const cp = await import('child_process');
  const args = getTscCommandComponents(file, false);

  const { status, stdout, stderr } = cp.spawnSync('npx', args);
  code = status ?? -1;
  rawStdout = stdout;
  rawStderr = stderr;

  const result: TscExecutionResult = {
    code,
    checkTime: -1,
    elapsedMs: performance.now() - start,
    stdout: new TextDecoder().decode(rawStdout),
    stderr: new TextDecoder().decode(rawStderr),
    tscCommand: 'npx ' + args.join(' '),
  };

  return result;
};
