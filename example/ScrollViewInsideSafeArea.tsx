import * as React from 'react';
import { View, KeyboardAvoidingView } from 'react-native';
import { NavigationInjectedProps, ScrollView, NavigationActions } from 'react-navigation';
import { SafeAreaView, withSafeAreaDecorator, SafeAreaInjectedProps } from 'react-native-mo-safearea';
import { ListItem } from 'react-native-elements';
import Header from './Header';

function keysOf<T extends {}>(obj: T): (keyof T)[] {
  return Object.keys(obj) as any;
}

@withSafeAreaDecorator
export default class ScrollViewInsideSafeArea extends React.Component<NavigationInjectedProps & SafeAreaInjectedProps, ScrollViewInsideSafeArea['state']> {
  public state = {
    forceInsets: {
      top: 'auto' as 'always'|'never'|'auto',
      left: 'auto' as 'always'|'never'|'auto',
      right: 'auto' as 'always'|'never'|'auto',
      bottom: 'auto' as 'always'|'never'|'auto',
    },
    minPadding: {
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    padding: {
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    includeSystemWindows: true,
    animateSystemWindows: true,
  };

  public render() {
    const forceInsets: ('always'|'never'|'auto')[] = ['always', 'never', 'auto'];

    return (
      <SafeAreaView
        style={{
          backgroundColor: 'purple',
          flex: 1,
        }}
        minPadding={this.state.minPadding}
        padding={this.state.padding}
        forceInsets={this.state.forceInsets}
        includeSystemWindows={this.state.includeSystemWindows}
        animateSystemWindows={this.state.animateSystemWindows}
      >
        <KeyboardAvoidingView style={{ flex: 1 }}>
          <ScrollView style={{ backgroundColor: 'white', flex: 1 }}>
            <Header />

            <View style={{ height: 20 }} />

            {this.props.safeArea.safeArea && keysOf(this.props.safeArea.safeArea).map((i) => (
              <ListItem
                key={i}
                title={'safeArea' + i}
                rightTitle={this.props.safeArea.safeArea[i].toString()}
              />
            ))}
            {this.props.safeArea.system && keysOf(this.props.safeArea.system).map((i) => (
              <ListItem
                key={i}
                title={'system.' + i}
                rightTitle={this.props.safeArea.system[i].toString()}
              />
            ))}

            <View style={{ height: 20 }} />

            {keysOf(this.state.forceInsets).map((i) => (
              <ListItem
                key={i}
                title={'forceInsets.' + i}
                buttonGroup={{
                  selectedIndex: forceInsets.indexOf(this.state.forceInsets[i]),
                  buttons: forceInsets as string[],
                  onPress: (selectedIndex) => {
                    this.state.forceInsets[i] = forceInsets[selectedIndex];
                    this.forceUpdate();
                  },
                }}
              />
            ))}

            <View style={{ height: 20 }} />

            {keysOf(this.state.padding).map((i) => (
              <ListItem
                key={i}
                title={'padding.' + i}
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
                title={'minPadding.' + i}
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

            <View style={{ height: 20 }} />

            <ListItem
              onPress={() => {
                this.props.navigation.dispatch(NavigationActions.navigate({ routeName: 'Test' }));
              }}
              title="show Test"
            />

            <View style={{ height: 20 }} />

            <ListItem
              title="includeSystemWindows"
              switch={{
                value: this.state.includeSystemWindows,
                onValueChange: (v) => this.setState({ includeSystemWindows: v }),
              }}
            />

            <ListItem
              title="animateSystemWindows"
              switch={{
                value: this.state.animateSystemWindows,
                onValueChange: (v) => this.setState({ animateSystemWindows: v }),
              }}
            />

          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}
