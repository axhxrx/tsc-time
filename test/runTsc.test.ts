import { assert, assertEquals, assertGreater, assertNotEquals } from '@std/assert';
import { join } from '@std/path';
import { runTsc } from '../runTsc.ts';

const pathToFixtures = import.meta.resolve('./fixtures/');

// WHYYyyy is the world like this (T_T)
const basePath = pathToFixtures.startsWith('file://')
  ? pathToFixtures.slice(7)
  : pathToFixtures;

const pathToSimpleFile = join(basePath, 'simple-file', 'fizzBuzz.ts');
const pathToSimpleProject = join(basePath, 'simple-project/tsconfig.lib.json');

const resultForFile = await runTsc(pathToSimpleFile);
const resultForProject = await runTsc(pathToSimpleProject);

Deno.test('runTsc against a simple file', () =>
{
  assertEquals(resultForFile.tscExitCode, 0);
});

Deno.test('runTsc against a simple project', () =>
{
  assertEquals(resultForProject.tscExitCode, 0);
});

Deno.test('runTsc against a non-existent file', async () =>
{
  const result = await runTsc(join(basePath, 'non-existent-file', 'fizzBuzz.ts'));
  assertNotEquals(result.tscExitCode, 0);
});

Deno.test('runTsc result comparisons are sane', () =>
{
  assertGreater(resultForFile.checkTime, 0);
  assertGreater(resultForProject.checkTime, 0);

  assertGreater(resultForFile.elapsedMs, 0);
  assertGreater(resultForProject.elapsedMs, 0);

  const linesOfFile = resultForFile.diagnostics['Lines of TypeScript'];
  const linesOfProject = resultForProject.diagnostics['Lines of TypeScript'];

  const f = parseInt(linesOfFile);
  const p = parseInt(linesOfProject);

  assert(typeof f === 'number');
  assert(typeof p === 'number');

  assertGreater(f, 0);
  assertGreater(p, 0);

  assertGreater(p, f, 'expected project compilation to see more lines of TypeScript than the file compilation');
});
