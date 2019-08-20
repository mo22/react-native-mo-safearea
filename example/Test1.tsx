import * as React from 'react';
import { View } from 'react-native';
import { NavigationInjectedProps, NavigationScreenOptions } from 'react-navigation';

export default class Test1 extends React.Component<NavigationInjectedProps> {
  public static navigationOptions: NavigationScreenOptions = {
    title: 'Test1',
  };

  public render() {
    return (
      <View style={{ backgroundColor: 'red', flex: 1 }}>
      </View>
    );
  }
}
