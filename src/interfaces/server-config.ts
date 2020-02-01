import { ServerOptions as HttpServerOptions } from 'http';
import { ServerOptions as HttpsServerOptions } from 'https';

import { RequestHandler } from './request-handler';
import { Route } from './route';

export interface ServerConfig {
    protocol?: 'http' | 'https';
    port?: number;
    options?: HttpServerOptions | HttpsServerOptions;
    publicPath?: string;
    index?: string;
    headers?: { [name: string]: string };
    sameOrigin?: boolean;
    handlers?: RequestHandler[];
    routes?: Route[];
    // viewsPath?: string;
    // viewsExtension?: string;
}
