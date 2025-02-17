import { isBunRuntime } from './isBunRuntime.ts';
import { isDenoRuntime } from './isDenoRuntime.ts';
import { isNodeRuntime } from './isNodeRuntime.ts';
import { TscExecutionResultWithDiagnostics } from './main.ts';
import { parseDiagnostics } from './parseDiagnostics.ts';
import { printErrorInfo } from './printErrorInfo.ts';
import { runTscWithBun } from './runTscWithBun.ts';
import { runTscWithDeno } from './runTscWithDeno.ts';
import type { TscExecutionResult } from './TscExecutionResult.ts';

export async function runTsc(file: string): Promise<TscExecutionResultWithDiagnostics>
{
  let result: TscExecutionResult;

  if (isDenoRuntime())
  {
    result = await runTscWithDeno(file);
  }
  else if (isBunRuntime())
  {
    result = await runTscWithBun(file);
  }
  else if (isNodeRuntime())
  {
    result = await runTscWithNode(file);
  }
  else
  {
    throw new Error('Unsupported runtime. Not Node, Deno, or Bun!');
  }

  if (result.code !== 0)
  {
    console.error('The tsc command failed:');
    console.log(result.stdout);
    throw new Error(`tsc exited with code ${result.code}: ${result.stderr}`);
  }

  if (!result.stdout)
  {
    throw new Error('tsc produced no output');
  }

  // Parse "Check time:"
  const checkTimeLine = result.stdout
    .split('\n')
    .find((line) => line.includes('Check time'));

  if (!checkTimeLine)
  {
    printErrorInfo(result, 'FATAL: wtf: cannot parse tsc output, probably a bug in this tool then... 🙄');
    Deno.exit(1);
  }

  const match = checkTimeLine.match(/([\d.]+)s/);
  if (!match)
  {
    printErrorInfo(result,
      'FATAL: wtf: cannot parse checkTime from line: ' + checkTimeLine + '\n\nVery likely a bug in this tool... 🙄 ');
    Deno.exit(1);
  }

  const checkTime = parseFloat(match[1]);

  result = {
    ...result,
    checkTime,
  };

  const diagnostics = parseDiagnostics(result.stdout);

  return {
    ...result,
    diagnostics,
  };
}
