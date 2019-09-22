# react-native-mo-safearea

## Installation
Install just like your ordinary react-native module.

## Reason

Some areas of the screen are not freely usable:
- cutouts for camera
- translucent status / navigation bars

This module provides the dimensions of those areas and a view that adds padding to avoid these areas.

## Usage

Please check the [example/](example/) code.

```ts
import { SafeArea } from 'react-native-mo-safearea';

const sub = SafeArea.safeArea.subscribe((safeArea) => {
  console.log(safeArea);
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
  <SafeAreaView forceInsets={{ top: 'always', horizontal: 'always', bottom: 'auto' }}>
    <Content />
  </SafeAreaView>
);

```
