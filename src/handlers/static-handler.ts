import { resolve } from 'path';
import { existsSync, statSync } from 'fs';

import { Handler } from '../interfaces';

export const StaticHandler: Handler = (request, response): void => {
    const app = request.app;
    const method = request.method.toLowerCase();
    if (method === 'options') {
        return response.send(204);
    }
    if (method === 'get') {
        let pathName = resolve(app.config.publicPath, request.uri);
        if (existsSync(pathName)) {
            if (statSync(pathName).isDirectory()) {
                pathName = resolve(pathName, app.config.index);
            }
            try {
                return response.render(pathName);
            } catch (e) {
                return response.send(500, `Error getting ${request.uri || '/'}`);
            }
        }
        return response.send(404, `Path /${request.uri} not found`);
    }
    response.send(405);
};
