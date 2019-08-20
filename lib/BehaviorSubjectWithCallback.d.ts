import { BehaviorSubject, Subscription, Subscriber } from 'rxjs';
export declare class BehaviorSubjectWithCallback<T> extends BehaviorSubject<T> {
    private callback;
    constructor(value: T, callback: (subscribed: boolean) => void);
    _subscribe(subscriber: Subscriber<T>): Subscription;
}
