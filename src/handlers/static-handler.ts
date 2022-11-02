import { existsSync, statSync } from 'node:fs';

import { Handler } from '../interfaces';
import { resolvePath } from '../helpers';

export const staticHandler: Handler = (request, response, next): void => {
  const app = request.app;
  const method = request.method.toLowerCase();
  if (method === 'options') {
    return response.send(204);
  }
  let pathName = resolvePath(app.config.publicPath, request.uri);
  if (existsSync(pathName)) {
    if (method === 'get') {
      const isDirectory = statSync(pathName).isDirectory();
      if (isDirectory) {
        pathName = resolvePath(pathName, app.config.index);
      }
      try {
        return response.renderFile(pathName);
      } catch {
        if (!isDirectory) {
          return response.send(500, `Error getting /${request.uri}`);
        }
      }
    } else {
      return response.send(405);
    }
  }
  next();
};
