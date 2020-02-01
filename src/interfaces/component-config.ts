import { Request, Response } from '../interfaces';
import { Server } from '../server';

export interface ComponentConfig {
    app: Server;
    request: Request;
    response: Response;
}
