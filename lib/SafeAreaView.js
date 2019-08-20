import * as React from 'react';
import { View, StyleSheet, requireNativeComponent, Dimensions } from 'react-native';
import * as reactNative from 'react-native';
import { SafeAreaConsumer } from './SafeArea';
const ReactNativeMoSafeAreaView = requireNativeComponent && requireNativeComponent('ReactNativeMoSafeAreaView');
export class SafeAreaView extends React.PureComponent {
    constructor() {
        super(...arguments);
        this.state = {};
    }
    getStyleSafeArea(style) {
        const res = { top: true, left: true, right: true, bottom: true };
        if (typeof style === 'object' && style.safeArea) {
            const value = Array.isArray(style.safeArea) ? style.safeArea : [style.safeArea];
            res.top = value.indexOf('top') >= 0;
            res.left = value.indexOf('left') >= 0;
            res.right = value.indexOf('right') >= 0;
            res.bottom = value.indexOf('bottom') >= 0;
        }
        return res;
    }
    getStyleMinPadding(style) {
        const res = { top: 0, left: 0, right: 0, bottom: 0 };
        if (typeof style === 'object') {
            if (style.minPadding)
                res.top = res.bottom = res.left = res.right = style.minPadding;
            if (style.minPaddingHorizontal)
                res.left = res.right = style.minPaddingHorizontal;
            if (style.minPaddingVertical)
                res.top = res.bottom = style.minPaddingVertical;
            if (style.minPaddingTop)
                res.top = style.minPaddingTop;
            if (style.minPaddingLeft)
                res.left = style.minPaddingLeft;
            if (style.minPaddingRight)
                res.right = style.minPaddingRight;
            if (style.minPaddingBottom)
                res.bottom = style.minPaddingBottom;
        }
        return res;
    }
    getStylePadding(style) {
        const res = { top: 0, left: 0, right: 0, bottom: 0 };
        if (typeof style === 'object') {
            if (style.padding)
                res.top = res.bottom = res.left = res.right = style.padding;
            if (style.paddingHorizontal)
                res.left = res.right = style.paddingHorizontal;
            if (style.paddingVertical)
                res.top = res.bottom = style.paddingVertical;
            if (style.paddingTop)
                res.top = style.paddingTop;
            if (style.paddingLeft)
                res.left = style.paddingLeft;
            if (style.paddingRight)
                res.right = style.paddingRight;
            if (style.paddingBottom)
                res.bottom = style.paddingBottom;
        }
        return res;
    }
    render() {
        const { type, ...props } = this.props;
        if (type === 'disabled') {
            // sum minPadding and padding
            const { style, ...otherProps } = props;
            const flatStyle = StyleSheet.flatten(style || {});
            const styleMinPadding = this.getStyleMinPadding(flatStyle);
            const stylePadding = this.getStylePadding(flatStyle);
            return (React.createElement(View, Object.assign({ pointerEvents: "box-none" }, otherProps, { style: {
                    ...flatStyle,
                    paddingTop: styleMinPadding.top + stylePadding.top,
                    paddingLeft: styleMinPadding.left + stylePadding.left,
                    paddingRight: styleMinPadding.right + stylePadding.right,
                    paddingBottom: styleMinPadding.bottom + stylePadding.bottom,
                } })));
        }
        else if (type === 'react') {
            // @TODO: remove
            return (React.createElement(reactNative.SafeAreaView, Object.assign({}, props)));
        }
        else if ((type === 'native' || type === undefined) && ReactNativeMoSafeAreaView) {
            const { style, ...otherProps } = props;
            const flatStyle = StyleSheet.flatten(style || {});
            const styleSafeArea = this.getStyleSafeArea(flatStyle);
            const styleMinPadding = this.getStyleMinPadding(flatStyle);
            const stylePadding = this.getStylePadding(flatStyle);
            return (React.createElement(ReactNativeMoSafeAreaView, Object.assign({ pointerEvents: "box-none" }, otherProps, { safeAreaTop: styleSafeArea.top, safeAreaLeft: styleSafeArea.left, safeAreaRight: styleSafeArea.right, safeAreaBottom: styleSafeArea.bottom, minPaddingTop: styleMinPadding.top, minPaddingLeft: styleMinPadding.left, minPaddingRight: styleMinPadding.right, minPaddingBottom: styleMinPadding.bottom, addPaddingTop: stylePadding.top, addPaddingLeft: stylePadding.left, addPaddingRight: stylePadding.right, addPaddingBottom: stylePadding.bottom, style: {
                    ...flatStyle,
                } })));
        }
        else if (type === 'layout') {
            return (React.createElement(SafeAreaConsumer, null, (safeArea) => {
                const { style, onLayout, ...otherProps } = props;
                const flatStyle = StyleSheet.flatten(style || {});
                const styleSafeArea = this.getStyleSafeArea(flatStyle);
                const styleMinPadding = this.getStyleMinPadding(flatStyle);
                const stylePadding = this.getStylePadding(flatStyle);
                const screen = Dimensions.get('screen');
                if (this.state.layout) {
                    console.log('XXX', screen.height, this.state.layout.y, this.state.layout.height);
                }
                // we also want our layout...
                // use Animated.View ?
                return (React.createElement(View, Object.assign({ pointerEvents: "box-none", onLayout: (e) => {
                        if (onLayout)
                            onLayout(e);
                        this.setState({ layout: e.nativeEvent.layout });
                    } }, otherProps, { style: {
                        ...flatStyle,
                        paddingTop: Math.max(styleSafeArea.top ? safeArea.top : 0, styleMinPadding.top) + stylePadding.top,
                        paddingLeft: Math.max(styleSafeArea.left ? safeArea.left : 0, styleMinPadding.left) + stylePadding.left,
                        paddingRight: Math.max(styleSafeArea.right ? safeArea.right : 0, styleMinPadding.right) + stylePadding.right,
                        paddingBottom: Math.max(styleSafeArea.bottom ? safeArea.bottom : 0, styleMinPadding.bottom) + stylePadding.bottom,
                    } })));
            }));
        }
        else if (type === 'simple' || true) {
            return (React.createElement(SafeAreaConsumer, null, (safeArea) => {
                const { style, ...otherProps } = props;
                const flatStyle = StyleSheet.flatten(style || {});
                console.log('flatStyle', flatStyle);
                const styleSafeArea = this.getStyleSafeArea(flatStyle);
                const styleMinPadding = this.getStyleMinPadding(flatStyle);
                const stylePadding = this.getStylePadding(flatStyle);
                return (React.createElement(View, Object.assign({ pointerEvents: "box-none" }, otherProps, { style: {
                        ...flatStyle,
                        paddingTop: Math.max(styleSafeArea.top ? safeArea.top : 0, styleMinPadding.top) + stylePadding.top,
                        paddingLeft: Math.max(styleSafeArea.left ? safeArea.left : 0, styleMinPadding.left) + stylePadding.left,
                        paddingRight: Math.max(styleSafeArea.right ? safeArea.right : 0, styleMinPadding.right) + stylePadding.right,
                        paddingBottom: Math.max(styleSafeArea.bottom ? safeArea.bottom : 0, styleMinPadding.bottom) + stylePadding.bottom,
                    } })));
            }));
        }
    }
}
//# sourceMappingURL=SafeAreaView.js.map