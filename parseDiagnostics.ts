/**
 Parse the tsc output to get the diagnostics as JSON.
 */
export function parseDiagnostics(output: string): Record<string, unknown>
{
  const lines = output.split('\n');
  const diagnostics: Record<string, unknown> = {};
  let key: string | null = null;

  for (const line of lines)
  {
    const components = line.split(': ');
    if (components.length === 2)
    {
      key = components[0].trim();
      diagnostics[key] = components[1].trim();
    }
    // Just ignore it, for now.
    // else
    // {
    //   console.warn(`parseDiagnostics(): Skipping weird line: ${line}`);
    // }
  }

  return diagnostics;
}
