import { resolve } from 'path';

export const resolvePath = (...pathSegments): string => resolve(...[].concat(...pathSegments));
