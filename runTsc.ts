import { isDenoRuntime } from './isDenoRuntime.ts';
import { parseDiagnostics } from './parseDiagnostics.ts';
import { printErrorInfo } from './printErrorInfo.ts';
import { runTscWithDeno } from './runTscWithDeno.ts';
import { runTscWithNode } from './runTscWithNode.ts';
import type { TscExecutionResult, TscExecutionResultBare } from './TscExecutionResult.ts';

/**
 Run `tsc` on the given file, with `--allowImportingTsExtensions --noEmit --extendedDiagnostics` options, and return the result as a `TscExecutionResult`. In most cases, the result will be returned even if `tsc` fails. The `tsc` command is run as a subprocess and its output is parsed.

 The `file` argument can point to a `.ts` file or a `tsconfig.json` file (any file ending with `.json` is assumed to be a tsconfig, so e.g. `./tsconfig.lib.json` is fine).

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
    checkTime: 0.32,
  }
```
  @throws in rare cases like `tsc` output changes and we can no longer parse the output in the future, but normally should not happen
 */
export async function runTsc(file: string): Promise<TscExecutionResult>
{
  let bareResult: TscExecutionResultBare;

  if (isDenoRuntime())
  {
    bareResult = await runTscWithDeno(file);
  }
  else
  {
    // This works for Bun, too, so no need to check for Bun.
    bareResult = await runTscWithNode(file);
  }

  if (!bareResult.stdout)
  {
    printErrorInfo(bareResult, 'tsc produced no output');
    throw new Error('tsc produced no output');
  }

  const checkTimeLine = bareResult.stdout
    .split('\n')
    .find((line) => line.includes('Check time'));

  let checkTime = -1;

  if (!checkTimeLine)
  {
    if (bareResult.tscExitCode === 0)
    {
      const msg = 'FATAL: wtf: cannot parse tsc output, probably a bug in this tool then... 🙄';
      printErrorInfo(bareResult, msg);
      throw new Error(msg);
    }
    // else tsc failed so leave checkTime at -1
  }
  else
  {
    const match = checkTimeLine.match(/([\d.]+)s/);
    const parsed = match && parseFloat(match[1]);

    if (!match || typeof parsed !== 'number')
    {
      const msg = 'FATAL: wtf: cannot parse checkTime from line: ' + checkTimeLine
        + '\n\nVery likely a bug in this tool... 🙄 ';
      printErrorInfo(bareResult, msg);
      throw new Error(msg);
    }
    checkTime = parsed;
  }

  const diagnostics = parseDiagnostics(bareResult.stdout);

  const result: TscExecutionResult = {
    ...bareResult,
    diagnostics,
    checkTime,
  };
  return result;
}
