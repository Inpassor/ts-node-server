export const match = (pattern: string, string: string): { [key: string]: string | number } => {
    const regex = pattern
        .replace(/</g, '(?<')
        .replace(/\(\?<\//g, '/?(?<')
        .replace(/\|\?>/g, '>[a-zA-Z0-9-_]*)')
        .replace(/\|n>/g, '>[0-9]+)')
        .replace(/\|l>/g, '>[a-zA-Z]+)')
        .replace(/>(?!\[)/g, '>[a-zA-Z0-9-_]+)');
    const execResult = new RegExp(`^${regex}$`).exec(string.replace(/^\/+|\/+$/g, ''));
    const result: { [key: string]: string | number } = (execResult && { ...execResult.groups }) || null;
    if (result) {
        const decimalKeys = pattern.match(/<([a-zA-Z0-9]+)\|n>/g);
        if (decimalKeys && decimalKeys.length) {
            decimalKeys.forEach(decimalKey => {
                const key = decimalKey.replace('<', '').replace('|n>', '');
                if (result[key]) {
                    result[key] = +result[key];
                }
            });
        }
    }
    return result;
};
