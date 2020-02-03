import { ServerOptions as HttpServerOptions } from 'http';
import { ServerOptions as HttpsServerOptions } from 'https';

import { Handler } from './handler';
import { Route } from './route';
import { RenderFunction } from './render-function';

export interface ServerConfig {
    protocol?: 'http' | 'https';
    port?: number;
    options?: HttpServerOptions | HttpsServerOptions;
    publicPath?: string;
    index?: string;
    mimeTypes?: { [extension: string]: string };
    headers?: { [name: string]: string };
    sameOrigin?: boolean;
    handlers?: Handler[];
    routes?: Route[];
    renderers?: { [extension: string]: RenderFunction };
}
