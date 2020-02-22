export interface Renderer {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (template: string, params?: { [key: string]: any }): string;
}
