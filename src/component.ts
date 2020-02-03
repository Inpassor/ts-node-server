import { Request } from './request';
import { Response } from './response';
import { Server } from './server';

export class Component {
    constructor(public app: Server, public request: Request, public response: Response) {}
}
