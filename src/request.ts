import { IncomingMessage } from 'http';

import { Server } from './server';

export class Request extends IncomingMessage {
    public app: Server;
    public uri: string;
    public params: { [param: string]: string } = {};

    public init(config: { app: Server; uri: string }): void {
        Object.assign(this, config);
    }
}
