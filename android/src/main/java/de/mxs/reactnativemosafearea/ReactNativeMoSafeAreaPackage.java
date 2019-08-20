package de.mxs.reactnativemolayout;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.ArrayList;
import java.util.List;

import javax.annotation.Nonnull;

public final class ReactNativeMoLayoutPackage implements ReactPackage {

    @Override
    public @Nonnull List<ViewManager> createViewManagers(@Nonnull ReactApplicationContext reactContext) {
        List<ViewManager> viewManagers = new ArrayList<>();
        viewManagers.add(new ReactNativeMoSafeAreaViewManager());
        return viewManagers;
    }

    @Override
    public @Nonnull List<NativeModule> createNativeModules(@Nonnull ReactApplicationContext reactContext) {
        List<NativeModule> modules = new ArrayList<>();
        modules.add(new ReactNativeMoOrientation(reactContext));
        modules.add(new ReactNativeMoVibrate(reactContext));
        modules.add(new ReactNativeMoSafeArea(reactContext));
        modules.add(new ReactNativeMoScreen(reactContext));
        return modules;
    }

}
