import * as React from 'react';
import { View, KeyboardAvoidingView } from 'react-native';
import { NavigationInjectedProps, NavigationScreenOptions, ScrollView } from 'react-navigation';
import { SafeAreaView, withSafeArea, SafeAreaInjectedProps } from 'react-native-mo-safearea';
import { ListItem } from 'react-native-elements';

function keysOf<T extends {}>(obj: T): (keyof T)[] {
  return Object.keys(obj) as any;
}

@withSafeArea
export default class Test1 extends React.Component<NavigationInjectedProps & SafeAreaInjectedProps> {
  public static navigationOptions: NavigationScreenOptions = {
    title: 'Test1',
  };

  public state = {
    safeArea: {
      safeAreaTop: true,
      safeAreaLeft: true,
      safeAreaRight: true,
      safeAreaBottom: true,
    },
    minPadding: {
      minPaddingTop: 0,
      minPaddingLeft: 0,
      minPaddingRight: 0,
      minPaddingBottom: 0,
    },
    padding: {
      paddingTop: 0,
      paddingLeft: 0,
      paddingRight: 0,
      paddingBottom: 0,
    },
  };

  public render() {
    console.log('prop', this.props);
    // switches / inputs for safeArea/padding?
    return (
      <SafeAreaView
        style={{
          backgroundColor: 'purple',
          flex: 1,
          ...this.state.safeArea,
          ...this.state.minPadding,
          ...this.state.padding,
        }}
      >
        <KeyboardAvoidingView style={{ flex: 1 }}>
          <ScrollView style={{ backgroundColor: 'red', flex: 1 }}>

            <View style={{ height: 20 }} />

            {this.props.safeArea && keysOf(this.props.safeArea).map((i) => (
              <ListItem
                key={i}
                title={i}
                rightTitle={this.props.safeArea[i].toString()}
              />
            ))}

            <View style={{ height: 20 }} />

            {keysOf(this.state.safeArea).map((i) => (
              <ListItem
                key={i}
                title={i}
                switch={{
                  value: this.state.safeArea[i],
                  onValueChange: (value) => {
                    this.state.safeArea[i] = value;
                    this.forceUpdate();
                  },
                }}
              />
            ))}

            <View style={{ height: 20 }} />

            {keysOf(this.state.padding).map((i) => (
              <ListItem
                key={i}
                title={i}
                input={{
                  value: this.state.padding[i].toString(),
                  onChangeText: (value) => {
                    this.state.padding[i] = parseFloat(value);
                    this.forceUpdate();
                  },
                  keyboardType: 'numeric',
                }}
              />
            ))}

            <View style={{ height: 20 }} />

            {keysOf(this.state.minPadding).map((i) => (
              <ListItem
                key={i}
                title={i}
                input={{
                  value: this.state.minPadding[i].toString(),
                  onChangeText: (value) => {
                    this.state.minPadding[i] = parseFloat(value);
                    this.forceUpdate();
                  },
                  keyboardType: 'numeric',
                }}
              />
            ))}

          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}
