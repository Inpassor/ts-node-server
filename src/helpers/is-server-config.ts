import { ServerConfig } from '../interfaces';

export const isServerConfig = (arg): arg is ServerConfig => {
    return (
        arg.protocol ||
        arg.port ||
        arg.options ||
        arg.publicPath ||
        arg.index ||
        arg.mimeTypes ||
        arg.headers ||
        (arg.handlers && arg.handlers.length) ||
        (arg.routes && arg.routes.length) ||
        arg.renderers ||
        arg.bodyParsers ||
        arg.maxBodySize
    );
};
