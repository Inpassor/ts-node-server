export const match = (pattern: string, string: string): { [key: string]: string | number } => {
    const regex = pattern
        .replace(/</g, '(?<')
        .replace(/\|d>/g, '>[0-9]+)')
        .replace(/\|s>/g, '>[a-zA-Z]+)')
        .replace(/>(?!\[)/g, '>[a-zA-Z0-9]+)');
    const execResult = new RegExp(regex).exec(string);
    const result: { [key: string]: string | number } = (execResult && { ...execResult.groups }) || null;
    if (result) {
        const decimalKeys = pattern.match(/<([a-zA-Z0-9]+)\|d>/g);
        if (decimalKeys && decimalKeys.length) {
            decimalKeys.forEach(decimalKey => {
                const key = decimalKey.replace('<', '').replace('|d>', '');
                if (result[key]) {
                    result[key] = +result[key];
                }
            });
        }
    }
    return result;
};
