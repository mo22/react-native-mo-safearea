import * as React from 'react';
import { SafeAreaView as SafeAreaViewOrig, SafeAreaViewProps as SafeAreaViewOrigProps } from 'react-navigation';
import { SafeAreaView, SafeAreaViewStyle } from 'react-native-mo-safearea';
import { View } from 'react-native';

SafeAreaViewOrig.prototype.render = function render() {
  const props = this.props as SafeAreaViewOrigProps;
  const { forceInset, ...otherProps } = props;
  let safeArea: SafeAreaViewStyle['safeArea'];
  if (forceInset) {
    console.log('forceInset', forceInset);
    safeArea = {};
    if (forceInset.top === 'always') safeArea.top = true;
    if (forceInset.left === 'always') safeArea.left = true;
    if (forceInset.right === 'always') safeArea.right = true;
    if (forceInset.bottom === 'always') safeArea.bottom = true;
    if (forceInset.horizontal === 'always') safeArea.left = safeArea.right = true;
    if (forceInset.vertical === 'always') safeArea.top = safeArea.bottom = true;
    // if (forceInset.top === 'never') safeArea.top = false;
    // if (forceInset.left === 'never') safeArea.left = false;
    // if (forceInset.right === 'never') safeArea.right = false;
    // if (forceInset.bottom === 'never') safeArea.bottom = false;
    console.log('safeArea', safeArea);
  }
  return (
    <SafeAreaView type="simple" style={{ safeArea: safeArea }}>
      <View
        {...otherProps}
      />
    </SafeAreaView>
  );
};
