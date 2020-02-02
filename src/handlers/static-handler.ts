import { resolve, parse as parsePath } from 'path';
import { existsSync, statSync, readFileSync } from 'fs';

import { Handler } from '../interfaces';
import { MimeTypes } from '../helpers';

export const StaticHandler: Handler = (request, response): void => {
    const app = request.app;
    if (request.method === 'options') {
        return app.send(request, response, 204);
    }
    if (request.method === 'get') {
        let pathName = resolve(app.config.publicPath, request.uri);
        let extension = parsePath(request.uri).ext;
        extension = extension.slice(1, extension.length);
        if (existsSync(pathName)) {
            if (statSync(pathName).isDirectory()) {
                pathName = resolve(pathName, app.config.index);
                extension = 'html';
            }
            try {
                const body = readFileSync(pathName);
                response.setHeader('Content-Type', MimeTypes[extension] || 'text/plain');
                return app.send(request, response, 200, body);
            } catch (e) {
                return app.send(request, response, 500, `Error getting ${request.uri || '/'}`);
            }
        }
        return app.send(request, response, 404, `Path /${request.uri} not found`);
    }
    app.send(request, response, 405);
};
