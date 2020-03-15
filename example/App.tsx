import 'react-native-gesture-handler';
import * as React from 'react';
import './patchReactNavigationSafeAreaView';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

const AppNavigator = createStackNavigator({
  Menu: {
    screen: require('./Menu').default,
    navigationOptions: {
      title: 'Menu',
    },
  },
  ScrollViewInsideSafeArea: {
    screen: require('./ScrollViewInsideSafeArea').default,
    navigationOptions: {
      title: 'ScrollViewInsideSafeArea',
    },
  },
  SafeAreaInsideScrollView: {
    screen: require('./SafeAreaInsideScrollView').default,
    navigationOptions: {
      title: 'SafeAreaInsideScrollView',
      header: undefined,
      headerShown: false,
    },
  },
  Test: {
    screen: require('./Test').default,
    navigationOptions: {
      title: 'Test',
    },
  },
});

const AppContainer = createAppContainer(AppNavigator);

class App extends React.PureComponent<{}> {
  public render() {
    return (
      <AppContainer />
    );
  }
}

export default App;
