import { BehaviorSubject, Subscription, Subscriber } from 'rxjs';

export class BehaviorSubjectWithCallback<T> extends BehaviorSubject<T> {
  public constructor(value: T, private callback: (subscribed: boolean) => void) {
    super(value);
  }
  public _subscribe(subscriber: Subscriber<T>): Subscription {
    const beforeActive = this.observers.length !== 0;
    const res = super._subscribe(subscriber);
    const afterActive = this.observers.length !== 0;
    if (afterActive !== beforeActive) this.callback(afterActive);
    const orig_unsubscribe = res.unsubscribe;
    res.unsubscribe = () => {
      const beforeActive = this.observers.length !== 0;
      orig_unsubscribe.call(res);
      const afterActive = this.observers.length !== 0;
      if (afterActive !== beforeActive) this.callback(afterActive);
    };
    return res;
  }
}
