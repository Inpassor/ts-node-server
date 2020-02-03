import { Request, Response } from './interfaces';
import { Server } from './server';

export class Component {
    constructor(public app: Server, public request: Request, public response: Response) {}
}
