import { Component } from '../component';

export interface Route {
    path: string;
    component: typeof Component;
}
