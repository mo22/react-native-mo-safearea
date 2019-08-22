import * as React from 'react';
import { MySubject } from './MySubject';
export declare function createMySubjectConsumer<T extends I, I>(subject: MySubject<T, I>): React.ComponentType<{
    children: (value: I) => React.ReactElement;
}>;
