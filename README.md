# Simple node.js HTTP / HTTPS server

![](https://img.shields.io/npm/v/@inpassor/node-server.svg?style=flat)
![](https://img.shields.io/github/license/Inpassor/ts-node-server.svg?style=flat-square)
![](https://img.shields.io/npm/dt/@inpassor/node-server.svg?style=flat-square)

A simple node.js HTTP / HTTPS server written in pure node.js without Express.

## Installation
```bash
npm install @inpassor/node-server --save
```

## Usage
```typescript
import { Server, Component } from '@inpassor/node-server';
import { ServerConfig } from '@inpassor/node-server/lib/interfaces';
import { readFileSync } from 'fs';
import { resolve } from 'path';

class DemoComponent extends Component {
    public get(): void {
        console.log(this.request.params);
        this.send(200, 'This is the TestComponent GET action');
    }
}

const config: ServerConfig = {
    protocol: 'https', // 'http|https', default: 'http'
    port: 8080, // default: 80
    options: { // ServerOptions for HTTP or HTTPS node.js function createServer, default: {}
        key: readFileSync(resolve(__dirname, 'certificate.key.pem')),
        cert: readFileSync(resolve(__dirname, 'certificate.crt.pem')),
        ca: readFileSync(resolve(__dirname, 'certificate.fullchain.pem')),
    },
    publicPath: 'public', // path to public files, default: 'public'
    index: 'index.html', // index file name, default: 'index.html'
    headers: { // list of headers for all the server responses, default: {}
        'Access-Control-Allow-Methods': 'OPTIONS, GET',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Headers': 'content-type, authorization',
    },
    sameOrigin: true, // when set to true adds headers 'Access-Control-Allow-Origin' equal to request origin header and 'Vary' equal to 'Origin' to all the server responses
    handlers: [], // additional middleware functions (you can also call Server.use method to add middleware after Server instance created)
    routes: [ // routes, handled by Component classes
        {
            path: 'demo/:arg?',
            component: DemoComponent,
        },
    ]
};

const server = new Server(config);

// Add middleware
server.use((request, response, next) => {
    // TODO: some middleware work

    // call next function to pass work to next middleware
    next();

    // or send a response to a client, otherwise, the server will hang till timeout
    // use Server.send or Component.send method in order to send all the needed headers defined in the config
    request.app.send(request, response, 200, 'Some content');
});
```

We had created a Server instance with DemoComponent, having GET and POST methods in the example above.
The route **/demo[/arg]** will be served by DemoComponent.

All the other routes will be served under **publicPath** directory.

A route path is the URI pattern (see [path-to-regex](https://github.com/lastuniverse/path-to-regex#readme) documentation).

## Usage with socket.io
```typescript
import { Server } from '@inpassor/node-server';
import { ServerConfig } from '@inpassor/node-server/lib/interfaces';
import * as socketIO from 'socket.io';

const config: ServerConfig = {};

const server = new Server();

const serverInstance = server.run(config); // instance of HTTP or HTTPS node.js Server

const io = socketIO(serverInstance, {
    handlePreflightRequest: (request, response) => {
        response.writeHead(204, {
            'Access-Control-Allow-Methods': 'OPTIONS, GET',
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Allow-Headers': 'content-type, authorization',
            'Access-Control-Allow-Origin': request.headers.origin,
            Vary: 'Origin',
        });
        response.end();
    },
});
```

## Usage with Firebase Cloud functions

There is no need for HTTP or HTTPS node.js Server instance, since the Firebase Cloud functions create its own server.
We just need to pass the Server handler created via Server.getHandler()

### Common usage
```typescript
import { HttpsFunction, https } from 'firebase-functions';
import { Server } from '@inpassor/node-server';
import { ServerConfig } from '@inpassor/node-server/lib/interfaces';

const firebaseApplication = (config: ServerConfig): HttpsFunction => {
    return https.onRequest((request, response) => {
        const server = new Server(config);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return server.getHandler(request as any, response as any);
    });
};

const config: ServerConfig = {};

export const firebaseFunction = firebaseApplication(config);
```

### Asynchronous Server config, RuntimeOptions
```typescript
import { RuntimeOptions, HttpsFunction, runWith, VALID_MEMORY_OPTIONS } from 'firebase-functions';
import { Server } from '@inpassor/node-server';
import { ServerConfig } from '@inpassor/node-server/lib/interfaces';

const firebaseApplication = (
    getConfig: ServerConfig | Promise<ServerConfig>,
    runtimeOptions?: RuntimeOptions,
): HttpsFunction => {
    return runWith(runtimeOptions).https.onRequest(async (request, response) => {
        await new Promise((resolve, reject) => {
            Promise.resolve(getConfig).then(
                (config): void => {
                    const server = new Server(config);
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    resolve(server.getHandler(request as any, response as any));
                },
                error => reject(error),
            );
        });
    });
};

const config: ServerConfig = {};

export const firebaseFunction = firebaseApplication(config, {
    timeoutSeconds: 10,
    memory: VALID_MEMORY_OPTIONS['256MB'],
});
```
