import { match } from 'path-to-regexp';

import { Route, Handler } from '../interfaces';

const methods = [
    'get',
    'post',
    'put',
    'head',
    'delete',
    'options',
    'trace',
    'copy',
    'lock',
    'mkcol',
    'move',
    'purge',
    'propfind',
    'proppatch',
    'unlock',
    'report',
    'mkactivity',
    'checkout',
    'merge',
    'm-search',
    'notify',
    'subscribe',
    'unsubscribe',
    'patch',
    'search',
    'connect',
];

export const routeHandler: Handler = (request, response, next): void => {
    const app = request.app;
    const findRoute = (): Route => {
        const routes = app.config.routes;
        for (const route of routes) {
            try {
                const matchFunction = match(route.path, { encode: encodeURI, decode: decodeURIComponent });
                const matchResult = matchFunction(request.uri);
                if (matchResult) {
                    request.params = { ...matchResult.params };
                    return route;
                }
            } catch (e) {}
        }
    };
    const method = request.method.toLowerCase();
    if (methods.indexOf(method) === -1) {
        return response.send(405);
    }
    const route = findRoute();
    if (route) {
        const component = new route.component(app, request, response);
        const action = component[method] || component['all'];
        if (action) {
            if (route.headers) {
                for (const name in route.headers) {
                    response.setHeader(name, route.headers[name]);
                }
            }
            return action.call(component);
        }
    }
    next();
};
