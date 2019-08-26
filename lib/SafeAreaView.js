import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import * as reactNative from 'react-native';
import { SafeAreaConsumer } from './SafeArea';
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
export class SafeAreaView extends React.PureComponent {
    constructor() {
        super(...arguments);
        this.state = {};
    }
    // private ref = React.createRef<View>();
    render() {
        const { minPadding, padding, forceInsets, type, ...props } = this.props;
        const bMinPadding = fromBorders(minPadding, 0);
        const bPadding = fromBorders(padding, 0);
        const bForceInsets = fromBorders(forceInsets);
        if (type === 'disabled') {
            // sum minPadding and padding
            const { style, ...otherProps } = props;
            const flatStyle = StyleSheet.flatten(style || {});
            return (React.createElement(View, Object.assign({ pointerEvents: "box-none" }, otherProps, { style: {
                    ...flatStyle,
                    paddingTop: bMinPadding.top + bPadding.top,
                    paddingLeft: bMinPadding.left + bPadding.left,
                    paddingRight: bMinPadding.right + bPadding.right,
                    paddingBottom: bMinPadding.bottom + bPadding.bottom,
                } })));
        }
        else if (type === 'react') {
            // @TODO: remove
            return (React.createElement(reactNative.SafeAreaView, Object.assign({}, props)));
            // } else if ((type === 'native' || type === undefined) && ReactNativeMoSafeAreaView) {
            //   const { style, ...otherProps } = props;
            //   const flatStyle = StyleSheet.flatten(style || {});
            //   console.log('render native with', styleSafeArea);
            //   return (
            //     <ReactNativeMoSafeAreaView
            //       pointerEvents="box-none"
            //       {...otherProps}
            //       safeAreaTop={styleSafeArea.top}
            //       safeAreaLeft={styleSafeArea.left}
            //       safeAreaRight={styleSafeArea.right}
            //       safeAreaBottom={styleSafeArea.bottom}
            //       minPaddingTop={bMinPadding.top}
            //       minPaddingLeft={bMinPadding.left}
            //       minPaddingRight={bMinPadding.right}
            //       minPaddingBottom={bMinPadding.bottom}
            //       addPaddingTop={bPadding.top}
            //       addPaddingLeft={bPadding.left}
            //       addPaddingRight={bPadding.right}
            //       addPaddingBottom={bPadding.bottom}
            //       style={{
            //         ...flatStyle,
            //       }}
            //     />
            //   );
            // } else if (type === 'layout') {
            //   return (
            //     <SafeAreaConsumer>
            //       {(safeArea) => {
            //         const { style, onLayout, ...otherProps } = props;
            //         const flatStyle = StyleSheet.flatten(style || {});
            //         const screen = Dimensions.get('screen');
            //         if (this.state.layout) {
            //           console.log('XXX layout is', screen.height, this.state.layout.y, this.state.layout.height);
            //         }
            //         // we also want our layout...
            //         // use Animated.View ?
            //         return (
            //           <View
            //             pointerEvents="box-none"
            //             ref={this.ref}
            //             onLayout={(e) => {
            //               if (onLayout) onLayout(e);
            //               // this.setState({ layout: e.nativeEvent.layout });
            //               if (this.ref.current) {
            //                 SafeArea.measureViewInsets(this.ref.current).then((r) => {
            //                   console.log('XXX measureNative', r);
            //                 });
            //                 this.ref.current.measureInWindow((x, y, width, height) => {
            //                   console.log('XXX measured', x, y, width, height);
            //                   this.setState({ layout: { x: x, y: y, width: width, height: height }});
            //                 });
            //               }
            //             }}
            //             {...otherProps}
            //             style={{
            //               ...flatStyle,
            //               paddingTop: Math.max(styleSafeArea.top ? safeArea.top : 0, bMinPadding.top) + bPadding.top,
            //               paddingLeft: Math.max(styleSafeArea.left ? safeArea.left : 0, bMinPadding.left) + bPadding.left,
            //               paddingRight: Math.max(styleSafeArea.right ? safeArea.right : 0, bMinPadding.right) + bPadding.right,
            //               paddingBottom: Math.max(styleSafeArea.bottom ? safeArea.bottom : 0, bMinPadding.bottom) + bPadding.bottom,
            //             }}
            //           />
            //         );
            //       }}
            //     </SafeAreaConsumer>
            //   );
        }
        else if (type === 'simple') {
            return (React.createElement(SafeAreaConsumer, null, (safeArea) => {
                const { style, ...otherProps } = props;
                const flatStyle = StyleSheet.flatten(style || {});
                return (React.createElement(View, Object.assign({ pointerEvents: "box-none" }, otherProps, { style: {
                        ...flatStyle,
                        paddingTop: Math.max((bForceInsets.top === 'always') ? safeArea.top : 0, bMinPadding.top) + bPadding.top,
                        paddingLeft: Math.max((bForceInsets.left === 'always') ? safeArea.left : 0, bMinPadding.left) + bPadding.left,
                        paddingRight: Math.max((bForceInsets.right === 'always') ? safeArea.right : 0, bMinPadding.right) + bPadding.right,
                        paddingBottom: Math.max((bForceInsets.bottom === 'always') ? safeArea.bottom : 0, bMinPadding.bottom) + bPadding.bottom,
                    } })));
            }));
        }
    }
}
//# sourceMappingURL=SafeAreaView.js.map