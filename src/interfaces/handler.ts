import { Request } from './request';
import { Response } from './response';

export interface Handler {
    (request: Request, response: Response, next: () => void): void;
}
