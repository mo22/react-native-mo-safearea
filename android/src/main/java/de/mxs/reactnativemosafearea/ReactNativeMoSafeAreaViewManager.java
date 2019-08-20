package de.mxs.reactnativemosafearea;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.LayoutShadowNode;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;

import javax.annotation.Nonnull;

public class ReactNativeMoSafeAreaViewManager extends ViewGroupManager<ReactNativeMoSafeAreaView> {

    private static final String REACT_CLASS = "ReactNativeMoSafeAreaView";

    @Nonnull
    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Nonnull
    @Override
    protected ReactNativeMoSafeAreaView createViewInstance(@Nonnull ThemedReactContext reactContext) {
//        Log.i("XXX", "ReactNativeMoSafeAreaViewManager.createViewInstance");
        return new ReactNativeMoSafeAreaView(reactContext);
    }

    @Nonnull
    @Override
    public LayoutShadowNode createShadowNodeInstance(@Nonnull ReactApplicationContext context) {
//        Log.i("XXX", "ReactNativeMoSafeAreaViewManager.createShadowNodeInstance");
        return new ReactNativeMoSafeAreaViewShadow();
    }

    @Override
    public Class<? extends LayoutShadowNode> getShadowNodeClass() {
//        Log.i("XXX", "ReactNativeMoSafeAreaViewManager.getShadowNodeClass");
        return ReactNativeMoSafeAreaViewShadow.class;
    }

}
