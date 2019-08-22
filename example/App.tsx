import * as React from 'react';
import './patchReactNavigationSafeAreaView';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';

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

function TestDecorator<T>(x: T): any {
  return 3;
}
@TestDecorator
export class TestClass {
}
console.log('XXX', TestClass);


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
