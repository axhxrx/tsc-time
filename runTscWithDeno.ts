import { getTscCommandComponents } from './geTscCommandComponents.ts';
import { TscExecutionResult } from './TscExecutionResult.ts';

export async function runTscWithDeno(file: string): Promise<TscExecutionResult>
{
  const start = performance.now();

  let code = -1;
  let rawStdout = new Uint8Array();
  let rawStderr = new Uint8Array();
  const args = getTscCommandComponents(file, false);
  const command = new Deno.Command('npx', { args });

  const commandResult = await command.output();
  code = commandResult.code;
  rawStdout = commandResult.stdout;
  rawStderr = commandResult.stderr;

  const result: TscExecutionResult = {
    code,
    checkTime: -1,
    elapsedMs: performance.now() - start,
    stdout: new TextDecoder().decode(rawStdout),
    stderr: new TextDecoder().decode(rawStderr),
    tscCommand: 'npx ' + args.join(' '),
  };

  return result;
}
