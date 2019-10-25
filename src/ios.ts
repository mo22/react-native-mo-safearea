import { NativeModules, NativeEventEmitter, EmitterSubscription, Insets, Platform } from 'react-native';

export interface Module {
  setVerbose(verbose: boolean): void;
  enableSafeAreaEvent(enable: boolean): void;
  initialSafeArea: undefined|Required<Insets>;
  getSafeArea(): Promise<undefined|Required<Insets>>;
  measureViewInsets(node: number): Promise<undefined|Required<Insets>>;
}

export interface SafeAreaEvent {
  safeArea?: Required<Insets>;
  keyboardArea?: {
    start: { x: number; y: number; width: number; height: number; visible: boolean; };
    end: { x: number; y: number; width: number; height: number; visible: boolean; };
    duration: number;
  };
}

export const Module = (Platform.OS === 'ios') ? NativeModules.ReactNativeMoSafeArea as Module : undefined;

export const Events = Module ? new NativeEventEmitter(NativeModules.ReactNativeMoSafeArea) as {
  addListener(eventType: 'ReactNativeMoSafeArea', listener: (event: SafeAreaEvent) => void): EmitterSubscription;
} : undefined;
