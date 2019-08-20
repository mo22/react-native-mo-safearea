import * as React from 'react';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';

const AppNavigator = createStackNavigator({
  Menu: { screen: require('./Menu').default },
  ScrollViewInsideSafeArea: { screen: require('./ScrollViewInsideSafeArea').default },
  SafeAreaInsideScrollView: { screen: require('./SafeAreaInsideScrollView').default },
});

const AppContainer = createAppContainer(AppNavigator);

class App extends React.PureComponent<{}> {
  public render() {
    return (
      <AppContainer
        persistNavigationState={async (navState) => {
          try {
            await AsyncStorage.setItem('navState', JSON.stringify(navState));
          } catch (e) {
            console.error(e);
          }
        }}
        loadNavigationState={async () => {
          return JSON.parse(await AsyncStorage.getItem('navState') || 'null');
        }}
      />
    );
  }
}

export default App;
