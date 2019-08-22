export class MySubject {
    constructor(initialValue, onActive) {
        this._observers = new Set();
        this._active = false;
        this._value = initialValue;
        this._onActive = onActive;
    }
    next(value) {
        this._value = value;
        for (const observer of this._observers) {
            // exceptions?
            observer.next(value);
        }
    }
    get value() {
        return this._value;
    }
    subscribe(observerOrCallback) {
        const observer = ('next' in observerOrCallback) ? observerOrCallback : { next: observerOrCallback };
        if (this._observers.size === 0) {
            if (this._active)
                throw new Error();
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
                    if (!this._active)
                        throw new Error();
                    this._active = false;
                    if (this._onActive) {
                        this._onActive(false);
                    }
                }
            },
        };
    }
}
//# sourceMappingURL=MySubject.js.map