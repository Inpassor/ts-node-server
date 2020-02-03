import { createServer as createHttpServer, Server as HttpServer } from 'http';
import { createServer as createHttpsServer, Server as HttpsServer } from 'https';
import { parse } from 'url';

import { ServerConfig, Handler } from './interfaces';
import { RouteHandler, StaticHandler } from './handlers';
import { Request } from './request';
import { Response } from './response';
import { Logger } from './helpers';

export class Server {
    constructor(public config: ServerConfig = {}) {
        this.init();
    }

    private init(): void {
        this.config = {
            protocol: 'http',
            port: 80,
            options: {},
            publicPath: 'public',
            index: 'index.html',
            mimeTypes: {},
            headers: {},
            sameOrigin: false,
            handlers: [],
            routes: [],
            renderers: {},
            ...this.config,
        };
    }

    private handle(request: Request, response: Response): void {
        const parsedUrl = parse(request.url).pathname;
        request.init({
            app: this,
            uri: parsedUrl.slice(1, parsedUrl.length),
        });
        response.init({
            app: this,
            request,
        });
        const handlers = [...this.config.handlers, RouteHandler, StaticHandler];
        let handler;
        const next = (): void => {
            handler = handlers.shift();
            handler(request, response, next);
        };
        next();
    }

    public run(): HttpServer | HttpsServer {
        if (process.env.NODE_ENV !== 'production') {
            const portToLog = this.config.port !== 80 ? `:${this.config.port}` : '';
            Logger.log(`** Live Development Server is on ${this.config.protocol}://localhost${portToLog} **`);
        }

        Logger.log('Starting server');
        Logger.log(`Using ${this.config.protocol} protocol`);
        Logger.log(`Listening port ${this.config.port}`);

        return (this.config.protocol === 'https'
            ? createHttpsServer(this.config.options, this.handle.bind(this))
            : createHttpServer(this.config.options, this.handle.bind(this))
        ).listen(this.config.port);
    }

    public getHandler(request: Request, response: Response): Handler {
        const handler: Handler = (request, response, next): void => next();
        this.use(handler);
        this.handle(request, response);
        return handler;
    }

    public use(handler: Handler): void {
        if (!this.config.handlers.find(h => h === handler)) {
            this.config.handlers.push(handler);
        }
    }
}
