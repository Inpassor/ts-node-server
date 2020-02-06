import { resolve } from 'path';

export const resolvePath = (...pathSegments): string => {
    return resolve(...[].concat(...pathSegments));
};
