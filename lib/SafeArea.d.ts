import * as React from 'react';
import { Insets, View } from 'react-native';
import { StatefulEvent } from 'mo-core';
export declare class SafeArea {
    static readonly safeArea: StatefulEvent<Required<Insets>>;
    static measureViewInsets(view: View): Promise<undefined | Required<Insets>>;
}
export declare class SafeAreaConsumer extends React.PureComponent<{
    children: (safeArea: Required<Insets>) => React.ReactElement;
}, {
    value: Insets;
}> {
    state: {
        value: Required<Insets>;
    };
    private subscription?;
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): React.ReactElement<any, string | ((props: any) => React.ReactElement<any, string | any | (new (props: any) => React.Component<any, any, any>)> | null) | (new (props: any) => React.Component<any, any, any>)>;
}
export interface SafeAreaInjectedProps {
    safeArea: Required<Insets>;
}
export declare function withSafeArea<Props extends SafeAreaInjectedProps>(component: React.ComponentType<Props>): (React.ComponentType<Omit<Props, keyof SafeAreaInjectedProps>>);
export declare function withSafeAreaDecorator<Props extends SafeAreaInjectedProps, ComponentType extends React.ComponentType<Props>>(component: ComponentType & React.ComponentType<Props>): (ComponentType & (new (props: Omit<Props, keyof SafeAreaInjectedProps>, context?: any) => React.Component<Omit<Props, keyof SafeAreaInjectedProps>>));
