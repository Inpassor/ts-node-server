import { ServerResponse } from 'http';

import { Server } from '../server';
import { Request } from './request';
import { Params } from './params';

export interface Response extends ServerResponse {
  app: Server;
  request: Request;
  send: (status: number, body?: string) => void;
  sendJSON: (data: string) => void;
  sendError: (error: unknown) => void;
  render: (
    template: string | Buffer,
    extension: string,
    params?: Params
  ) => void;
  renderFile: (pathSegments: string | string[], params?: Params) => void;
}
