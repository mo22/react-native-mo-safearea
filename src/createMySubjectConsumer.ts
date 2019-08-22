import * as React from 'react';
import { MySubject, Unsubscribable } from './MySubject';

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
