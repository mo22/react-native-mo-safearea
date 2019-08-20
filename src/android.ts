import { NativeModules, NativeEventEmitter, EmitterSubscription, Insets, Platform } from 'react-native';

export interface Module {
  getSafeArea(): Promise<undefined|Required<Insets>>;
  startSafeAreaEvent(): void;
  stopSafeAreaEvent(): void;
}

export interface SafeAreaEvent {
  safeArea: Required<Insets>;
}

export const Module = (Platform.OS === 'android') ? NativeModules.ReactNativeMoSafeArea as Module : undefined;

export const Events = Module ? new NativeEventEmitter(NativeModules.ReactNativeMoSafeArea) as {
  addListener(eventType: 'ReactNativeMoSafeArea', listener: (event: SafeAreaEvent) => void): EmitterSubscription;
} : undefined;
