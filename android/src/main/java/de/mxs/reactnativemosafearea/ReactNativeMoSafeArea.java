package de.mxs.reactnativemolayout;

import android.app.Activity;
import android.os.Build;
import android.view.View;
import android.view.WindowInsets;

import androidx.annotation.RequiresApi;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import javax.annotation.Nonnull;

public class ReactNativeMoSafeArea extends ReactContextBaseJavaModule {

    private View windowInsetView;

    ReactNativeMoSafeArea(@Nonnull ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public @Nonnull
    String getName() {
        return "ReactNativeMoSafeArea";
    }

    @Override
    public void onCatalystInstanceDestroy() {
        stopSafeAreaEvent();
        super.onCatalystInstanceDestroy();
    }

    @RequiresApi(api = Build.VERSION_CODES.M)
    private void startWatchingWindowInsets(final Activity activity) {
        stopSafeAreaEvent();
        windowInsetView = activity.findViewById(android.R.id.content);
        windowInsetView.setOnApplyWindowInsetsListener((v, insets) -> {
            WritableMap args = Arguments.createMap();
            final WindowInsets insets2 = activity.getWindow().getDecorView().getRootWindowInsets();
            final float density = activity.getResources().getDisplayMetrics().density;
            if (insets2 != null) {
                WritableMap args2 = Arguments.createMap();
                args2.putDouble("top", (1.0 / density) * insets2.getStableInsetTop());
                args2.putDouble("left", (1.0 / density) * insets2.getStableInsetLeft());
                args2.putDouble("bottom", (1.0 / density) * insets2.getStableInsetBottom());
                args2.putDouble("right", (1.0 / density) * insets2.getStableInsetRight());
                args.putMap("safeArea", args2);
                getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("ReactNativeMoSafeArea", args);
            }
            return v.onApplyWindowInsets(insets);
        });
    }

    @SuppressWarnings({"unused"})
    @ReactMethod
    public void startSafeAreaEvent() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            final Activity activity = getCurrentActivity();
            if (activity == null) {
                getReactApplicationContext().addLifecycleEventListener(new LifecycleEventListener() {
                    @Override
                    public void onHostResume() {
                        getReactApplicationContext().removeLifecycleEventListener(this);
                        final Activity activity = getCurrentActivity();
                        if (activity == null) return;
                        startWatchingWindowInsets(activity);
                    }
                    @Override
                    public void onHostPause() {
                    }
                    @Override
                    public void onHostDestroy() {
                    }
                });
            } else {
                startWatchingWindowInsets(getCurrentActivity());
            }
        }
    }

    @SuppressWarnings({"unused", "WeakerAccess"})
    @ReactMethod
    public void stopSafeAreaEvent() {
        if (windowInsetView != null) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                windowInsetView.setOnApplyWindowInsetsListener(null);
            }
            windowInsetView = null;
        }
    }

    private void getSafeAreaFromActivity(Activity activity, Promise promise) {
        if (activity == null) throw new RuntimeException("activity null");
        View view = activity.getWindow().getDecorView();
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            final WindowInsets insets = view.getRootWindowInsets();
            if (insets != null) {
                final float density = activity.getResources().getDisplayMetrics().density;
                WritableMap args = Arguments.createMap();
                args.putDouble("top", (1.0 / density) * insets.getStableInsetTop());
                args.putDouble("left", (1.0 / density) * insets.getStableInsetLeft());
                args.putDouble("bottom", (1.0 / density) * insets.getStableInsetBottom());
                args.putDouble("right", (1.0 / density) * insets.getStableInsetRight());
                promise.resolve(args);
            } else {
                promise.resolve(null);
            }
        } else {
            promise.resolve(null);
        }
    }

    @SuppressWarnings("unused")
    @ReactMethod
    public void getSafeArea(Promise promise) {
        final Activity activity = getCurrentActivity();
        if (activity == null) {
            getReactApplicationContext().addLifecycleEventListener(new LifecycleEventListener() {
                @Override
                public void onHostResume() {
                    getReactApplicationContext().removeLifecycleEventListener(this);
                    getSafeAreaFromActivity(getCurrentActivity(), promise);
                }
                @Override
                public void onHostPause() {
                }
                @Override
                public void onHostDestroy() {
                }
            });
        } else {
            getSafeAreaFromActivity(activity, promise);
        }
    }

}
