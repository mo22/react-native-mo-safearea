import * as React from 'react';
import { SafeAreaView as SafeAreaViewOrig, SafeAreaViewProps as SafeAreaViewOrigProps } from 'react-navigation';
import { SafeAreaView } from 'react-native-mo-safearea';

SafeAreaViewOrig.prototype.render = function render() {
  const props = this.props as SafeAreaViewOrigProps;
  const { forceInset, ...otherProps } = props;
  return (
    <SafeAreaView type="simple" forceInsets={forceInset} {...otherProps} />
  );
};
