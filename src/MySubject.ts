export interface Unsubscribable {
    unsubscribe(): void;
}

export interface Observer<T> {
  next: (value: T) => void;
}

export class MySubject<T extends I, I = T> {
  private _observers = new Set<Observer<T>>();
  private _value: I;
  private _onActive?: (active: boolean) => void;
  private _active = false;

  public constructor(initialValue: I, onActive?: (active: boolean) => void) {
    this._value = initialValue;
    this._onActive = onActive;
  }

  public next(value: T) {
    this._value = value;
    for (const observer of this._observers) {
      // exceptions?
      observer.next(value);
    }
  }

  public get value(): I {
    return this._value;
  }

  public subscribe(observerOrCallback: Observer<T>|Observer<T>['next']): Unsubscribable {
    const observer: Observer<T> = ('next' in observerOrCallback) ? observerOrCallback : { next: observerOrCallback };
    if (this._observers.size === 0) {
      if (this._active) throw new Error();
      this._active = true;
      if (this._onActive) {
        this._onActive(true);
      }
    }
    this._observers.add(observer);
    return {
      unsubscribe: () => {
        const wasEmpty = (this._observers.size === 0);
        this._observers.delete(observer);
        if (this._observers.size === 0 && !wasEmpty) {
          if (!this._active) throw new Error();
          this._active = false;
          if (this._onActive) {
            this._onActive(false);
          }
        }
      },
    };
  }
}
