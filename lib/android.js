import { NativeModules, NativeEventEmitter, Platform } from 'react-native';
export const Module = (Platform.OS === 'android') ? NativeModules.ReactNativeMoSafeArea : undefined;
export const Events = Module ? new NativeEventEmitter(NativeModules.ReactNativeMoSafeArea) : undefined;
//# sourceMappingURL=android.js.map