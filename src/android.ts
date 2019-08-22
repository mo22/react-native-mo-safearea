import { NativeModules, NativeEventEmitter, EmitterSubscription, Insets, Platform } from 'react-native';

export interface Module {
  enableSafeAreaEvent(enable: boolean): void;
  getSafeArea(): Promise<undefined|Required<Insets>>;
  measureViewInsets(node: number): Promise<undefined|Required<Insets>>;
}

export interface SafeAreaEvent {
  safeArea: Required<Insets>;
}

export const Module = (Platform.OS === 'android') ? NativeModules.ReactNativeMoSafeArea as Module : undefined;

export const Events = Module ? new NativeEventEmitter(NativeModules.ReactNativeMoSafeArea) as {
  addListener(eventType: 'ReactNativeMoSafeArea', listener: (event: SafeAreaEvent) => void): EmitterSubscription;
} : undefined;
