import * as React from 'react';
import { SafeAreaView as SafeAreaViewOrig, SafeAreaViewProps as SafeAreaViewOrigProps } from 'react-navigation';
import { SafeAreaView } from 'react-native-mo-safearea';
import { StyleSheet, View } from 'react-native';


SafeAreaViewOrig.prototype.render = function render() {
  const props = this.props as SafeAreaViewOrigProps;
  const { children, forceInset, style, ...otherProps } = props;
  const flatStyle = StyleSheet.flatten(style);
  // console.log('forceInset', forceInset);
  // console.log('flatStyle', flatStyle);
  // console.log('children', Array.isArray(children), children.length);
  // type="simple"
  // safeArea: ['top', 'left', 'bottom', 'bottom'],
  return (
    <SafeAreaView type="simple">
      <View
        style={{
          ...flatStyle,
          backgroundColor: 'red',
        }}
        {...otherProps}
      >
        {children}
      </View>
    </SafeAreaView>
  );
};
