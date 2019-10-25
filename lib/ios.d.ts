import { EmitterSubscription, Insets } from 'react-native';
export interface Module {
    setVerbose(verbose: boolean): void;
    enableSafeAreaEvent(enable: boolean): void;
    initialSafeArea: undefined | Required<Insets>;
    getSafeArea(): Promise<undefined | Required<Insets>>;
    measureViewInsets(node: number): Promise<undefined | Required<Insets>>;
}
export interface SafeAreaEvent {
    safeArea?: Required<Insets>;
    keyboardArea?: {
        start: {
            x: number;
            y: number;
            width: number;
            height: number;
        };
        end: {
            x: number;
            y: number;
            width: number;
            height: number;
        };
        duration: number;
    };
}
export declare const Module: Module | undefined;
export declare const Events: {
    addListener(eventType: "ReactNativeMoSafeArea", listener: (event: SafeAreaEvent) => void): EmitterSubscription;
} | undefined;
