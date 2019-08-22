import { NativeModules, NativeEventEmitter, EmitterSubscription, Insets, Platform } from 'react-native';

export interface Module {
  enableSafeAreaEvent(enable: boolean): void;
  initialSafeArea: undefined|Required<Insets>;
  getSafeArea(): Promise<undefined|Required<Insets>>;
  measureNative(node: number): Promise<any>;
}

export interface SafeAreaEvent {
  safeArea: Required<Insets>;
}

export const Module = (Platform.OS === 'ios') ? NativeModules.ReactNativeMoSafeArea as Module : undefined;

export const Events = Module ? new NativeEventEmitter(NativeModules.ReactNativeMoSafeArea) as {
  addListener(eventType: 'ReactNativeMoSafeArea', listener: (event: SafeAreaEvent) => void): EmitterSubscription;
} : undefined;
