# react-native-mo-safearea

## Reason

Some areas of the screen are not freely usable:
- cutouts for camera
- translucent status / navigation bars

This module provides the dimensions of those areas and a view that adds padding to avoid these areas.

## Usage

see example/ project for examples.
[link]

```js
import { SafeArea } from 'react-native-mo-safearea';

SafeArea.safeArea.subscribe();

SafeAreaConsumer

SafeAreaView

```

## TODO
- [ ] add an additional view somewhere
- [ ] subnavigation?
- [ ] problem: initial layout with react-navigation is often off-screen.
- [ ] docs
- [ ] publish

## Issues & Caveats

- If the `SafeAreaView` is animated off-screen the padding might get jerky.

- We do not provide a higher-order-component wrapper (`withSafeArea`) as these can be a bit tricky and have issues:
  - References are one issue (`React.forwardRef` can help here)
  - Access to static properties do not work (bad for `react-navigation`)
  - Does not work as decorator as decorators may not return a different type as result

- This library depends on Package `mo-core` for `StatefulEvent`. Ideally this could be done via `rxjs` `BehaviorSubject` (large dependency) or native `Observer` (still not in JS spec).

## react library setup notes

- npx react-native config ?! react-native.config.js ? https://github.com/react-native-community/cli/blob/master/docs/platforms.md
- metro bundler does not tree-shake based on Platform.OS

- react-native init example?
- using file:../ does not obey package.json files or npmignore. Need to use git? No git+file.
- update package.json
- rename *.podspec
- update android/src/main/AndroidManifest.xml
- update android/src/main/java/*
- rename ios/*
- update ios/*/project.pbxproj search and replace?

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
