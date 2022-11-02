import { type Component } from '../component';

export interface Route {
  path: string;
  component: typeof Component;
  headers?: Record<string, string>;
}
