import * as React from 'react';
import { View, findNodeHandle, StyleSheet, Dimensions } from 'react-native';
import { StatefulEvent } from 'mo-core';
import * as ios from './ios';
import * as android from './android';
export class SafeArea {
    /**
     * be verbose
     */
    static setVerbose(verbose) {
        if (ios.Module) {
            ios.Module.setVerbose(verbose);
        }
        else if (android.Module) {
            android.Module.setVerbose(verbose);
        }
    }
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
        return {
            safeArea: ios.Module.initialSafeArea,
            system: { left: 0, top: 0, right: 0, bottom: 0 },
        };
    }
    if (android.Module) {
        android.Module.getSafeArea().then((rs) => {
            if (!rs)
                return;
            SafeArea.safeArea.UNSAFE_setValue({
                safeArea: rs.stableInsets,
                system: {
                    top: rs.systemWindowInsets.top - rs.stableInsets.top,
                    left: rs.systemWindowInsets.left - rs.stableInsets.left,
                    right: rs.systemWindowInsets.right - rs.stableInsets.right,
                    bottom: rs.systemWindowInsets.bottom - rs.stableInsets.bottom,
                },
            });
        });
    }
    return {
        safeArea: { left: 0, top: 0, right: 0, bottom: 0 },
        system: { left: 0, top: 0, right: 0, bottom: 0 },
    };
})(), (emit) => {
    const partialEmit = (value) => {
        const newValue = { ...SafeArea.safeArea.value, ...value };
        if (JSON.stringify(newValue) === JSON.stringify(SafeArea.safeArea.value))
            return;
        emit(newValue);
    };
    if (ios.Events && ios.Module) {
        const sub = ios.Events.addListener('ReactNativeMoSafeArea', (rs) => {
            if (rs.safeArea !== undefined) {
                partialEmit({
                    safeArea: rs.safeArea,
                });
            }
            if (rs.keyboardArea !== undefined) {
                const insets = {
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                };
                if (rs.keyboardArea.end.x === 0 && rs.keyboardArea.end.width === Dimensions.get('screen').width) {
                    // full width
                }
                else if (rs.keyboardArea.end.x === 0) {
                    insets.left = rs.keyboardArea.end.width;
                }
                else if (rs.keyboardArea.end.x + rs.keyboardArea.end.width === Dimensions.get('screen').width) {
                    insets.right = rs.keyboardArea.end.width;
                }
                else {
                    console.log('ReactNativeMoSafeArea x center?', rs.keyboardArea);
                }
                if (rs.keyboardArea.end.y === 0 && rs.keyboardArea.end.height === Dimensions.get('screen').height) {
                    // full height
                }
                else if (rs.keyboardArea.end.y <= 0) {
                    insets.top = Math.max(0, rs.keyboardArea.end.y + rs.keyboardArea.end.height);
                }
                else if (rs.keyboardArea.end.y + rs.keyboardArea.end.height >= Dimensions.get('screen').height) {
                    insets.bottom = Math.max(0, Dimensions.get('screen').height - rs.keyboardArea.end.y);
                }
                else {
                    // can happen?
                    console.log('ReactNativeMoSafeArea y center?', rs.keyboardArea);
                }
                partialEmit({
                    system: insets,
                });
            }
        });
        ios.Module.enableSafeAreaEvent(true);
        return () => {
            sub.remove();
            ios.Module.enableSafeAreaEvent(false);
        };
    }
    else if (android.Events && android.Module) {
        android.Module.getSafeArea().then((rs) => {
            if (!rs)
                return;
            partialEmit({
                safeArea: rs.stableInsets,
                system: {
                    top: rs.systemWindowInsets.top - rs.stableInsets.top,
                    left: rs.systemWindowInsets.left - rs.stableInsets.left,
                    right: rs.systemWindowInsets.right - rs.stableInsets.right,
                    bottom: rs.systemWindowInsets.bottom - rs.stableInsets.bottom,
                },
            });
        });
        const sub = android.Events.addListener('ReactNativeMoSafeArea', (rs) => {
            partialEmit({
                safeArea: rs.stableInsets,
                system: {
                    top: rs.systemWindowInsets.top - rs.stableInsets.top,
                    left: rs.systemWindowInsets.left - rs.stableInsets.left,
                    right: rs.systemWindowInsets.right - rs.stableInsets.right,
                    bottom: rs.systemWindowInsets.bottom - rs.stableInsets.bottom,
                },
            });
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
 * stateful event that provides the current safe area insets
 */
SafeArea.oldSafeArea = new StatefulEvent((() => {
    return SafeArea.safeArea.value.safeArea;
})(), (emit) => {
    const sub = SafeArea.safeArea.subscribe((rs) => {
        emit(rs.safeArea);
    });
    return () => {
        sub.release();
    };
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
    else if (value !== undefined && typeof value === 'number') {
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
        const { minPadding, padding, forceInsets, includeSystemWindows, ...props } = this.props;
        const bMinPadding = fromBorders(minPadding, 0);
        const bPadding = fromBorders(padding, 0);
        const bForceInsets = fromBorders(forceInsets, 'auto');
        const needAuto = (bForceInsets.top === 'auto') || (bForceInsets.left === 'auto') || (bForceInsets.right === 'auto') || (bForceInsets.bottom === 'auto');
        return (React.createElement(SafeAreaConsumer, null, (safeAreaInfo) => {
            const { style, onLayout, ...otherProps } = props;
            const flatStyle = StyleSheet.flatten(style || {});
            const screen = Dimensions.get('screen');
            // console.log('SafeArea safeArea', safeAreaInfo.safeArea);
            // console.log('SafeArea system', safeAreaInfo.system);
            // console.log('SafeArea screen', screen);
            // console.log('SafeArea bMinPadding', bMinPadding);
            // console.log('SafeArea bPadding', bPadding);
            const safeArea = { ...safeAreaInfo.safeArea };
            if (includeSystemWindows !== false) {
                safeArea.top += safeAreaInfo.system.top;
                safeArea.left += safeAreaInfo.system.left;
                safeArea.right += safeAreaInfo.system.right;
                safeArea.bottom += safeAreaInfo.system.bottom;
            }
            const insets = {
                top: safeArea.top,
                left: safeArea.left,
                right: safeArea.right,
                bottom: safeArea.bottom,
            };
            if (this.state.insets) {
                if (bForceInsets.top === 'auto')
                    insets.top = Math.max(0, Math.min(safeArea.top, safeArea.top - this.state.insets.top));
                if (bForceInsets.left === 'auto')
                    insets.left = Math.max(0, Math.min(safeArea.left, safeArea.left - this.state.insets.left));
                if (bForceInsets.right === 'auto')
                    insets.right = Math.max(0, Math.min(safeArea.right, safeArea.right - this.state.insets.right));
                if (bForceInsets.bottom === 'auto')
                    insets.bottom = Math.max(0, Math.min(safeArea.bottom, safeArea.bottom - this.state.insets.bottom));
            }
            if (bForceInsets.top === 'never')
                insets.top = 0;
            if (bForceInsets.left === 'never')
                insets.left = 0;
            if (bForceInsets.right === 'never')
                insets.right = 0;
            if (bForceInsets.bottom === 'never')
                insets.bottom = 0;
            // console.log('SafeArea insets', insets);
            const padding = {
                top: Math.max(insets.top, bMinPadding.top) + bPadding.top,
                left: Math.max(insets.left, bMinPadding.left) + bPadding.left,
                right: Math.max(insets.right, bMinPadding.right) + bPadding.right,
                bottom: Math.max(insets.bottom, bMinPadding.bottom) + bPadding.bottom,
            };
            // console.log('SafeArea padding', padding);
            return (React.createElement(View, Object.assign({ pointerEvents: "box-none", ref: this.ref, onLayout: (e) => {
                    if (onLayout)
                        onLayout(e);
                    if (needAuto && this.ref.current) {
                        SafeArea.measureViewInsets(this.ref.current).then((r) => {
                            if (!r)
                                return;
                            r.right = r.right % screen.width;
                            r.left = r.left % screen.width;
                            r.top = r.top % screen.height;
                            r.bottom = r.bottom % screen.height;
                            this.setState({ insets: r });
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