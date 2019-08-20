import * as React from 'react';
import { BehaviorSubject } from 'rxjs';
export declare function createObservableConsumer<T>(subject: BehaviorSubject<T>): React.ComponentType<{
    children: (value: T) => React.ReactElement;
}>;
