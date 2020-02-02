import { match } from 'path-to-regexp';

import { Route, ComponentAction, Handler } from '../interfaces';

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
    'all',
];

export const RouteHandler: Handler = (request, response, next): void => {
    const app = request.app;
    const findRoute = (): Route => {
        const routes = app.config.routes;
        for (const route of routes) {
            const matchFunction = match(route.path, { decode: decodeURIComponent });
            const matchResult = matchFunction(request.uri);
            if (matchResult) {
                request.params = { ...matchResult.params };
                return route;
            }
        }
    };
    if (methods.indexOf(request.method) === -1) {
        return app.send(request, response, 405);
    }
    const route = findRoute();
    if (!route) {
        return next();
    }
    const component = new route.component({
        app,
        request,
        response,
    });
    const action: ComponentAction = component[request.method] || component['all'];
    if (action) {
        return action.call(component, next);
    }
    next();
};
