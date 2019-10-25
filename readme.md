# react-native-mo-safearea

## Installation
Install just like your ordinary react-native module.

## Reason

Some areas of the screen are not freely usable:
- cutouts for camera
- translucent status / navigation bars
- keyboard / "system windows" in android

This module provides the dimensions of those areas and a view that adds padding to avoid these areas.

## Fullscreen mode in Android

res/values/styles.xml
```
    <style name="AppTheme" parent="Theme.AppCompat.Light.NoActionBar">
        <item name="android:windowTranslucentStatus">true</item>
        <item name="android:windowTranslucentNavigation">true</item>
    </style>
```

## Working with react-navigation

see example/patchReactNavigationSafeAreaView.tsx

## Usage

Please check the [example/](example/) code.

```ts
import { SafeArea } from 'react-native-mo-safearea';

const sub = SafeArea.safeArea.subscribe((safeArea) => {
  // minimum safe area (top, left, right, bottom)
  console.log(safeArea.safeArea);
  // additional safe area for system windows (keyboard)
  console.log(safeArea.system);
});
sub.release();

return (
  <SafeAreaConsumer>
    {(safeArea) => (
      <SomeObject safeArea={safeArea} />
    )}
  </SafeAreaConsumer>
);

return (
  <SafeAreaView
    forceInsets={{ top: 'always', horizontal: 'always', bottom: 'auto' }}
    includeSystemWindows={true} // true: include keyboard
  >
    <Content />
  </SafeAreaView>
);

```
