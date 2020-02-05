import { ServerResponse } from 'http';

import { Server } from '../server';
import { Request } from './request';

export interface Response extends ServerResponse {
    app: Server;
    request: Request;
    send: (status: number, body?) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sendJSON: (data: { [key: string]: any }) => void;
    sendError: (error) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    render: (template: string, extension: string, params?: { [key: string]: any }) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    renderFile: (fileName: string, params?: { [key: string]: any }) => void;
}
