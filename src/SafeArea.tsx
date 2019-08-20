import * as React from 'react';
import { Insets, EmitterSubscription } from 'react-native';
import { BehaviorSubjectWithCallback } from './BehaviorSubjectWithCallback';
import * as ios from './ios';
import * as android from './android';
import { createHOC } from './createHOC';
import { createObservableConsumer } from './createObservableConsumer';



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

  public static readonly safeArea = new BehaviorSubjectWithCallback<Required<Insets>>(SafeArea.getInitialSafeArea(), (active) => {
    SafeArea.safeAreaSubscribe(active);
  });

  private static safeAreaSubscription?: EmitterSubscription;

  private static safeAreaSubscribe(active: boolean) {
    if (this.safeAreaSubscription) {
      this.safeAreaSubscription.remove();
      this.safeAreaSubscription = undefined;
    }

    if (active) {
      if (ios.Events) {
        this.safeAreaSubscription = ios.Events.addListener('ReactNativeMoSafeArea', (rs) => {
          if (JSON.stringify(rs.safeArea) === JSON.stringify(this.safeArea.getValue())) return;
          console.log('ReactNativeMoSafeArea.next', rs.safeArea);
          this.safeArea.next(rs.safeArea);
        });
      } else if (android.Events) {
        this.safeAreaSubscription = android.Events.addListener('ReactNativeMoSafeArea', (rs) => {
          if (JSON.stringify(rs.safeArea) === JSON.stringify(this.safeArea.getValue())) return;
          console.log('ReactNativeMoSafeArea.next', rs.safeArea);
          this.safeArea.next(rs.safeArea);
        });
        // if (rs.type === 'onOrientationChange') {
        //   // @TODO: this should not be needed and is ugly.
        //   setTimeout(() => {
        //     android.Module.getSafeArea().then((value) => {
        //       if (!value) return;
        //       if (JSON.stringify(value) === JSON.stringify(this.safeArea.getValue())) return;
        //       this.safeArea.next(value);
        //     });
        //   }, 40);
        // }

      }
    }
  }

}



// export class SafeAreaConsumerOld extends React.PureComponent<{
//   children: (safeArea: Required<Insets>) => React.ReactElement
// }, {
//   safeArea: Insets;
// }> {
//   public state = { safeArea: SafeArea.safeArea.getValue() };
//   private subscription: Subscription;
//
//   public componentDidMount() {
//     this.subscription = SafeArea.safeArea.subscribe((value) => {
//       this.setState({ safeArea: value });
//     });
//   }
//
//   public componentWillUnmount() {
//     this.subscription.unsubscribe();
//   }
//
//   public render() {
//     return this.props.children(this.state.safeArea);
//   }
// }

export const SafeAreaConsumer = createObservableConsumer(SafeArea.safeArea);



export interface SafeAreaInjectedProps {
  safeArea: Required<Insets>;
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

export const withSafeArea = createHOC((Component, props, ref) => (
  <SafeAreaConsumer>
    {(safeArea) => (
      <Component {...props} safeArea={safeArea} ref={ref} />
    )}
  </SafeAreaConsumer>
));



// playground
