import * as React from 'react';
export function createMySubjectConsumer(subject) {
    const res = class extends React.PureComponent {
        constructor() {
            super(...arguments);
            this.state = {
                value: subject.value,
            };
        }
        componentDidMount() {
            this.subscription = subject.subscribe({
                next: (value) => {
                    this.setState({ value: value });
                },
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
//# sourceMappingURL=createMySubjectConsumer.js.map