package de.mxs.reactnativemosafearea;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import javax.annotation.Nonnull;

public final class ReactNativeMoSafeAreaPackage implements ReactPackage {

    @SuppressWarnings("rawtypes")
    @Override
    public @Nonnull List<ViewManager> createViewManagers(@Nonnull ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }

    @Override
    public @Nonnull List<NativeModule> createNativeModules(@Nonnull ReactApplicationContext reactContext) {
        List<NativeModule> modules = new ArrayList<>();
        modules.add(new ReactNativeMoSafeArea(reactContext));
        return modules;
    }

}
