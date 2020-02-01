import { ServerOptions } from 'http';
import { isHttpsServerOptions } from './is-https-server-options';

export const isHttpServerOptions = (arg): arg is ServerOptions => {
    return (arg.IncomingMessage || arg.ServerResponse) && !isHttpsServerOptions;
};
