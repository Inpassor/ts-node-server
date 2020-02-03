import { resolve } from 'path';
import { existsSync, statSync } from 'fs';

import { Handler } from '../interfaces';

export const StaticHandler: Handler = (request, response): void => {
    const app = request.app;
    const method = request.method.toLowerCase();
    if (method === 'options') {
        return app.send(request, response, 204);
    }
    if (method === 'get') {
        let pathName = resolve(app.config.publicPath, request.uri);
        if (existsSync(pathName)) {
            if (statSync(pathName).isDirectory()) {
                pathName = resolve(pathName, app.config.index);
            }
            try {
                return app.render(request, response, pathName);
            } catch (e) {
                return app.send(request, response, 500, `Error getting ${request.uri || '/'}`);
            }
        }
        return app.send(request, response, 404, `Path /${request.uri} not found`);
    }
    app.send(request, response, 405);
};
