export interface ComponentAction {
    (next?: () => void): void;
}
