import { BehaviorSubject } from 'rxjs';
export class BehaviorSubjectWithCallback extends BehaviorSubject {
    constructor(value, callback) {
        super(value);
        this.callback = callback;
    }
    _subscribe(subscriber) {
        const beforeActive = this.observers.length !== 0;
        const res = super._subscribe(subscriber);
        const afterActive = this.observers.length !== 0;
        if (afterActive !== beforeActive)
            this.callback(afterActive);
        const orig_unsubscribe = res.unsubscribe;
        res.unsubscribe = () => {
            const beforeActive = this.observers.length !== 0;
            orig_unsubscribe.call(res);
            const afterActive = this.observers.length !== 0;
            if (afterActive !== beforeActive)
                this.callback(afterActive);
        };
        return res;
    }
}
//# sourceMappingURL=BehaviorSubjectWithCallback.js.map