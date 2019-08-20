import * as React from 'react';
import { createStackNavigator, createAppContainer } from 'react-navigation';

const AppNavigator = createStackNavigator({
  Menu: { screen: require('./Menu').default },
  Test1: { screen: require('./Test1').default },
  Test2: { screen: require('./Test2').default },
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
