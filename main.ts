// Deno is our jam, but because we want this to run under Bun and Node also, lets use modly old `process` which they all support:
import process from 'node:process';

import { isDenoRuntime } from './isDenoRuntime.ts';
import { parseDiagnostics } from './parseDiagnostics.ts';
import { printErrorInfo } from './printErrorInfo.ts';
import { runTscWithDeno } from './runTscWithDeno.ts';
import { runTscWithNode } from './runTscWithNode.ts';
import type { TscExecutionResult } from './TscExecutionResult.ts';

type TscExecutionResultWithDiagnostics = TscExecutionResult & { diagnostics: Record<string, unknown> };

export async function runTsc(file: string): Promise<TscExecutionResultWithDiagnostics>
{
  let result: TscExecutionResult;

  if (isDenoRuntime())
  {
    result = await runTscWithDeno(file);
  }
  else
  {
    // This works for Bun, too, so no need to check for Bun.
    result = await runTscWithNode(file);
  }

  if (result.code !== 0)
  {
    printErrorInfo(result);
    process.exit(1);
  }

  if (!result.stdout)
  {
    printErrorInfo(result, 'tsc produced no output');
    process.exit(11);
  }

  // Parse "Check time:"
  const checkTimeLine = result.stdout
    .split('\n')
    .find((line) => line.includes('Check time'));

  if (!checkTimeLine)
  {
    printErrorInfo(result, 'FATAL: wtf: cannot parse tsc output, probably a bug in this tool then... 🙄');
    process.exit(21);
  }

  const match = checkTimeLine.match(/([\d.]+)s/);
  if (!match)
  {
    printErrorInfo(result,
      'FATAL: wtf: cannot parse checkTime from line: ' + checkTimeLine + '\n\nVery likely a bug in this tool... 🙄 ');
    process.exit(31);
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

export async function main()
{
  const file = process.argv[2];
  if (!file)
  {
    throw new Error('Usage: node runTsc.ts <file>');
  }
  const result = await runTsc(file);
  console.log(result);
}
