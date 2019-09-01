import * as React from 'react';
import { Insets, View, findNodeHandle, ViewProps, LayoutRectangle, StyleSheet, Dimensions, LayoutChangeEvent } from 'react-native';
import { StatefulEvent, Releaseable } from 'mo-core';
import * as ios from './ios';
import * as android from './android';



export class SafeArea {
  /**
   * native ios functions. use with caution
   */
  public static readonly ios = ios;

  /**
   * native android functions. use with caution
   */
  public static readonly android = android;

  /**
   * stateful event that provides the current safe area insets
   */
  public static readonly safeArea = new StatefulEvent<Required<Insets>>(
    (() => {
      if (ios.Module && ios.Module.initialSafeArea) {
        return ios.Module.initialSafeArea;
      }
      if (android.Module) {
        android.Module.getSafeArea().then((val) => {
          if (val) SafeArea.safeArea.value = val;
        });
      }
      return { top: 0, left: 0, bottom: 0, right: 0 };
    })(),
    (emit) => {
      if (ios.Events && ios.Module) {
        let cur: Required<Insets>|undefined;
        const sub = ios.Events.addListener('ReactNativeMoSafeArea', (rs) => {
          if (JSON.stringify(rs.safeArea) === JSON.stringify(cur)) return;
          cur = rs.safeArea;
          emit(rs.safeArea);
        });
        ios.Module.enableSafeAreaEvent(true);
        return () => {
          sub.remove();
          ios.Module!.enableSafeAreaEvent(false);
        };
      } else if (android.Events && android.Module) {
        let cur: Required<Insets>|undefined;
        const sub = android.Events.addListener('ReactNativeMoSafeArea', (rs) => {
          if (JSON.stringify(rs.safeArea) === JSON.stringify(cur)) return;
          cur = rs.safeArea;
          emit(rs.safeArea);
        });
        android.Module.enableSafeAreaEvent(true);
        return () => {
          sub.remove();
          android.Module!.enableSafeAreaEvent(false);
        };
      } else {
        return () => {
        };
      }
    }
  );

  /**
   * measure the native distance of a view to all screen borders, taking
   * scrollviews and such into account.
   */
  public static async measureViewInsets(view: View): Promise<undefined|Required<Insets>> {
    const node = findNodeHandle(view);
    if (!node) return undefined;
    if (ios.Module) {
      return ios.Module.measureViewInsets(node);
    } else if (android.Module) {
      return android.Module.measureViewInsets(node);
    }
    return undefined;
  }

}



/**
 * consume the current safe area insets. takes a function as child that gets passed
 * the current safe area insets.
 */
export class SafeAreaConsumer extends React.PureComponent<{
  children: (safeArea: Required<Insets>) => React.ReactElement
}, {
  value: Insets;
}> {
  public state = { value: SafeArea.safeArea.value };
  private subscription?: Releaseable;

  public componentDidMount() {
    this.subscription = SafeArea.safeArea.subscribe((value) => {
      this.setState({ value: value });
    });
  }

  public componentWillUnmount() {
    this.subscription!.release();
  }

  public render() {
    return this.props.children(this.state.value);
  }
}



export interface SafeAreaInjectedProps {
  safeArea: Required<Insets>;
}

export function withSafeArea<
  Props extends SafeAreaInjectedProps,
  // Props,
>(
  component: React.ComponentType<Props>
  // component: React.ComponentType<Props & SafeAreaInjectedProps>
): (
  // React.ComponentType<Props>
  React.ComponentType<Omit<Props, keyof SafeAreaInjectedProps>>
) {
  const Component = component as React.ComponentType<any>; // @TODO hmpf.
  // const Component = component;
  return React.forwardRef((props: Omit<Props, keyof SafeAreaInjectedProps>, ref) => (
    <SafeAreaConsumer>
      {(safeArea) => (
        <Component safeArea={safeArea} ref={ref} {...props} />
      )}
    </SafeAreaConsumer>
  )) as any;
}

export function withSafeAreaDecorator<
  Props extends SafeAreaInjectedProps,
  ComponentType extends React.ComponentType<Props>
>(
  component: ComponentType & React.ComponentType<Props>
): (
  ComponentType &
  ( new (props: Omit<Props, keyof SafeAreaInjectedProps>, context?: any) => React.Component<Omit<Props, keyof SafeAreaInjectedProps>> )
) {
  const Component = component as any;
  const res = (props: Omit<Props, keyof SafeAreaInjectedProps>) => (
    <SafeAreaConsumer>
      {(safeArea) => (
        <Component {...props} safeArea={safeArea} />
      )}
    </SafeAreaConsumer>
  );
  res.component = component;
  const skip: { [key: string]: boolean; } = {
    arguments: true,
    caller: true,
    callee: true,
    name: true,
    prototype: true,
    length: true,
  };
  for (const key of [...Object.getOwnPropertyNames(component), ...Object.getOwnPropertySymbols(component)]) {
    if (typeof key === 'string' && skip[key]) continue;
    const descriptor = Object.getOwnPropertyDescriptor(component, key);
    if (!descriptor) continue;
    try {
      Object.defineProperty(res, key, descriptor);
    } catch (e) {
    }
  }
  return res as any;
}



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
  forceInsets?: ForBorders<'always'|'never'|'auto'>;
}

export interface SafeAreaViewState {
  layout?: LayoutRectangle;
  insets?: Required<Insets>;
}

/**
 * a view with automatic padding from safe area insets
 */
export class SafeAreaView extends React.PureComponent<SafeAreaViewProps, SafeAreaViewState> {
  public state: SafeAreaViewState = {
  };

  private ref = React.createRef<View>();

  public render() {
    const { minPadding, padding, forceInsets, ...props } = this.props;
    const bMinPadding = fromBorders(minPadding, 0);
    const bPadding = fromBorders(padding, 0);
    const bForceInsets = fromBorders(forceInsets, 'auto');
    // const needAuto = (bForceInsets.top === 'auto') || (bForceInsets.left === 'auto') || (bForceInsets.right === 'auto') || (bForceInsets.bottom === 'auto');

    return (
      <SafeAreaConsumer>
        {(safeArea) => {
          const { style, onLayout, ...otherProps } = props;
          const flatStyle = StyleSheet.flatten(style || {});
          const screen = Dimensions.get('screen');

          // adjust safeArea to what is actually needed here...

          const padding = {
            top: Math.max((bForceInsets.top === 'always') ? safeArea.top : 0, bMinPadding.top) + bPadding.top,
            left: Math.max((bForceInsets.left === 'always') ? safeArea.left : 0, bMinPadding.left) + bPadding.left,
            right: Math.max((bForceInsets.right === 'always') ? safeArea.right : 0, bMinPadding.right) + bPadding.right,
            bottom: Math.max((bForceInsets.bottom === 'always') ? safeArea.bottom : 0, bMinPadding.bottom) + bPadding.bottom,
          };

          console.log('SafeArea padding', padding);

          return (
            <View
              pointerEvents="box-none"
              ref={this.ref}
              onLayout={(e: LayoutChangeEvent) => {
                console.log('SafeAreaView onLayout');
                if (onLayout) onLayout(e);
                if (this.ref.current) {
                  SafeArea.measureViewInsets(this.ref.current).then((r) => {
                    // @TODO: get x/y coordinate for pagination?
                    console.log('SafeAreaView measureNative', r);
                    this.setState({ insets: r });
                  });

                  // const view = (this.ref.current as any).getNode() as View;
                  this.ref.current.measureInWindow((x, y, width, height) => {
                    console.log('SafeAreaView.layout measured', x, y, width, height);

                    // for slide-in navigations?
                    if (x >= screen.width) x = x % screen.width;
                    if (x < 0) x = (x % screen.width) + screen.width;
                    if (y >= screen.height) y = y % screen.height;
                    if (y < 0) y = (y % screen.height) + screen.height;

                    console.log('SafeAreaView.layout measured2', x, y, width, height);

                  });

                }
              }}
              {...otherProps}
              style={{
                ...flatStyle,
                paddingTop: padding.top,
                paddingLeft: padding.left,
                paddingRight: padding.right,
                paddingBottom: padding.bottom,
              }}
            />
          );
        }}
      </SafeAreaConsumer>
    );
  }
}
