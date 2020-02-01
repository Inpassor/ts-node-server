import { IncomingMessage } from 'http';

import { RouteParams } from './route-params';
import { Server } from '../server';

export interface Request extends IncomingMessage {
    app: Server;
    uri: string;
    params?: RouteParams;
}
