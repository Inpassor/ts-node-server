import { createServer as createHttpServer, Server as HttpServer } from 'http';
import { createServer as createHttpsServer, Server as HttpsServer } from 'https';

import { ServerConfig, Handler, Request, Response } from './interfaces';
import { routeHandler, staticHandler } from './handlers';
import { ResponseMixin, Logger } from './helpers';

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
            maxBodySize: 2097152, // 2Mb
            ...this.config,
        };
    }

    public handle(request: Request, response: Response): void {
        const url = new URL(request.url, `http://${request.headers.host}`);
        const pathname = url.pathname;
        Object.assign(request, {
            app: this,
            uri: pathname.slice(1, pathname.length),
            params: {},
            searchParams: url.searchParams,
            body: '',
        });
        request.on('data', data => {
            request.body += data;
            if (request.body.length > this.config.maxBodySize) {
                request.connection.destroy();
            }
        });
        Object.assign(
            response,
            {
                app: this,
                request,
            },
            ResponseMixin,
        );
        const handlers = [...this.config.handlers, routeHandler, staticHandler];
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

    public use(handler: Handler): void {
        if (!this.config.handlers.find(h => h === handler)) {
            this.config.handlers.push(handler);
        }
    }
}
