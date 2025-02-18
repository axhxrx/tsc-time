import { getTscCommandComponents } from './getTscCommandComponents.ts';
import { parseDiagnostics } from './parseDiagnostics.ts';
import type { TscExecutionResult } from './TscExecutionResult.ts';

/**
 The Deno flavor of `runTsc`.
 */
export async function runTscWithDeno(file: string): Promise<TscExecutionResult>
{
  const start = performance.now();

  let tscExitCode = -1;
  const args = getTscCommandComponents(file, false);
  const command = new Deno.Command('npx', { args });

  const commandResult = await command.output();
  tscExitCode = commandResult.code;
  const stdout = new TextDecoder().decode(commandResult.stdout);
  const stderr = new TextDecoder().decode(commandResult.stderr);
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
}
