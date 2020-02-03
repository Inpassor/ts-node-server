import { MimeTypes } from './helpers';
import { readFileSync } from 'fs';
import { parse } from 'path';
import { Server } from './server';

export class Renderer {
    public mimeType: string;
    public size: number;

    private extension: string;
    private template: string;

    constructor(private app: Server, private fileName: string) {
        this.init();
    }

    private init(): void {
        const extension = parse(this.fileName).ext;
        this.extension = extension.slice(1, extension.length);
        this.mimeType = MimeTypes[this.extension] || this.app.config.mimeTypes[this.extension] || 'text/plain';
        this.template = readFileSync(this.fileName).toString();
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public render(params?: { [key: string]: any }): string {
        const renderer = this.app.config.renderers[this.extension];
        const body = renderer ? renderer(this.template, params) : this.template;
        this.size = body.length;
        return body;
    }
}
