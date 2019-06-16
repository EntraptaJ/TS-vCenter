// src/API/loader.ts
// Kristian Jones <me@kristianjones.xyz>
import 'reflect-metadata';
import { readJSON } from 'fs-extra';
import klaw from 'klaw';
import { parse } from 'path';
import pEvent from 'p-event';

const resolvers: Function[] = [];

/**
 * Iterate through API looking for API.json to load Type-GraphQL Resolvers.
 */
export async function getResolvers(): Promise<Function[]> {
  let walk = klaw(__dirname);
  const files: AsyncIterableIterator<klaw.Item> = pEvent.iterator(walk, 'data', {
    resolutionEvents: ['end'],
  });

  for await (const file of files) {
    const parsed = parse(file.path);
    const fileName = parsed.base;
    if (fileName === 'API.json') {
      const config = await readJSON(file.path);
      if (config.entrypoint) {
        const { default: resolver } = (await import(`${parsed.dir}/${config.entrypoint}`)) as { default: Function };
        resolvers.push(resolver);
      }
    }
  }

  return resolvers;
}
