import { ServerResponse } from 'http';

import { Server } from './server';
import { Request } from './request';
import { Renderer } from './renderer';
import { httpStatusList } from './helpers';

export class Response extends ServerResponse {
    public app: Server;
    public request: Request;

    public init(config: { app: Server; request: Request }): void {
        Object.assign(this, config);
    }

    public send(status: number, body?): void {
        const headers = { ...this.app.config.headers };
        if (this.app.config.sameOrigin && this.request.headers.origin) {
            headers['Access-Control-Allow-Origin'] = this.request.headers.origin as string;
            headers.Vary = 'Origin';
        }
        this.writeHead(status, headers);
        this.end(body);
    }

    public sendError(error): void {
        const code = Response.getCodeFromError(error);
        const body = Response.getMessageFromError(error);
        this.send(code, body);
    }

    public getCodeFromError;

    public static getCodeFromError(error): number {
        const defaultCode = 500;
        if (typeof error === 'string') {
            return defaultCode;
        }
        const e = error.error || error;
        return (e.code as number) || defaultCode;
    }

    public getMessageFromError;

    public static getMessageFromError(error): string {
        if (typeof error === 'string') {
            return error;
        }
        let message = 'An unexpected error occurred';
        const e = error.error || error;
        if (e) {
            if (e.message) {
                message = e.message;
            } else {
                const code = Number(e.code || e);
                if (httpStatusList.hasOwnProperty(code)) {
                    message = httpStatusList[code];
                }
            }
        }
        return message;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public render(fileName: string, params?: { [key: string]: any }): void {
        const renderer = new Renderer(this.app, fileName);
        const body = renderer.render(params);
        this.setHeader('Content-Type', renderer.mimeType);
        this.setHeader('Content-Length', renderer.size);
        this.send(200, body);
    }
}
