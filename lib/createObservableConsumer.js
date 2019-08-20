import * as React from 'react';
export function createObservableConsumer(subject) {
    const res = class extends React.PureComponent {
        constructor() {
            super(...arguments);
            this.state = {
                value: ('getValue' in subject) ? subject.getValue() : undefined,
            };
        }
        componentDidMount() {
            this.subscription = subject.subscribe((value) => {
                this.setState({ value: value });
            });
        }
        componentWillUnmount() {
            this.subscription.unsubscribe();
        }
        render() {
            return this.props.children(this.state.value);
        }
    };
    return res;
}
//# sourceMappingURL=createObservableConsumer.js.map