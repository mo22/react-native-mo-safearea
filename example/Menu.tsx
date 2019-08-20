import * as React from 'react';
import { ScrollView } from 'react-native';
import { NavigationInjectedProps, NavigationScreenOptions, NavigationActions } from 'react-navigation';
import { ListItem } from 'react-native-elements';

export default class Menu extends React.Component<NavigationInjectedProps> {
  public static navigationOptions: NavigationScreenOptions = {
    title: 'Menu',
  };

  public render() {
    return (
      <ScrollView>

        <ListItem
          onPress={() => {
            this.props.navigation.dispatch(NavigationActions.navigate({ routeName: 'Test1' }));
          }}
          title="Test1"
        />

        <ListItem
          onPress={() => {
            this.props.navigation.dispatch(NavigationActions.navigate({ routeName: 'Test2' }));
          }}
          title="Test2"
        />

      </ScrollView>
    );
  }
}
