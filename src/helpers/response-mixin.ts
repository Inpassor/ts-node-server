import { parse } from 'path';
import { readFileSync } from 'fs';

import { getCodeFromError } from './get-code-from-error';
import { getMessageFromError } from './get-message-from-error';
import { mimeTypes } from './mime-types';
import { resolvePath } from './resolve-path';

export const ResponseMixin = {
    send: function(status: number, body?): void {
        const headers = { ...this.app.config.headers };
        if (this.app.config.sameOrigin && this.request.headers.origin) {
            headers['Access-Control-Allow-Origin'] = this.request.headers.origin as string;
            headers.Vary = 'Origin';
        }
        if (body) {
            this.setHeader('Content-Length', body.length);
        }
        this.writeHead(status, headers);
        this.end(body);
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sendJSON: function(data: any): void {
        const body = JSON.stringify(data);
        this.setHeader('Content-Type', 'application/json');
        this.send(200, body);
    },

    sendError: function(error): void {
        const code = getCodeFromError(error);
        const body = getMessageFromError(error);
        this.send(code, body);
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    render: function(template: string | Buffer, extension: string, params?: { [key: string]: any }): void {
        const mimeType = mimeTypes[extension] || this.app.config.mimeTypes[extension] || 'text/plain';
        let body = template;
        const renderer = this.app.config.renderers[extension];
        if (renderer) {
            const templateString = typeof template === 'string' ? template : template.toString();
            body = renderer(templateString, params);
        }
        this.setHeader('Content-Type', mimeType);
        this.send(200, body);
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    renderFile: function(pathSegments: string | string[], params?: { [key: string]: any }): void {
        const fileName = resolvePath(pathSegments);
        let extension = parse(fileName).ext;
        extension = extension.slice(1, extension.length);
        const template = readFileSync(fileName);
        this.render(template, extension, params);
    },
};
