# tsc-time

This library is intended to help measure the time it takes to run `tsc` and type check a given file or project. 

It exports one function, `runTsc()`, which takes a TypeScript file or project path and runs `tsc` on it, with the `--allowImportingTsExtensions --noEmit --extendedDiagnostics` options.

Regardless of whether `tsc` succeeds or fails, `runTsc()` should return a `TscExecutionResult` object describing the result.

You can run this in test code, or on the command line, like so:

```ts
const result = await runTsc('some-path/tsconfig.lib.json');
console.log(result);
```

 Example result:
 ```ts
  {
    tscExitCode: 0,
    elapsedMs: 1576.915708,
    stdout: "Files: <blah blah blah omitted>...",
    stderr: "",
    tscCommand: "npx tsc --strict true --target esnext --project /Volumes/HOGINATOR/some-path/tsconfig.lib.json --allowImportingTsExtensions --noEmit --extendedDiagnostics",
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
    checkTime: 0.32
  }
```

Or you can do e.g.:

```text
deno run --allow-read --allow-run  https://jsr.io/@axhxrx/tsc-time/0.0.1/mod.ts some-file.ts
```
...and the equivalent output will be printed to the console in JSON-parseable format.

## The checkTime property

Because the main point of this lib is to measure the type-checking time (in order write automated tests to guard against inadvertent regressions in that area), the `checkTime` property is included in the result. Other diagnostics, you have to parse yourself, from the `diagnostics` property.


## Happenings
🤦‍♂️ 2025-02-20: Fix bug with missing import, leftover test code
👹 2025-02-19: release 0.0.4 with bug fix for non-JSON CLI output (and maybe legaprise Node env fix, if that actually works)
🎅 2025-02-18: release 0.0.3 on JSR, removing inline ESM-incompatible inline import of node entity
🎅 2025-02-18: release 0.0.2 on JSR
🤖 2025-02-17: repo initialized by Bottie McBotface bot@axhxrx.com
