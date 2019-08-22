import * as React from 'react';
import { Insets, View } from 'react-native';
import { MySubject } from './MySubject';
export declare class SafeArea {
    private static getInitialSafeArea;
    static readonly safeArea: MySubject<Required<Insets>, Required<Insets>>;
    private static safeAreaSubscription?;
    private static safeAreaSubscribe;
    static measureViewInsets(view: View): Promise<undefined | Required<Insets>>;
}
export declare const SafeAreaConsumer: React.ComponentType<{
    children: (value: Required<Insets>) => React.ReactElement<any, string | ((props: any) => React.ReactElement<any, string | any | (new (props: any) => React.Component<any, any, any>)> | null) | (new (props: any) => React.Component<any, any, any>)>;
}>;
export interface SafeAreaInjectedProps {
    safeArea: Required<Insets>;
}
export declare const withSafeArea: any;
