import { getTscCommandComponents } from './getTscCommandComponents.ts';
import type { TscExecutionResultBare } from './TscExecutionResult.ts';

/**
 The Deno flavor of `runTsc`.
 */
export async function runTscWithDeno(file: string): Promise<Omit<TscExecutionResultBare, 'diagnostics' | 'checkTime'>>
{
  const start = performance.now();

  let tscExitCode = -1;
  const args = getTscCommandComponents(file, false);
  const command = new Deno.Command('npx', { args });

  const commandResult = await command.output();
  tscExitCode = commandResult.code;
  const stdout = new TextDecoder().decode(commandResult.stdout);
  const stderr = new TextDecoder().decode(commandResult.stderr);

  const result: TscExecutionResultBare = {
    tscExitCode,
    elapsedMs: performance.now() - start,
    stdout,
    stderr,
    tscCommand: 'npx ' + args.join(' '),
  };

  return result;
}
