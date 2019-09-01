import * as React from 'react';
import { View, findNodeHandle, StyleSheet, Dimensions } from 'react-native';
import { StatefulEvent } from 'mo-core';
import * as ios from './ios';
import * as android from './android';
export class SafeArea {
    /**
     * measure the native distance of a view to all screen borders, taking
     * scrollviews and such into account.
     */
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
/**
 * native ios functions. use with caution
 */
SafeArea.ios = ios;
/**
 * native android functions. use with caution
 */
SafeArea.android = android;
/**
 * stateful event that provides the current safe area insets
 */
SafeArea.safeArea = new StatefulEvent((() => {
    if (ios.Module && ios.Module.initialSafeArea) {
        return ios.Module.initialSafeArea;
    }
    if (android.Module) {
        android.Module.getSafeArea().then((val) => {
            if (val)
                SafeArea.safeArea.value = val;
        });
    }
    return { top: 0, left: 0, bottom: 0, right: 0 };
})(), (emit) => {
    if (ios.Events && ios.Module) {
        let cur;
        const sub = ios.Events.addListener('ReactNativeMoSafeArea', (rs) => {
            if (JSON.stringify(rs.safeArea) === JSON.stringify(cur))
                return;
            cur = rs.safeArea;
            emit(rs.safeArea);
        });
        ios.Module.enableSafeAreaEvent(true);
        return () => {
            sub.remove();
            ios.Module.enableSafeAreaEvent(false);
        };
    }
    else if (android.Events && android.Module) {
        let cur;
        const sub = android.Events.addListener('ReactNativeMoSafeArea', (rs) => {
            if (JSON.stringify(rs.safeArea) === JSON.stringify(cur))
                return;
            cur = rs.safeArea;
            emit(rs.safeArea);
        });
        android.Module.enableSafeAreaEvent(true);
        return () => {
            sub.remove();
            android.Module.enableSafeAreaEvent(false);
        };
    }
    else {
        return () => {
        };
    }
});
/**
 * consume the current safe area insets. takes a function as child that gets passed
 * the current safe area insets.
 */
export class SafeAreaConsumer extends React.PureComponent {
    constructor() {
        super(...arguments);
        this.state = { value: SafeArea.safeArea.value };
    }
    componentDidMount() {
        this.subscription = SafeArea.safeArea.subscribe((value) => {
            this.setState({ value: value });
        });
    }
    componentWillUnmount() {
        this.subscription.release();
    }
    render() {
        return this.props.children(this.state.value);
    }
}
export function withSafeArea(component
// component: React.ComponentType<Props & SafeAreaInjectedProps>
) {
    const Component = component; // @TODO hmpf.
    // const Component = component;
    return React.forwardRef((props, ref) => (React.createElement(SafeAreaConsumer, null, (safeArea) => (React.createElement(Component, Object.assign({ safeArea: safeArea, ref: ref }, props))))));
}
export function withSafeAreaDecorator(component) {
    const Component = component;
    const res = (props) => (React.createElement(SafeAreaConsumer, null, (safeArea) => (React.createElement(Component, Object.assign({}, props, { safeArea: safeArea })))));
    res.component = component;
    const skip = {
        arguments: true,
        caller: true,
        callee: true,
        name: true,
        prototype: true,
        length: true,
    };
    for (const key of [...Object.getOwnPropertyNames(component), ...Object.getOwnPropertySymbols(component)]) {
        if (typeof key === 'string' && skip[key])
            continue;
        const descriptor = Object.getOwnPropertyDescriptor(component, key);
        if (!descriptor)
            continue;
        try {
            Object.defineProperty(res, key, descriptor);
        }
        catch (e) {
        }
    }
    return res;
}
function fromBorders(value, def) {
    const res = { top: def, left: def, right: def, bottom: def };
    if (value && typeof value === 'object') {
        if ('horizontal' in value)
            res.left = res.right = value.horizontal;
        if ('vertical' in value)
            res.top = res.bottom = value.vertical;
        if ('top' in value)
            res.top = value.top;
        if ('left' in value)
            res.left = value.left;
        if ('right' in value)
            res.right = value.right;
        if ('bottom' in value)
            res.bottom = value.bottom;
    }
    else if (value !== undefined) {
        res.top = res.left = res.right = res.bottom = value;
    }
    return res;
}
/**
 * a view with automatic padding from safe area insets
 */
export class SafeAreaView extends React.PureComponent {
    constructor() {
        super(...arguments);
        this.state = {};
        this.ref = React.createRef();
    }
    render() {
        const { minPadding, padding, forceInsets, ...props } = this.props;
        const bMinPadding = fromBorders(minPadding, 0);
        const bPadding = fromBorders(padding, 0);
        const bForceInsets = fromBorders(forceInsets, 'auto');
        // const needAuto = (bForceInsets.top === 'auto') || (bForceInsets.left === 'auto') || (bForceInsets.right === 'auto') || (bForceInsets.bottom === 'auto');
        return (React.createElement(SafeAreaConsumer, null, (safeArea) => {
            const { style, onLayout, ...otherProps } = props;
            const flatStyle = StyleSheet.flatten(style || {});
            const screen = Dimensions.get('screen');
            // adjust safeArea to what is actually needed here...
            const padding = {
                top: Math.max((bForceInsets.top === 'always') ? safeArea.top : 0, bMinPadding.top) + bPadding.top,
                left: Math.max((bForceInsets.left === 'always') ? safeArea.left : 0, bMinPadding.left) + bPadding.left,
                right: Math.max((bForceInsets.right === 'always') ? safeArea.right : 0, bMinPadding.right) + bPadding.right,
                bottom: Math.max((bForceInsets.bottom === 'always') ? safeArea.bottom : 0, bMinPadding.bottom) + bPadding.bottom,
            };
            console.log('SafeArea padding', padding);
            return (React.createElement(View, Object.assign({ pointerEvents: "box-none", ref: this.ref, onLayout: (e) => {
                    console.log('SafeAreaView onLayout');
                    if (onLayout)
                        onLayout(e);
                    if (this.ref.current) {
                        SafeArea.measureViewInsets(this.ref.current).then((r) => {
                            // @TODO: get x/y coordinate for pagination?
                            console.log('SafeAreaView measureNative', r);
                            this.setState({ insets: r });
                        });
                        // const view = (this.ref.current as any).getNode() as View;
                        this.ref.current.measureInWindow((x, y, width, height) => {
                            console.log('SafeAreaView.layout measured', x, y, width, height);
                            // for slide-in navigations?
                            if (x >= screen.width)
                                x = x % screen.width;
                            if (x < 0)
                                x = (x % screen.width) + screen.width;
                            if (y >= screen.height)
                                y = y % screen.height;
                            if (y < 0)
                                y = (y % screen.height) + screen.height;
                            console.log('SafeAreaView.layout measured2', x, y, width, height);
                        });
                    }
                } }, otherProps, { style: {
                    ...flatStyle,
                    paddingTop: padding.top,
                    paddingLeft: padding.left,
                    paddingRight: padding.right,
                    paddingBottom: padding.bottom,
                } })));
        }));
    }
}
//# sourceMappingURL=index.js.map