import { Params } from './params';

export interface Renderer {
  (template: string, params?: Params): string;
}
