import * as child_process from 'node:child_process';

let pathToModTs = import.meta.resolve('./mod.ts');
if (pathToModTs.startsWith('file://'))
{
  pathToModTs = pathToModTs.slice(7);
}
console.log({ pathToModTs });

/**
 Spawns a subprocess with Node (or Bun) that runs Deno as a separate process, then reads the output and parses it as JSON and returns that object.

 NOTE: This is usable when you are inside a Node project that isn't using ESM. Like if you have some crusty old monorepo with some Angular apps in it and a bunch of CommonJS dependencies.

 Why would you use this instead of just running this lib with Deno directly? Especially since this anyway still requires Deno to be installed on the local machine?

 The only reason is that you want to use this within a Node test (e.g. a Jest test) inside a legacy CommonJS-dependent project. Otherwise, indeed, just run `deno run --allow-read --allow-run  https://jsr.io/@axhxrx/tsc-time/0.0.4/mod.ts libs/ts/my-cool-lib/tsconfig.lib.json` on the CLI and check the output.
 */
export function runTscWithExtendedDiagnostics(
  tsConfigOrTsFilePath: string,
): Record<string, string>
{
  const { status, stdout: rawStdout, stderr: rawStderr } = child_process.spawnSync('deno', [
    'run',
    '--allow-read',
    '--allow-run',
    pathToModTs,
    tsConfigOrTsFilePath,
  ]);

  const stdout = new TextDecoder().decode(rawStdout);
  const stderr = new TextDecoder().decode(rawStderr);

  if (status !== 0)
  {
    throw new Error(
      `Deno subprocess (that was trying to run tsc as a subprocess) exited with code ${status}:\n${stderr}\n${stdout}`,
    );
  }

  return JSON.parse(stdout);
}
