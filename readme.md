# react-native-mo-safearea

## Reason

Some areas of the screen are not freely usable:
- cutouts for camera
- translucent status / navigation bars

This module provides the dimensions of those areas and a view that adds padding to avoid these areas.

## Usage

see example/ project for examples.

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
