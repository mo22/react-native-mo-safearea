import { EmitterSubscription, Insets } from 'react-native';
export interface Module {
    enableSafeAreaEvent(enable: boolean): void;
    getSafeArea(): Promise<undefined | Required<Insets>>;
}
export interface SafeAreaEvent {
    safeArea: Required<Insets>;
}
export declare const Module: Module | undefined;
export declare const Events: {
    addListener(eventType: "ReactNativeMoSafeArea", listener: (event: SafeAreaEvent) => void): EmitterSubscription;
} | undefined;
