import { NativeModules, NativeEventEmitter, Platform } from 'react-native';
export const Module = (Platform.OS === 'ios') ? NativeModules.ReactNativeMoSafeArea : undefined;
export const Events = Module ? new NativeEventEmitter(NativeModules.ReactNativeMoSafeArea) : undefined;
//# sourceMappingURL=ios.js.map