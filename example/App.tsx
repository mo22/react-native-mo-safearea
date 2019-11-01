import * as React from 'react';
import './patchReactNavigationSafeAreaView';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { SafeArea } from 'react-native-mo-safearea';

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
      header: null,
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
  public async componentDidMount() {
    if (SafeArea.android.Module) {
      console.log('getCompatInfo', await SafeArea.android.Module.getCompatInfo());
    }
  }
  public render() {
    return (
      <AppContainer />
    );
  }
}

export default App;
