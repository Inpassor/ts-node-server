import { Request } from './request';
import { Response } from './response';

export interface RequestHandler {
    (request: Request, response: Response, next: () => void): void;
}
