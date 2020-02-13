import { Route, Handler } from '../interfaces';
import { match } from '../helpers';

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
            if (route.path.match(/^\*+$/)) {
                return route;
            }
            const params = match(route.path, request.uri);
            if (params) {
                request.params = params;
                return route;
            }
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
