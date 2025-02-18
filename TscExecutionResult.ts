/**
 An intermediate structure that can be used to construct a `TscExecutionResult`. Does not contain the diagnostics or checkTime fields.
 */
export interface TscExecutionResultBare
{
  /**
   The exit code of `tsc`.
   */
  tscExitCode: number;

  /**
   Elapsed time in milliseconds, as perceived by the runtime executing `tsc` as a subprocess (e.g., Deno, Bun, Node, etc)
   */
  elapsedMs: number;

  /**
   The standard output of `tsc`, as a string.
   */
  stdout: string;

  /**
   The standard error of `tsc`, as a string.
   */
  stderr: string;

  /**
   A string representation of the command line that was run to invoke `tsc`. E.g.:
   ```
   'npx tsc --strict true --target esnext /Volumes/HOHOHO/my-project/libs/ts/core/foo-auth/tsconfig.lib.json.ts --allowImportingTsExtensions --noEmit --extendedDiagnostics'
   */
  tscCommand: string;
}

/**
 This structure encapsulates the output of `tsc` in a single run. Note that this structure is for the results regardless of whether `tsc` succeeded or failed. So, you may want to check `tscExitCode` to see if `tsc` succeeded (exit code 0) or failed (non-zero), depending what you want to do with the results. Although tsc emits diagnostics sometimes even when it fails, the results may be weird/incomplete in that case.
 */
export type TscExecutionResult = Omit<TscExecutionResultBare, 'diagnostics' | 'checkTime'> & {
  /**
   A best-effort attempt to parse the diagnostics, if any, from `tsc`. May not be present if `tsc` emitted no diagnostics or if an error occurred while parsing the diagnostics. Example (as of 2025-02-18 and `tsc Version 5.8.0-dev.20250218`):

   ```json
     diagnostics: {
    Files: "858",
    "Lines of Library": "38846",
    "Lines of Definitions": "75228",
    "Lines of TypeScript": "15172",
    "Lines of JavaScript": "0",
    "Lines of JSON": "0",
    "Lines of Other": "0",
    Identifiers: "115591",
    Symbols: "104179",
    Types: "20856",
    Instantiations: "12276",
    "Memory used": "165137K",
    "Assignability cache size": "7573",
    "Identity cache size": "69",
    "Subtype cache size": "274",
    "Strict subtype cache size": "135",
    "I/O Read time": "0.14s",
    "Parse time": "0.19s",
    "ResolveModule time": "0.40s",
    "ResolveLibrary time": "0.01s",
    "ResolveTypeReference time": "0.00s",
    "Program time": "0.77s",
    "Bind time": "0.10s",
    "Check time": "0.29s",
    "transformTime time": "0.23s",
    "printTime time": "0.00s",
    "Emit time": "0.00s",
    "Total time": "1.17s"
  }
  ```
  */
  diagnostics: Record<string, string>;

  /**
   The amount of time it took to run `tsc` and check the program, parsed from the diagnostics.
   */
  checkTime: number;
};
