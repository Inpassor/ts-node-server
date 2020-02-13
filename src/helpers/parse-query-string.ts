export const parseQueryString = (uri: string): { [key: string]: string } => {
    const result = {};
    if (uri) {
        const position = uri.indexOf('?');
        const uriParts = uri.substr(position + 1).split('&');
        for (const uriPart of uriParts) {
            const parts = uriPart.split('=');
            result[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1]) || null;
        }
    }
    return result;
};
