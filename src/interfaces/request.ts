import { IncomingMessage } from 'http';

import { Server } from '../server';

export interface Request extends IncomingMessage {
    app: Server;
    uri: string;
    params: { [name: string]: string | number };
    searchParams: URLSearchParams;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    body: any;
}
