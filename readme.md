## TODO

- [ ] problem: initial layout with react-navigation is often off-screen.

- [ ] add something to willUnmount?!

- [ ] SafeAreaView: forceInsets always/never/auto? true/false/undefined?
- [ ] SafeAreaView: args --as style or-- attribute?

- [ ] native debug mode switch?

- [ ] measure version

- [ ] docs
- [ ] publish

- [ ] npx react-native config ?! react-native.config.js ? https://github.com/react-native-community/cli/blob/master/docs/platforms.md
- [ ] .ios.ts / .android.ts / .web.ts  with common .d.ts ?

```
$ npm publish
```

## Usage

```js
import {} ?
```

## react library setup notes

- react-native init example?
- using file:../ does not obey package.json files or npmignore. Need to use git? No git+file.
- update package.json
- rename *.podspec
- update android/src/main/AndroidManifest.xml
- update android/src/main/java/*
- rename ios/*
- update ios/*/project.pbxproj search and replace?

## problem: events

- events / BehaviorSubject use rxjs? something else? need current value and changes?
- rxjs.from() / rxjs.fromEvent() ?
- addEventListener() / removeEventListener()? cumbersome. sucks.

## problem: higher order components

- React.forwardRef() returns a non-constructor element making it unusable for
  class / function decorators. NOT TRUE! a decorator can return a number just
  fine.

- HOCs create a new class without static fields, which breaks react-navigation's
  navigationOptions prop

- instead internally subscribe Subject to state? not the supposed react way

```js
class Test extends React.PureComponent<{ value: Subject<number> }> {
  state: {
    value: number;
  }
  _some_subscribe_props_value_to_state_value_stuff_
}
```

- React could provide some static field with wrappers?
```js
class Test extends React.PureComponent<{}> {
  static inject = (Self, props) => (
    <Self {...props} number={1} />
  );
  // typings would be bad.
}
```

- who is havaing a problem here - actually just react-navigation?
