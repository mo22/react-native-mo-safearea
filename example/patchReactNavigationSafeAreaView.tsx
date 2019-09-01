import * as React from 'react';
import { SafeAreaView as SafeAreaViewOrig, SafeAreaViewProps as SafeAreaViewOrigProps } from 'react-navigation';
import { SafeAreaView } from 'react-native-mo-safearea';
import { View } from 'react-native';

SafeAreaViewOrig.prototype.render = function render() {
  const props = this.props as SafeAreaViewOrigProps;
  const { forceInset, ...otherProps } = props;
  console.log('XXX', forceInset);
  // 09-01 17:13:44.860  4890  5559 I ReactNativeJS: 'XXX', { top: 'always', bottom: 'never', horizontal: 'always' }
  return (
    <SafeAreaView forceInsets={forceInset}>
      <View {...otherProps} />
    </SafeAreaView>
  );
};
