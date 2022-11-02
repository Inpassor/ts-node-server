import { resolve } from 'node:path';

export const resolvePath = (...pathSegments: (string | string[])[]): string =>
  resolve(...[].concat(...pathSegments));
