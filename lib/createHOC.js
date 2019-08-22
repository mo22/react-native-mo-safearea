import * as React from 'react';
export function hoistStatics(target, source) {
    for (const key of [...Object.getOwnPropertyNames(source), ...Object.getOwnPropertySymbols(source)]) {
        // overwrite or not?
        const descriptor = Object.getOwnPropertyDescriptor(source, key);
        if (!descriptor)
            continue;
        try {
            Object.defineProperty(target, key, descriptor);
        }
        catch (e) {
        }
    }
}
export function createHOC(callback) {
    const res = function HOC(component) {
        const render = (props) => callback(component, props, undefined);
        return render;
    };
    return res;
}
export function createStaticHOC(callback) {
    const res = function HOC(component) {
        const render = (props) => callback(component, props, undefined);
        hoistStatics(render, component);
        // @TODO: is this really correct?
        return render;
    };
    return res;
}
export function createRefHOC(callback) {
    const res = function HOC(component) {
        const forwardRef = React.forwardRef((props, ref) => callback(component, props, ref));
        hoistStatics(forwardRef, component);
        return forwardRef;
    };
    return res;
}
//# sourceMappingURL=createHOC.js.map