import type { TscExecutionResult } from './TscExecutionResult.ts';

export function printErrorInfo(result: TscExecutionResult, additionalInfo?: string): void
{
  const isTscError = result.tscExitCode !== 0;

  if (isTscError)
  {
    console.error(`tsc exited with exit code ${result.tscExitCode}: ${result.stderr}`);
  }
  else
  {
    console.error('tsc exited with code 0, but an error occurred:');
  }

  if (additionalInfo)
  {
    console.error(additionalInfo);
  }

  const jsonResult = JSON.stringify(result, null, 2);
  console.error(jsonResult);
}
