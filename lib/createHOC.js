import * as React from 'react';
import hoistStatics from 'hoist-non-react-statics';
export function createHOC(callback) {
    const res = function HOC(component) {
        const render = (props) => callback(component, props, undefined);
        const withStatics = hoistStatics(render, component);
        return withStatics;
    };
    return res;
}
export function createRefHOC(callback) {
    const res = function HOC(component) {
        const forwardRef = React.forwardRef((props, ref) => callback(component, props, ref));
        const withStatics = hoistStatics(forwardRef, component);
        return withStatics;
    };
    return res;
}
//# sourceMappingURL=createHOC.js.map