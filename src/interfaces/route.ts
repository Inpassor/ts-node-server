import { Path } from 'path-to-regexp';
import { Component } from '../component';

export interface Route {
    path: Path;
    component: typeof Component;
    headers?: { [name: string]: string };
}
