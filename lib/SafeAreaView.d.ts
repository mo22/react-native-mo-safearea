import * as React from 'react';
import { ViewProps, StyleProp, ViewStyle, LayoutRectangle } from 'react-native';
export interface SafeAreaViewStyle extends ViewStyle {
    minPadding?: number;
    minPaddingBottom?: number;
    minPaddingHorizontal?: number;
    minPaddingLeft?: number;
    minPaddingRight?: number;
    minPaddingTop?: number;
    minPaddingVertical?: number;
    padding?: number;
    paddingBottom?: number;
    paddingHorizontal?: number;
    paddingLeft?: number;
    paddingRight?: number;
    paddingTop?: number;
    paddingVertical?: number;
    safeArea?: {
        top?: boolean;
        left?: boolean;
        right?: boolean;
        bottom?: boolean;
    };
}
export interface SafeAreaViewProps extends ViewProps {
    style?: StyleProp<SafeAreaViewStyle>;
    children?: React.ReactNode;
    type?: 'react' | 'native' | 'disabled' | 'simple' | 'layout';
}
export interface SafeAreaViewState {
    layout?: LayoutRectangle;
}
export declare class SafeAreaView extends React.PureComponent<SafeAreaViewProps, SafeAreaViewState> {
    state: SafeAreaViewState;
    private getStyleSafeArea;
    private getStyleMinPadding;
    private getStylePadding;
    render(): JSX.Element;
}
