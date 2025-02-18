// Deno is our jam, but because we want this to run under Bun and Node also, lets use modly old `process` which they all support:
import process from 'node:process';

import { runTsc } from './runTsc.ts';

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
