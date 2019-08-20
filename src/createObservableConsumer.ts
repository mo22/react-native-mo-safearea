import * as React from 'react';
import { BehaviorSubject, Subscribable, Unsubscribable } from 'rxjs';

export function createObservableConsumer<T>(subject: BehaviorSubject<T>): React.ComponentType<{ children: (value: T) => React.ReactElement }>;
export function createObservableConsumer<T>(subject: Subscribable<T>|BehaviorSubject<T>): React.ComponentType<{ children: (value: T|undefined) => React.ReactElement }> {
  const res = class extends React.PureComponent<{
    children: (value: T|undefined) => React.ReactElement
  }, {
    value: T|undefined;
  }> {
    public state = {
      value: ('getValue' in subject) ? subject.getValue() : undefined,
    };
    public subscription: Unsubscribable;
    public componentDidMount() {
      this.subscription = subject.subscribe((value) => {
        this.setState({ value: value });
      });
    }
    public componentWillUnmount() {
      this.subscription.unsubscribe();
    }
    public render() {
      return this.props.children(this.state.value);
    }
  };
  return res;
}
