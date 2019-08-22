export interface Unsubscribable {
    unsubscribe(): void;
    closed: boolean;
}
export interface Observer<T> {
    next: (value: T) => void;
}
export declare class MySubject<T extends I, I = T> {
    private _observers;
    private _value;
    private _onActive?;
    private _active;
    constructor(initialValue: I, onActive?: (active: boolean) => void);
    next(value: T): void;
    readonly value: I;
    subscribe(observerOrCallback: Observer<T> | Observer<T>['next']): Unsubscribable;
}
