import { Request, Response } from './interfaces';
import { httpStatusList } from './helpers';
import { Server } from './server';

export class Component {
    constructor(public app: Server, public request: Request, public response: Response) {}

    public send(status: number, body?): void {
        this.app.send(this.request, this.response, status, body);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public render(fileName: string, params?: { [key: string]: any }): void {
        this.app.render(this.request, this.response, fileName, params);
    }

    public sendError(error): void {
        const code = Component.getCodeFromError(error);
        const body = Component.getMessageFromError(error);
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
}
