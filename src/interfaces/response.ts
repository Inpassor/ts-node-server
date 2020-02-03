import { ServerResponse } from 'http';

import { Server } from '../server';
import { Request } from './request';

export interface Response extends ServerResponse {
    app: Server;
    request: Request;
    send: (status: number, body?) => void;
    sendError: (error) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    render: (fileName: string, params?: { [key: string]: any }) => void;
}
