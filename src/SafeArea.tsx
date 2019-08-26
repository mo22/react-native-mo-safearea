import * as React from 'react';
import { Insets, View, findNodeHandle } from 'react-native';
import { StatefulEvent, Releaseable } from 'mo-core';
import * as ios from './ios';
import * as android from './android';



export class SafeArea {

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
          console.log('ReactNativeMoSafeArea.next', rs.safeArea);
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
          console.log('ReactNativeMoSafeArea.next', rs.safeArea);
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

// export const SafeAreaConsumer = createObservableConsumer(SafeArea.safeArea);
// export const SafeAreaConsumer = createMySubjectConsumer(SafeArea.safeArea);



export interface SafeAreaInjectedProps {
  safeArea: Required<Insets>;
}

// @TODO higher order components are pretty darn annoying
// composition makes access to static fields impossible (needed for react-navigation)
// React.createRef() returns an exotic object (not a class constructor), which
//   does not work with class/function decorators
// and then there is typescript which is getting very complicated at this point.
//

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


// import * as hoistStatics from 'hoist-non-react-statics';
// export function withSafeArea<
//   P extends SafeAreaInjectedProps,
//   S,
//   T extends React.ComponentClass<P, S>,
// >(
//   component: T & React.ComponentClass<P>
// ): (
//   T &
//   ( new (props: Omit<P, keyof SafeAreaInjectedProps>, context?: any) => React.Component<Omit<P, keyof SafeAreaInjectedProps>, S> )
// ) {
//   const Component = component as any;
//   const test = (props: P) => (
//     <SafeAreaConsumer>
//       {(safeArea) => (
//         <Component {...props} safeArea={safeArea} />
//       )}
//     </SafeAreaConsumer>
//   );
//   // const forwardRef = React.forwardRef<T, P>((props, ref) => (
//   //   <SafeAreaConsumer>
//   //     {(safeArea) => (
//   //       <Component {...props} safeArea={safeArea} ref={ref} />
//   //     )}
//   //   </SafeAreaConsumer>
//   // ));
//   const withStatics = hoistStatics(test, Component as any);
//   return withStatics as any;
// }

// export const withSafeArea = createHOC((Component, props, ref) => (
//   <SafeAreaConsumer>
//     {(safeArea) => (
//       <Component {...props} safeArea={safeArea} ref={ref} />
//     )}
//   </SafeAreaConsumer>
// ));



// playground
