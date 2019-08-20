import * as React from 'react';
import { Insets } from 'react-native';
import { BehaviorSubjectWithCallback } from './BehaviorSubjectWithCallback';
export declare class SafeArea {
    private static getInitialSafeArea;
    static readonly safeArea: BehaviorSubjectWithCallback<Required<Insets>>;
    private static safeAreaSubscription?;
    private static safeAreaSubscribe;
}
export declare const SafeAreaConsumer: React.ComponentType<{
    children: (value: unknown) => React.ReactElement<any, string | ((props: any) => React.ReactElement<any, string | any | (new (props: any) => React.Component<any, any, any>)> | null) | (new (props: any) => React.Component<any, any, any>)>;
}>;
export interface SafeAreaInjectedProps {
    safeArea: Required<Insets>;
}
export declare const withSafeArea: <Props extends unknown, State, ComponentType extends React.ComponentClass<Props, State>>(component: ComponentType & React.ComponentClass<Props, any>) => ComponentType & (new (props: Pick<Props, Exclude<keyof Props, never>>, context?: any) => React.Component<Pick<Props, Exclude<keyof Props, never>>, State, any>);
