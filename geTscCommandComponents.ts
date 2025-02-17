/**
 Given a relative or absolute path to a .ts or a tsconfig.json file (any file ending with ".json" is assumed to be a tsconfig, so e.g. "./tsconfig.lib.json" is fine), returns an array of command line arguments that can be used to run tsc on that file. The args are hardcoded for the purpose of this tool.
 */
export function getTscCommandComponents(file: string, npx = true): string[]
{
  const isJson = file.endsWith('.json');
  const npxArgs = npx ? ['npx'] : [];

  const otherArgs = [
    'tsc',
    '--strict',
    'true',
    '--target',
    'esnext',
    ...(isJson ? ['--project', file] : [file]),
    '--allowImportingTsExtensions',
    '--noEmit',
    '--extendedDiagnostics',
  ];

  return [...npxArgs, ...otherArgs];
}
