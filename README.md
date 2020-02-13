# Simple node.js HTTP / HTTPS server

[![](https://img.shields.io/npm/v/@inpassor/node-server.svg?style=flat)](https://www.npmjs.com/package/@inpassor/node-server)
[![](https://img.shields.io/github/license/Inpassor/ts-node-server.svg?style=flat-square)](https://github.com/Inpassor/ts-node-server/blob/master/LICENSE)
![](https://img.shields.io/npm/dt/@inpassor/node-server.svg?style=flat-square)

A simple HTTP / HTTPS server written in pure node.js without Express.

This library is designed to be minimalistic, quick and powerful at once.
It includes two built-in middleware functions: **staticHandler** and **routeHandler**.
They act one after another. First, **staticHandler**, then **routeHandler**.
You can implement any number of middleware functions. They will be served first.

**staticHandler** serves static files under a public directory.
It looks for directories/files by URI. If URI matches an existing directory,
**staticHandler** looks for an index file within it.
The library determines a few MIME types by a file extension.
You can define additional MIME types in the **Server** config.

If URI does not match any public directory/file the Server runs **routeHandler**.

**routeHandler** serves routes and runs user-implemented Components.
You can implement any REST method within Component.
Routes are defined in the **Server** config.

## Installation
```bash
npm install @inpassor/node-server --save
```

## Usage

### Server [class]
```constructor(config?: ServerConfig)```

Creates a **Server** instance with a given config.
If config is omitted default options are used.

**ServerConfig** is an object with any set of these options:

- ```protocol: 'http' | 'https'``` (default: **'http'**) - a protocol to be used by a server.
    Depending on it a corresponding server instance will be created:
    **HttpServer** or **HttpsServer**.
- ```port: number``` (default: **80**) - a port to be used by a server.
- ```options: HttpServerOptions | HttpsServerOptions``` (default: **{}**) - options to pass
    to **createServer** function.
- ```publicPath: string | string[]``` (default: **'public'**) - a directory to be served by
    **staticHandler**. Automatically resolves by **path.resolve** function.
- ```index: string``` (default: **'index.html'**) - an index file name to be served by
    **staticHandler**. If URI matches an existing directory
    under **publicPath** directory, **staticHandler** is looking for this file
    within this directory and renders it by a corresponding renderer.
    A renderer is determined by an index file extension.
- ```mimeTypes: { [extension: string]: string }``` (default: **{}**) - additional
    MIME types by extension. For example:
    ```
    {
        mp3: 'audio/mpeg',
        pdf: 'application/pdf',
        doc: 'application/msword',
    }
    ```
- ```headers: { [name: string]: string }``` (default: **{}**) - list of headers for
    all the server responses. For example:
    ```
    {
        'Access-Control-Allow-Methods': 'OPTIONS, GET, POST',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Headers': 'content-type, authorization',
    }
    ```
- ```sameOrigin: boolean``` (default: **false**) - when set to true adds headers
    **Access-Control-Allow-Origin** equal to request **Origin** header
    and **Vary** equal to 'Origin' to all the server responses.
    If a request does not contain **Origin** header, headers **Access-Control-Allow-Origin**
    and **Vary** are not added.
- ```handlers: Handler[]``` (default: **[]**) - additional middleware functions.

    **Handler** is a function
    ```(request: Request, response: Response, next: () => void): void```.

    It accepts three arguments:
    - ```request: Request``` - **Request** instance.
    - ```response: Response``` - **Response** instance.
    - ```next: () => void``` - A function that passes control to a next middleware function
        if is called inside a handler function.

    You can also call **Server.use** method to add middleware after **Server** instance
    created.
- ```routes: Route[]``` (default: **[]**) - routes to be served by **routeHandler**.

    **Route** is an object:
    ```
    {
        path: string;
        component: typeof Component;
        headers?: { [name: string]: string };
    }
    ```

    - ```path: string``` - A path pattern. You can specify named path parameters
        by enclosing parameters names in ```<...>```.

        For example: the path pattern ```'shop/<category>/<item>'``` matches the route
        ```shop/audio/speakers-101```. In this case there will be two path parameters:
        ```typescript
        {
            category: 'audio',
            item: 'speakers-101',
        }
        ```

        By default value of named path parameter can be any set of these symbols:
        **a-zA-Z0-9-_**.

        You can specify path parameter type by adding to its name **'|n'** (for numbers)
        or **'|l'** (for letters).

        Example:

        ```<id|n>``` - named parameter "id" expected to consist of numbers (**0-9**);

        ```<category|l>``` - named parameter "category" expected to consist of latin letters (**a-zA-Z**).

        A last named path parameter can be non-obligatory. In this case, we need
        to "hide" the last slash inside the name and add **|?**: ```</...|?>```.
        For example: ```'shop/<category></item|?>'```

        You can also specify a type of a non-obligatory last named path parameter: ```</...|l?>```
        or ```</...|n?>```

        You can use "magic" path: **'\*'**, which matches any route.
        A **Route** with this path should be defined after all the routes.
    - ```component: typeof Component``` - A derivative class of **Component**.
    - ```headers: { [name: string]: string }``` (default: **{}**) - Additional headers
        for this route.
- ```renderers: { [extension: string]: RenderFunction }``` (default: **{}**) - list of
    render functions by extension. For example:
    ```
    {
        ejs: ejsRender, // don't forget to import { render as ejsRender } from 'ejs';
    }
    ```

    **RenderFunction** is a function
    ```(template: string, params?: { [key: string]: any }): string```.

    It accepts one or two arguments:
    - ```template: string``` - A template string.
    - ```params: { [key: string]: any }``` (default: **undefined**) - An object containing
        data to be used by a render function.

    Returns string - a result of render function to be sent to a client.
- ```maxBodySize: number``` (default: **2097152** - 2Mb) - maximum size of Request body.

#### Server.run [method]
```run: () => HttpServer | HttpsServer```

Runs an HttpServer | HttpsServer and returns its instance.

#### Server.handle [method]
```handle: (request: Request, response: Response) => void```

A Server handler. Called by **Server.run** method automatically.
It can be used by an external server (for example, Firebase Cloud functions).

#### Server.use [method]
```use: (handler: Handler) => void```

Adds a middleware to a **Server** instance.

### Component [class]

All the user-implemented Component classes for **routeHandler** should be derivative of
**Component** class.

You can implement any REST method within a Component class. All you need to do is
create a method of a class with a name coinciding with a request method name (in lower case).
Create **all** method to serve all the request methods.

For example, this is DemoComponent implementing GET and POST methods:
```typescript
class DemoComponent extends Component {
    public get(): void {
        this.response.renderFile([__dirname, 'demo-component.ejs'], {
            title: 'Demo Component',
        });
    }

    public post(): void {
        this.response.send(200, 'This is the DemoComponent POST action');
    }
}
```

#### Component.app [property]
```app: Server```

#### Component.request [property]
```request: Request```

#### Component.response [property]
```response: Response```

### Request [class]

A derivative class of **IncomingMessage**. Has a few additional properties:

#### Request.app [property]
```app: Server```

#### Request.uri [property]
```uri: string```

Current route URI.

#### Request.params [property]
```params: { [name: string]: string }```

A named route parameters list.

#### Request.searchParams [property]
```searchParams: URLSearchParams```

#### Request.body [property]
```body: string```

### Response [class]

A derivative class of **ServerResponse**. Has a few additional properties and methods:

#### Response.app [property]
```app: Server```

#### Response.request [property]
```request: Request```

#### Response.send [method]
```send: (status: number, body?) => void```

Sends a response to a client.

Accepts one or two arguments:
- ```status: number``` - HTTP status code.
- ```body: any``` (default: **undefined**) - A body of response.

#### Response.sendJSON [method]
```sendJSON: (data: any) => void```

Sends a response to a client in JSON format.

Accepts one argument:
- ```data: any``` - A data to be sent in JSON format in a body of response.

#### Response.sendError [method]
```sendError: (error) => void```

Sends an error response to a client.

Accepts one argument:
- ```error: any``` - Error object. The library tries to get HTTP status code
    and error message automatically. Basically, error object should be as follows:
    ```
    {
        code: number;
        message: string;
    }
    ```

#### Response.render [method]
```render: (template: string | Buffer, extension: string, params?: { [key: string]: any }) => void```

Renders a **template** by a renderer, determined by **extension**, and responds to a client
with a body, containing a result of a render function.

Accepts two or three arguments:
- ```template: string | Buffer``` - A template **string** or **Buffer**.
    If a template is of **Buffer** type, it's converted to **string**.
- ```extension: string``` - A renderer will be determined by this **extension**.
    For example, **'ejs'** will be rendered by EJS renderer.
- ```params: { [key: string]: any })``` (default: **undefined**) - An object containing
    data to be used by a render function.

#### Response.renderFile [method]
```renderFile: (pathSegments: string | string[], params?: { [key: string]: any }) => void```

Renders a file by a renderer, determined by a file extension, and responds to a client
with a body, containing a result of a render function.

Accepts one or two arguments:
- ```pathSegments: string | string[]``` - A file name to be rendered.
    Automatically resolves by **path.resolve** function.
- ```params: { [key: string]: any })``` (default: **undefined**) - An object containing
    data to be used by a render function.

### Helpers

The library has a few helper functions:

#### getCodeFromError [function]
```getCodeFromError: (error) => number```

#### getMessageFromError [function]
```getMessageFromError: (error) => string```

#### resolvePath [function]
```resolvePath: (...pathSegments) => string```

#### httpStatusList [object]
```httpStatusList: { [code: number]: string }```

#### mimeTypes [object]
```mimeTypes: { [extension: string]: string }```

#### isHttpServerOptions [type guard]
```isHttpServerOptions: (arg) => arg is ServerOptions```

#### isHttpsServerOptions [type guard]
```isHttpsServerOptions: (arg) => arg is ServerOptions```

#### isServerConfig [type guard]
```isServerConfig: (arg) => arg is ServerConfig```

#### Logger [class]

## Examples

### Stand-alone
```typescript
import { Server, Component, ServerConfig } from '@inpassor/node-server';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { render as ejsRender } from 'ejs';

class ErrorComponent extends Component {
    public all(): void {
        this.response.sendError({
            code: 405,
        });
    }
}

class DemoComponent extends Component {
    public get(): void {
        console.log(this.request.params);
        this.response.renderFile([__dirname, 'demo-component.ejs'], {
            title: 'Demo Component',
        });
    }

    public post(): void {
        console.log(this.request.params);
        this.response.send(200, 'This is the DemoComponent POST action');
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
    mimeTypes: { // additional MIME types
        mp3: 'audio/mpeg',
        pdf: 'application/pdf',
        doc: 'application/msword',
    },
    headers: { // list of headers for all the server responses, default: {}
        'Access-Control-Allow-Methods': 'OPTIONS, GET, POST',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Headers': 'content-type, authorization',
    },
    sameOrigin: true, // when set to true adds headers 'Access-Control-Allow-Origin' equal to
        // request Origin header and 'Vary' equal to 'Origin' to all the server responses
    handlers: [], // additional middleware functions
        // (you can also call Server.use method to add middleware after Server instance created)
    routes: [ // routes to be served by routeHandler
        {
            path: 'demo/:arg?',
            component: DemoComponent,
        },
        {
            path: '*',
            component: ErrorComponent,
        },
    ],
    renderers: { // list of render functions
        ejs: ejsRender,
    },
};

const server = new Server(config);

// Add middleware
server.use((request, response, next) => {
    // TODO: some middleware work

    // call next function to pass work to next middleware
    // next();

    // or send a response to a client, otherwise, the server will hang till timeout
    // use Response.send method in order to send all the needed headers defined in the config
    response.send(200, 'Some content');
});

server.run();
```

We had created a Server instance with ejs renderer and two components:
DemoComponent, having GET and POST methods,
and ErrorComponent, serving all the routes (which did not match any previous route)
and all the request methods.

The route **/demo[/arg]** will be served by DemoComponent.

All the other routes will be served first under **publicPath** directory, then
ErrorComponent will act.

### socket.io
```typescript
import { Server, ServerConfig } from '@inpassor/node-server';
import * as socketIO from 'socket.io';

const config: ServerConfig = {}; // define your own ServerConfig here

const server = new Server(config);

const serverInstance = server.run(); // instance of HTTP or HTTPS node.js Server

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

### Firebase Cloud functions

There is no need for HTTP or HTTPS node.js server instance since Firebase Cloud functions
create its own server. We just need to pass **Server.handle** method to Firebase.

#### Common usage
```typescript
import { RuntimeOptions, HttpsFunction, runWith } from 'firebase-functions';
import { Server, ServerConfig } from '@inpassor/node-server';

const firebaseApplication = (config: ServerConfig, runtimeOptions?: RuntimeOptions): HttpsFunction => {
    const server = new Server(config);
    return runWith(runtimeOptions).https.onRequest(server.handle.bind(server));
};

const config: ServerConfig = {}; // define your own ServerConfig here

export const firebaseFunction = firebaseApplication(config, {
  timeoutSeconds: 10,
  memory: '128MB',
});
```

#### Asynchronous Server config
```typescript
import { RuntimeOptions, HttpsFunction, runWith } from 'firebase-functions';
import { Server, ServerConfig } from '@inpassor/node-server';

const firebaseApplication = (
    getConfig: ServerConfig | Promise<ServerConfig>,
    runtimeOptions?: RuntimeOptions,
): HttpsFunction => {
    return runWith(runtimeOptions).https.onRequest(async (request, response) => {
        await new Promise((resolve, reject) => {
            Promise.resolve(getConfig).then(
                (config): void => {
                    const server = new Server(config);
                    resolve(server.handle.call(server, request, response));
                },
                error => reject(error),
            );
        });
    });
};

// Some asynchronous get config function
const getConfig = (): Promise<ServerConfig> => {
    const config: ServerConfig = {}; // define your own ServerConfig here
    return Promise.resolve(config);
};

export const firebaseFunction = firebaseApplication(getConfig(), {
    timeoutSeconds: 10,
    memory: '128MB',
});
```

You can also use the library
[@inpassor/firebase-application](https://github.com/Inpassor/ts-firebase-application)
which wraps node-server.
