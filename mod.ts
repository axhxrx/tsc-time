export * from './runTsc.ts';
export * from './runTscWithNodeSubprocessThatRunsDeno.ts';

import { main } from './main.ts';

if (import.meta.main)
{
  await main();
}
