import * as React from 'react';
import './patchReactNavigationSafeAreaView';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';

const AppNavigator = createStackNavigator({
  Menu: { screen: require('./Menu').default },
  ScrollViewInsideSafeArea: { screen: require('./ScrollViewInsideSafeArea').default },
  SafeAreaInsideScrollView: { screen: require('./SafeAreaInsideScrollView').default },
});

const AppContainer = createAppContainer(AppNavigator);

// does not work.
// const test = from(SafeArea.safeArea as unknown as Subscribable<Required<Insets>>);
// // import { publishBehavior } from 'rxjs/operators';
// test.subscribe({
//   next: (val) => {
//     console.log('new insets', val);
//   },
// });


class App extends React.PureComponent<{}> {
  public render() {
    return (
      <AppContainer
        persistNavigationState={async (navState) => {
          try {
            await AsyncStorage.setItem('navState', JSON.stringify(navState));
          } catch (e) {
          }
        }}
        loadNavigationState={async () => {
          try {
            return JSON.parse(await AsyncStorage.getItem('navState') || 'null');
          } catch (e) {
            return null;
          }
        }}
      />
    );
  }
}

export default App;
