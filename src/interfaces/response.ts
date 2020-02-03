import { ServerResponse } from 'http';

import { Server } from '../server';

export interface Response extends ServerResponse {
    app: Server;
    send: (status: number, body?) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    render: (fileName: string, params?: { [key: string]: any }) => void;
}
