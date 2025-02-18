// Deno is our jam, but because we want this to run under Bun and Node also, lets use modly old `process` which they all support:
import process from 'node:process';

import { isDenoRuntime } from './isDenoRuntime.ts';
import { printErrorInfo } from './printErrorInfo.ts';
import { runTscWithDeno } from './runTscWithDeno.ts';
import { runTscWithNode } from './runTscWithNode.ts';
import type { TscExecutionResult } from './TscExecutionResult.ts';

/**
 Run `tsc` on the given file, and return the result as a `TscExecutionResult`. In most cases, the result will be returned even if `tsc` fails. The `tsc` command is run as a subprocess and its output is parsed.

 This should work under Deno, Node, or Bun. Other runtimes not tested, but would only work if they can run subprocesses in a Node-compatible way.

 Example result:
 ```ts
{
  tscExitCode: 0,
  elapsedMs: 1576.915708,
  stdout: "Files: <blah blah blah omitted>...",
  stderr: "",
  tscCommand: "npx tsc --strict true --target esnext --project /Volumes/SORACOM/ucm-main/libs/ts/core/data-access-auth/tsconfig.lib.json --allowImportingTsExtensions --noEmit --extendedDiagnostics",
  diagnostics: {
    Files: "858",
    "Lines of Library": "39520",
    "Lines of Definitions": "75228",
    "Lines of TypeScript": "15172",
    "Lines of JavaScript": "0",
    "Lines of JSON": "0",
    "Lines of Other": "0",
    Identifiers: "116052",
    Symbols: "104457",
    Types: "20866",
    Instantiations: "12276",
    "Memory used": "168666K",
    "Assignability cache size": "7573",
    "Identity cache size": "69",
    "Subtype cache size": "274",
    "Strict subtype cache size": "135",
    "I/O Read time": "0.18s",
    "Parse time": "0.20s",
    "ResolveModule time": "0.04s",
    "ResolveLibrary time": "0.01s",
    "ResolveTypeReference time": "0.00s",
    "Program time": "0.48s",
    "Bind time": "0.11s",
    "Check time": "0.32s",
    "transformTime time": "0.19s",
    "printTime time": "0.00s",
    "Emit time": "0.00s",
    "Total time": "0.91s",
  },
}
 ```
 */
export async function runTsc(file: string): Promise<TscExecutionResult>
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

  if (result.tscExitCode !== 0)
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
    printErrorInfo(
      result,
      'FATAL: wtf: cannot parse checkTime from line: ' + checkTimeLine + '\n\nVery likely a bug in this tool... 🙄 ',
    );
    process.exit(31);
  }

  return result;
}
