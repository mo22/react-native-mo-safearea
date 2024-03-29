import * as React from 'react';
import { Insets, View, ViewProps } from 'react-native';
import { StatefulEvent } from 'mo-core';
import * as ios from './ios';
import * as android from './android';
export interface SafeAreaInfo {
    safeArea: Required<Insets>;
    system: Required<Insets>;
}
export declare class SafeArea {
    /**
     * native ios functions. use with caution
     */
    static readonly ios: typeof ios;
    /**
     * native android functions. use with caution
     */
    static readonly android: typeof android;
    /**
     * be verbose
     */
    static setVerbose(verbose: boolean): void;
    /**
     * the last info about animation duration
     */
    static systemAnimationDuration: number | undefined;
    private static convertAndroidSafeArea;
    private static androidCompatMode;
    private static getAndroidInitialSafeArea;
    private static convertIosKeyboardArea;
    /**
     * stateful event that provides the current safe area insets
     */
    static readonly safeArea: StatefulEvent<Readonly<SafeAreaInfo>>;
    /**
     * stateful event that provides the current safe area insets
     */
    static readonly oldSafeArea: StatefulEvent<Readonly<Required<Insets>>>;
    /**
     * measure the native distance of a view to all screen borders, taking
     * scrollviews and such into account.
     */
    static measureViewInsets(view: View): Promise<undefined | Required<Insets>>;
}
/**
 * consume the current safe area insets. takes a function as child that gets passed
 * the current safe area insets.
 */
export interface SafeAreaConsumerProps {
    children: (safeArea: SafeAreaInfo) => React.ReactElement;
}
export declare function SafeAreaConsumer(props: SafeAreaConsumerProps): React.ReactElement<any, string | React.JSXElementConstructor<any>>;
export interface SafeAreaInjectedProps {
    safeArea: SafeAreaInfo;
}
export declare function withSafeArea<Props extends SafeAreaInjectedProps>(component: React.ComponentType<Props>): (React.ComponentType<Omit<Props, keyof SafeAreaInjectedProps>>);
export declare function withSafeAreaDecorator<Props extends SafeAreaInjectedProps, ComponentType extends React.ComponentType<Props>>(component: ComponentType & React.ComponentType<Props>): (ComponentType & (new (props: Omit<Props, keyof SafeAreaInjectedProps>, context?: any) => React.Component<Omit<Props, keyof SafeAreaInjectedProps>>));
declare type ForBorders<T> = undefined | T | {
    top?: T;
    left?: T;
    right?: T;
    bottom?: T;
    horizontal?: T;
    vertical?: T;
};
export interface SafeAreaViewProps extends ViewProps {
    children?: React.ReactNode;
    /**
     * the minimum safe area for each border
     */
    minPadding?: ForBorders<number>;
    /**
     * additional padding for each border
     */
    padding?: ForBorders<number>;
    /**
     * which borders to add the safe area insets padding to
     */
    forceInsets?: ForBorders<'always' | 'never' | 'auto'>;
    /**
     * include system windows (keyboard!)
     */
    includeSystemWindows?: boolean;
    /**
     * animate system window changes
     */
    animateSystemWindows?: boolean;
}
export interface SafeAreaViewState {
    insets?: Required<Insets>;
}
/**
 * a view with automatic padding from safe area insets
 */
export declare class SafeAreaView extends React.PureComponent<SafeAreaViewProps, SafeAreaViewState> {
    state: SafeAreaViewState;
    private ref;
    private lastSystemArea;
    private mounted;
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
}
export {};
