import * as React from 'react';
import { View } from 'react-native';
import { NavigationInjectedProps, NavigationScreenOptions } from 'react-navigation';
import { SafeAreaView } from 'react-native-mo-safearea';

export default class Test1 extends React.Component<NavigationInjectedProps> {
  public static navigationOptions: NavigationScreenOptions = {
    title: 'Test1',
  };

  public render() {
    return (
      <SafeAreaView style={{ backgroundColor: 'purple' }}>
        <View style={{ backgroundColor: 'red', flex: 1 }}>
        </View>
      </SafeAreaView>
    );
  }
}
