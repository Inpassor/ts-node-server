import { getCodeFromError } from './get-code-from-error';
import { getMessageFromError } from './get-message-from-error';
import { Renderer } from '../renderer';

export const ResponseMixin = {
    send: function(status: number, body?): void {
        const headers = { ...this.app.config.headers };
        if (this.app.config.sameOrigin && this.request.headers.origin) {
            headers['Access-Control-Allow-Origin'] = this.request.headers.origin as string;
            headers.Vary = 'Origin';
        }
        this.writeHead(status, headers);
        this.end(body);
    },

    sendError: function(error): void {
        const code = getCodeFromError(error);
        const body = getMessageFromError(error);
        this.send(code, body);
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    render: function(fileName: string, params?: { [key: string]: any }): void {
        const renderer = new Renderer(this.app, fileName);
        const body = renderer.render(params);
        this.setHeader('Content-Type', renderer.mimeType);
        this.setHeader('Content-Length', renderer.size);
        this.send(200, body);
    },
};
