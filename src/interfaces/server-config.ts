import { ServerOptions as HttpServerOptions } from 'http';
import { ServerOptions as HttpsServerOptions } from 'https';

import { Handler } from './handler';
import { Route } from './route';
import { Renderer } from './renderer';
import { BodyParser } from './body-parser';

export interface ServerConfig {
  protocol?: 'http' | 'https';
  port?: number;
  options?: HttpServerOptions | HttpsServerOptions;
  publicPath?: string | string[];
  index?: string;
  mimeTypes?: Record<string, string>;
  headers?: Record<string, string>;
  sameOrigin?: boolean;
  handlers?: Handler[];
  routes?: Route[];
  renderers?: Record<string, Renderer>;
  bodyParsers?: Record<string, BodyParser>;
  maxBodySize?: number;
}
