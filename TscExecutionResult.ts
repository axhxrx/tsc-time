export interface TscExecutionResult
{
  code: number;
  checkTime: number;
  elapsedMs: number;
  stdout: string;
  stderr: string;
  tscCommand: string;
}
