import * as React from 'react';
import { ViewProps, LayoutRectangle } from 'react-native';
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
    minPadding?: ForBorders<number>;
    padding?: ForBorders<number>;
    forceInsets?: ForBorders<'always' | 'never' | 'auto'>;
    type?: 'react' | 'native' | 'disabled' | 'simple' | 'layout';
}
export interface SafeAreaViewState {
    layout?: LayoutRectangle;
}
export declare class SafeAreaView extends React.PureComponent<SafeAreaViewProps, SafeAreaViewState> {
    state: SafeAreaViewState;
    private ref;
    render(): JSX.Element | undefined;
}
export {};
