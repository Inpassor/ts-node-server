import { IncomingMessage } from 'http';

import { Server } from '../server';
import { Params } from './params';

export interface Request extends IncomingMessage {
  app: Server;
  uri: string;
  params: Params;
  searchParams: URLSearchParams;
  body: string;
}
