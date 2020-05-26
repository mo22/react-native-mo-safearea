import { EmitterSubscription, Insets } from 'react-native';
export interface Module {
    setVerbose(verbose: boolean): void;
    enableSafeAreaEvent(enable: boolean): void;
    getSafeArea(): Promise<null | SafeAreaEvent>;
    measureViewInsets(node: number): Promise<null | Required<Insets>>;
    getCompatInfo(): Promise<{
        statusBarHeight?: number;
        actionBarHeight?: number;
        navigationBarHeight?: number;
        decorViewRect?: Required<Insets>;
    }>;
}
export interface SafeAreaEvent {
    stableInsets: Required<Insets>;
    systemWindowInsets: Required<Insets>;
    displayCutouts?: Required<Insets>[];
}
export declare const Module: Module | undefined;
export declare const Events: {
    addListener(eventType: 'ReactNativeMoSafeArea', listener: (event: SafeAreaEvent) => void): EmitterSubscription;
} | undefined;
