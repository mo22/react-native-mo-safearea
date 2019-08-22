import * as React from 'react';
import { findNodeHandle } from 'react-native';
import { BehaviorSubjectWithCallback } from './BehaviorSubjectWithCallback';
import * as ios from './ios';
import * as android from './android';
import { createHOC } from './createHOC';
import { createObservableConsumer } from './createObservableConsumer';
export class SafeArea {
    static getInitialSafeArea() {
        if (ios.Module && ios.Module.initialSafeArea) {
            return ios.Module.initialSafeArea;
        }
        if (android.Module) {
            android.Module.getSafeArea().then((val) => {
                if (val)
                    this.safeArea.next(val);
            });
        }
        return { top: 0, left: 0, bottom: 0, right: 0 };
    }
    static safeAreaSubscribe(active) {
        if (active && !this.safeAreaSubscription) {
            if (ios.Events && ios.Module) {
                this.safeAreaSubscription = ios.Events.addListener('ReactNativeMoSafeArea', (rs) => {
                    if (JSON.stringify(rs.safeArea) === JSON.stringify(this.safeArea.getValue()))
                        return;
                    console.log('ReactNativeMoSafeArea.next', rs.safeArea);
                    this.safeArea.next(rs.safeArea);
                });
                ios.Module.enableSafeAreaEvent(true);
            }
            else if (android.Events && android.Module) {
                this.safeAreaSubscription = android.Events.addListener('ReactNativeMoSafeArea', (rs) => {
                    if (JSON.stringify(rs.safeArea) === JSON.stringify(this.safeArea.getValue()))
                        return;
                    console.log('ReactNativeMoSafeArea.next', rs.safeArea);
                    this.safeArea.next(rs.safeArea);
                });
                android.Module.enableSafeAreaEvent(true);
            }
        }
        else if (!active && this.safeAreaSubscription) {
            this.safeAreaSubscription.remove();
            this.safeAreaSubscription = undefined;
            if (ios.Module) {
                ios.Module.enableSafeAreaEvent(false);
            }
            else if (android.Module) {
                android.Module.enableSafeAreaEvent(false);
            }
        }
    }
    static async measureViewInsets(view) {
        const node = findNodeHandle(view);
        if (!node)
            return undefined;
        if (ios.Module) {
            return ios.Module.measureViewInsets(node);
        }
        else if (android.Module) {
            return android.Module.measureViewInsets(node);
        }
        return undefined;
    }
}
SafeArea.safeArea = new BehaviorSubjectWithCallback(SafeArea.getInitialSafeArea(), (active) => {
    SafeArea.safeAreaSubscribe(active);
});
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
export const withSafeArea = createHOC((Component, props, ref) => (React.createElement(SafeAreaConsumer, null, (safeArea) => (React.createElement(Component, Object.assign({}, props, { safeArea: safeArea, ref: ref }))))));
// playground
//# sourceMappingURL=SafeArea.js.map