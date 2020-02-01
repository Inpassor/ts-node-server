import { ServerResponse } from 'http';

import { Server } from '../server';

export interface Response extends ServerResponse {
    app: Server;
}
