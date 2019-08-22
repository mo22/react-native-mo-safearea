import * as React from 'react';
import { Insets, EmitterSubscription, View, findNodeHandle } from 'react-native';
// import { BehaviorSubjectWithCallback } from './BehaviorSubjectWithCallback';
import * as ios from './ios';
import * as android from './android';
import { MySubject, Unsubscribable } from './MySubject';
// import { createMySubjectConsumer } from './createMySubjectConsumer';
// import { createObservableConsumer } from './createObservableConsumer';
// import { createHOC } from './createHOC';



export class SafeArea {
  private static getInitialSafeArea(): Required<Insets> {
    if (ios.Module && ios.Module.initialSafeArea) {
      return ios.Module.initialSafeArea;
    }
    if (android.Module) {
      android.Module.getSafeArea().then((val) => {
        if (val) this.safeArea.next(val);
      });
    }
    return { top: 0, left: 0, bottom: 0, right: 0 };
  }

  public static readonly safeArea = new MySubject<Required<Insets>>(SafeArea.getInitialSafeArea(), (active) => {
    SafeArea.safeAreaSubscribe(active);
  });

  // public static readonly safeArea = new BehaviorSubjectWithCallback<Required<Insets>>(SafeArea.getInitialSafeArea(), (active) => {
  //   SafeArea.safeAreaSubscribe(active);
  // });

  private static safeAreaSubscription?: EmitterSubscription;

  private static safeAreaSubscribe(active: boolean) {
    if (active && !this.safeAreaSubscription) {
      if (ios.Events && ios.Module) {
        this.safeAreaSubscription = ios.Events.addListener('ReactNativeMoSafeArea', (rs) => {
          if (JSON.stringify(rs.safeArea) === JSON.stringify(this.safeArea.value)) return;
          console.log('ReactNativeMoSafeArea.next', rs.safeArea);
          this.safeArea.next(rs.safeArea);
        });
        ios.Module.enableSafeAreaEvent(true);
      } else if (android.Events && android.Module) {
        this.safeAreaSubscription = android.Events.addListener('ReactNativeMoSafeArea', (rs) => {
          if (JSON.stringify(rs.safeArea) === JSON.stringify(this.safeArea.value)) return;
          console.log('ReactNativeMoSafeArea.next', rs.safeArea);
          this.safeArea.next(rs.safeArea);
        });
        android.Module.enableSafeAreaEvent(true);
      }
    } else if (!active && this.safeAreaSubscription) {
      this.safeAreaSubscription.remove();
      this.safeAreaSubscription = undefined;
      if (ios.Module) {
        ios.Module.enableSafeAreaEvent(false);
      } else if (android.Module) {
        android.Module.enableSafeAreaEvent(false);
      }
    }
  }

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
  private subscription?: Unsubscribable;

  public componentDidMount() {
    this.subscription = SafeArea.safeArea.subscribe((value) => {
      this.setState({ value: value });
    });
  }

  public componentWillUnmount() {
    this.subscription!.unsubscribe();
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

export function withSafeArea<
  Props extends SafeAreaInjectedProps,
>(
  component: React.ComponentType<Props>
): (
  React.FunctionComponent<Omit<Props, keyof SafeAreaInjectedProps>>
) {
  const Component = component as React.ComponentType<any>; // @TODO hmpf.
  return (props: Omit<Props, keyof SafeAreaInjectedProps>) => (
    <SafeAreaConsumer>
      {(safeArea) => (
        <Component {...props} safeArea={safeArea} />
      )}
    </SafeAreaConsumer>
  );
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
