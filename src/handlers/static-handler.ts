import { existsSync, statSync } from 'fs';

import { Handler } from '../interfaces';
import { resolvePath } from '../helpers';

export const staticHandler: Handler = (request, response, next): void => {
    const app = request.app;
    const method = request.method.toLowerCase();
    if (method === 'options') {
        return response.send(204);
    }
    let pathName = resolvePath(app.config.publicPath, request.uri);
    if (existsSync(pathName)) {
        const isDirectory = statSync(pathName).isDirectory();
        if (isDirectory) {
            pathName = resolvePath(pathName, app.config.index);
        }
        if (method === 'get') {
            try {
                return response.renderFile(pathName);
            } catch {
                if (!isDirectory) {
                    return response.send(500, `Error getting /${request.uri}`);
                }
            }
        } else {
            return response.send(405);
        }
    }
    if (app.config.routes.length) {
        const lastRoute = app.config.routes[app.config.routes.length - 1];
        if (lastRoute.path === '*') {
            const component = new lastRoute.component(app, request, response);
            const action = component[method] || component['all'];
            if (action) {
                if (lastRoute.headers) {
                    for (const name in lastRoute.headers) {
                        response.setHeader(name, lastRoute.headers[name]);
                    }
                }
                return action.call(component);
            }
            return response.send(405);
        }
    }
    next();
};
