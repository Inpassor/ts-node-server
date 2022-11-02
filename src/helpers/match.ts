import { Params } from 'interfaces';

export const match = (pattern: string, string: string): Params => {
  const regex = pattern
    .replace(/</g, '(?<')
    .replace(/\(\?<\//g, '/?(?<')
    .replace(/\|n\?>/g, '>[0-9-_]*)')
    .replace(/\|l\?>/g, '>[a-zA-Z]*)')
    .replace(/\|\?>/g, '>[a-zA-Z0-9-_]*)')
    .replace(/\|n>/g, '>[0-9]+)')
    .replace(/\|l>/g, '>[a-zA-Z]+)')
    .replace(/>(?!\[)/g, '>[a-zA-Z0-9-_]+)');
  const execResult = new RegExp(`^${regex}$`).exec(
    string.replace(/^\/+|\/+$/g, '')
  );
  const result: Params = (execResult && { ...execResult.groups }) || null;
  if (result) {
    const decimalKeys = pattern.match(/<\/?([a-zA-Z0-9]+)\|n\??>/g);
    if (decimalKeys && decimalKeys.length) {
      decimalKeys.forEach((decimalKey) => {
        const key = decimalKey
          .replace('</', '')
          .replace('<', '')
          .replace('|n>', '')
          .replace('|n?>', '');
        if (result[key]) {
          result[key] = +result[key];
        }
      });
    }
  }
  return result;
};
