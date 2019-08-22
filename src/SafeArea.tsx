import * as React from 'react';
import { Insets, EmitterSubscription, View, findNodeHandle } from 'react-native';
import { BehaviorSubjectWithCallback } from './BehaviorSubjectWithCallback';
import * as ios from './ios';
import * as android from './android';
import { createHOC } from './createHOC';
// import { createObservableConsumer } from './createObservableConsumer';



export interface Unsubscribable {
    unsubscribe(): void;
}

export interface Observer<T> {
  next: (value: T) => void;
}

export class MySubject<T extends I, I = T> {
  private _observers = new Set<Observer<T>>();
  private _value: I;
  private _onActive?: (active: boolean) => void;
  private _active = false;

  public constructor(initialValue: I, onActive?: (active: boolean) => void) {
    this._value = initialValue;
    this._onActive = onActive;
  }

  public update(value: T) {
    this._value = value;
    for (const observer of this._observers) {
      // exceptions?
      observer.next(value);
    }
  }

  public get value(): I {
    return this._value;
  }

  public subscribe(observerOrCallback: Observer<T>|Observer<T>['next']): Unsubscribable {
    const observer: Observer<T> = ('next' in observerOrCallback) ? observerOrCallback : { next: observerOrCallback };
    if (this._observers.size === 0) {
      if (this._active) throw new Error();
      this._active = true;
      if (this._onActive) {
        this._onActive(true);
      }
    }
    this._observers.add(observer);
    return {
      unsubscribe: () => {
        const wasEmpty = (this._observers.size === 0);
        this._observers.delete(observer);
        if (this._observers.size === 0 && !wasEmpty) {
          if (!this._active) throw new Error();
          this._active = false;
          if (this._onActive) {
            this._onActive(false);
          }
        }
      },
    };
  }
}



export function createMySubjectConsumer<T extends I, I>(subject: MySubject<T, I>): React.ComponentType<{ children: (value: I) => React.ReactElement }> {
  const res = class extends React.PureComponent<{
    children: (value: I) => React.ReactElement
  }, {
    value: I;
  }> {
    public state = {
      value: subject.value,
    };
    public subscription?: Unsubscribable;
    public componentDidMount() {
      this.subscription = subject.subscribe({
        next: (value) => {
          this.setState({ value: value });
        },
      });
    }
    public componentWillUnmount() {
      this.subscription!.unsubscribe();
    }
    public render() {
      return this.props.children(this.state.value);
    }
  };
  return res;
}



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

  public static readonly safeArea2 = new MySubject<Required<Insets>>(SafeArea.getInitialSafeArea(), (active) => {
    SafeArea.safeAreaSubscribe(active);
  });

  public static readonly safeArea = new BehaviorSubjectWithCallback<Required<Insets>>(SafeArea.getInitialSafeArea(), (active) => {
    SafeArea.safeAreaSubscribe(active);
  });

  private static safeAreaSubscription?: EmitterSubscription;

  private static safeAreaSubscribe(active: boolean) {
    if (active && !this.safeAreaSubscription) {
      if (ios.Events && ios.Module) {
        this.safeAreaSubscription = ios.Events.addListener('ReactNativeMoSafeArea', (rs) => {
          if (JSON.stringify(rs.safeArea) === JSON.stringify(this.safeArea.getValue())) return;
          console.log('ReactNativeMoSafeArea.next', rs.safeArea);
          this.safeArea.next(rs.safeArea);
        });
        ios.Module.enableSafeAreaEvent(true);
      } else if (android.Events && android.Module) {
        this.safeAreaSubscription = android.Events.addListener('ReactNativeMoSafeArea', (rs) => {
          if (JSON.stringify(rs.safeArea) === JSON.stringify(this.safeArea.getValue())) return;
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

// export const SafeAreaConsumer = createObservableConsumer(SafeArea.safeArea);
export const SafeAreaConsumer = createMySubjectConsumer(SafeArea.safeArea2);



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
