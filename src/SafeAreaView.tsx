import * as React from 'react';
import { View, ViewProps, StyleSheet, LayoutRectangle, Dimensions, Insets, Animated, LayoutChangeEvent } from 'react-native';
import * as reactNative from 'react-native';
import { SafeAreaConsumer, SafeArea } from './SafeArea';

// const ReactNativeMoSafeAreaView = requireNativeComponent && requireNativeComponent('ReactNativeMoSafeAreaView');



type ForBorders<T> = undefined | T | {
  top?: T;
  left?: T;
  right?: T;
  bottom?: T;
  horizontal?: T;
  vertical?: T;
};

interface ByBorder<T> {
  top: T;
  left: T;
  right: T;
  bottom: T;
}

function fromBorders<T>(value: ForBorders<T>, def: T): ByBorder<T>;
function fromBorders<T>(value: ForBorders<T>): ByBorder<T|undefined>;
function fromBorders<T>(value: ForBorders<T>, def?: T): ByBorder<T|undefined> {
  const res: ByBorder<T|undefined> = { top: def, left: def, right: def, bottom: def };
  if (value && typeof value === 'object') {
    if ('horizontal' in value) res.left = res.right = value.horizontal;
    if ('vertical' in value) res.top = res.bottom = value.vertical;
    if ('top' in value) res.top = value.top;
    if ('left' in value) res.left = value.left;
    if ('right' in value) res.right = value.right;
    if ('bottom' in value) res.bottom = value.bottom;
  } else if (value !== undefined) {
    res.top = res.left = res.right = res.bottom = value;
  }
  return res;
}



export interface SafeAreaViewProps extends ViewProps {
  children?: React.ReactNode;

  minPadding?: ForBorders<number>;
  padding?: ForBorders<number>;
  forceInsets?: ForBorders<'always'|'never'|'auto'>;
  // react: use react native SafeAreaView
  // disabled: just return a view
  // js: use js with safeArea insets
  // native: use native components (default)
  type?: 'react'|'native'|'disabled'|'simple'|'layout';
}

export interface SafeAreaViewState {
  layout?: LayoutRectangle;
  insets?: Required<Insets>;
}

export class SafeAreaView extends React.PureComponent<SafeAreaViewProps, SafeAreaViewState> {
  public state: SafeAreaViewState = {
  };

  private ref = React.createRef<View>();

  public render() {
    const { minPadding, padding, forceInsets, type, ...props } = this.props;
    const bMinPadding = fromBorders(minPadding, 0);
    const bPadding = fromBorders(padding, 0);
    // @TODO: bPadding = style.padding ?
    const bForceInsets = fromBorders(forceInsets, 'auto');

    if (type === 'disabled') {
      // sum minPadding and padding
      const { style, ...otherProps } = props;
      const flatStyle = StyleSheet.flatten(style || {});
      return (
        <View
          pointerEvents="box-none"
          {...otherProps}
          style={{
            ...flatStyle,
            paddingTop: bMinPadding.top + bPadding.top,
            paddingLeft: bMinPadding.left + bPadding.left,
            paddingRight: bMinPadding.right + bPadding.right,
            paddingBottom: bMinPadding.bottom + bPadding.bottom,
          }}
        />
      );

    } else if (type === 'react') {
      // @TODO: remove
      return (
        <reactNative.SafeAreaView {...props} />
      );

    } else if (type === 'native' || type === undefined) {
      return (
        <SafeAreaConsumer>
          {(safeArea) => {
            const { style, onLayout, ...otherProps } = props;
            const flatStyle = StyleSheet.flatten(style || {});
            const screen = Dimensions.get('screen');

            if (this.state.layout) {
              console.log('SafeAreaView.native layout', screen.height, this.state.layout.y, this.state.layout.height);
            }

            const auto = {
              top: this.state.insets ? (safeArea.top - this.state.insets.top) : 0,
              left: this.state.insets ? (safeArea.left - this.state.insets.left) : 0,
              right: this.state.insets ? (safeArea.right - this.state.insets.right) : 0,
              bottom: this.state.insets ? (safeArea.bottom - this.state.insets.bottom) : 0,
            };
            console.log('SafeAreaView.native auto', auto);

            const insets = {
              top: (bForceInsets.top === 'never') ? 0 : (bForceInsets.top === 'always') ? safeArea.top : Math.min(safeArea.top, auto.top),
              left: (bForceInsets.left === 'never') ? 0 : (bForceInsets.left === 'always') ? safeArea.left : Math.min(safeArea.left, auto.left),
              right: (bForceInsets.right === 'never') ? 0 : (bForceInsets.right === 'always') ? safeArea.right : Math.min(safeArea.right, auto.right),
              bottom: (bForceInsets.bottom === 'never') ? 0 : (bForceInsets.bottom === 'always') ? safeArea.bottom : Math.min(safeArea.bottom, auto.bottom),
            };
            console.log('SafeAreaView.native insets', insets);


            return (
              <View
                pointerEvents="box-none"
                ref={this.ref}
                onLayout={(e: LayoutChangeEvent) => {
                  console.log('SafeAreaView.native onLayout');
                  if (onLayout) onLayout(e);
                  if (this.ref.current) {
                    SafeArea.measureViewInsets(this.ref.current).then((r) => {
                      // @TODO: get x/y coordinate for pagination?
                      console.log('SafeAreaView.native measureNative', r);
                      this.setState({ insets: r });
                    });
                  }
                }}
                {...otherProps}
                style={{
                  ...flatStyle,
                  paddingTop: Math.max(insets.top, bMinPadding.top) + bPadding.top,
                  paddingLeft: Math.max(insets.left, bMinPadding.left) + bPadding.left,
                  paddingRight: Math.max(insets.right, bMinPadding.right) + bPadding.right,
                  paddingBottom: Math.max(insets.bottom, bMinPadding.bottom) + bPadding.bottom,
                }}
              />
            );
          }}
        </SafeAreaConsumer>
      );

    } else if (type === 'layout') {
      return (
        <SafeAreaConsumer>
          {(safeArea) => {
            console.log('SafeAreaView.layout safeArea', safeArea);
            const { style, onLayout, ...otherProps } = props;
            const flatStyle = StyleSheet.flatten(style || {});
            const screen = Dimensions.get('screen');
            if (this.state.layout) {
              console.log('SafeAreaView.layout layout', screen.height, this.state.layout.y, this.state.layout.height);
            }

            const auto = {
              top: Math.max(0, safeArea.top - (this.state.layout ? this.state.layout.y : 0)),
              left: Math.max(0, safeArea.left - (this.state.layout ? this.state.layout.x : 0)),
              right: Math.max(0, safeArea.right - (this.state.layout ? (screen.width - this.state.layout.x - this.state.layout.width) : 0)),
              bottom: Math.max(0, safeArea.bottom - (this.state.layout ? (screen.height - this.state.layout.y - this.state.layout.height) : 0)),
            };
            console.log('SafeAreaView.layout auto', auto);

            const insets = {
              top: (bForceInsets.top === 'never') ? 0 : (bForceInsets.top === 'always') ? safeArea.top : Math.min(safeArea.top, auto.top),
              left: (bForceInsets.left === 'never') ? 0 : (bForceInsets.left === 'always') ? safeArea.left : Math.min(safeArea.left, auto.left),
              right: (bForceInsets.right === 'never') ? 0 : (bForceInsets.right === 'always') ? safeArea.right : Math.min(safeArea.right, auto.right),
              bottom: (bForceInsets.bottom === 'never') ? 0 : (bForceInsets.bottom === 'always') ? safeArea.bottom : Math.min(safeArea.bottom, auto.bottom),
            };
            console.log('SafeAreaView.layout insets', insets);

            return (
              <Animated.View
                pointerEvents="box-none"
                ref={this.ref}
                onLayout={(e: LayoutChangeEvent) => {
                  console.log('SafeAreaView.layout onLayout');
                  if (onLayout) onLayout(e);
                  if (this.ref.current) {
                    // this creates problems with move-in navigations.
                    // maybe check if width/height is screen size? not so good.
                    // const view = this.ref.current;
                    const view = (this.ref.current as any).getNode() as View;
                    view.measureInWindow((x, y, width, height) => {
                      console.log('SafeAreaView.layout measured', x, y, width, height);

                      // for slide-in navigations?
                      if (x >= screen.width) x = x % screen.width;
                      if (x < 0) x = (x % screen.width) + screen.width;
                      if (y >= screen.height) y = y % screen.height;
                      if (y < 0) y = (y % screen.height) + screen.height;

                      this.setState({ layout: { x: x, y: y, width: width, height: height }});
                    });
                  }
                }}
                {...otherProps}
                style={{
                  ...flatStyle,
                  paddingTop: Math.max(insets.top, bMinPadding.top) + bPadding.top,
                  paddingLeft: Math.max(insets.left, bMinPadding.left) + bPadding.left,
                  paddingRight: Math.max(insets.right, bMinPadding.right) + bPadding.right,
                  paddingBottom: Math.max(insets.bottom, bMinPadding.bottom) + bPadding.bottom,
                }}
              />
            );
          }}
        </SafeAreaConsumer>
      );

    } else if (type === 'simple') {
      return (
        <SafeAreaConsumer>
          {(safeArea) => {
            const { style, ...otherProps } = props;
            const flatStyle = StyleSheet.flatten(style || {});
            return (
              <View
                pointerEvents="box-none"
                {...otherProps}
                style={{
                  ...flatStyle,
                  paddingTop: Math.max((bForceInsets.top === 'always') ? safeArea.top : 0, bMinPadding.top) + bPadding.top,
                  paddingLeft: Math.max((bForceInsets.left === 'always') ? safeArea.left : 0, bMinPadding.left) + bPadding.left,
                  paddingRight: Math.max((bForceInsets.right === 'always') ? safeArea.right : 0, bMinPadding.right) + bPadding.right,
                  paddingBottom: Math.max((bForceInsets.bottom === 'always') ? safeArea.bottom : 0, bMinPadding.bottom) + bPadding.bottom,
                }}
              />
            );
          }}
        </SafeAreaConsumer>
      );
    }
  }
}
