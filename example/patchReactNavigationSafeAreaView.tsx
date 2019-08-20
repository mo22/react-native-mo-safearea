// import * as React from 'react';
import { SafeAreaView, SafeAreaViewProps } from 'react-navigation';

SafeAreaView.prototype.render = function render() {
  const props = this.props as SafeAreaViewProps;
  console.log('GOTIT', Object.keys(props));
  return null;
};
