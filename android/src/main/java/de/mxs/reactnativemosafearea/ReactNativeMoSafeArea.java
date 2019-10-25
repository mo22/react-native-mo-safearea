package de.mxs.reactnativemosafearea;

import android.app.Activity;
import android.graphics.Rect;
import android.os.Build;
import android.util.Log;
import android.view.View;
import android.view.ViewParent;
import android.view.WindowInsets;
import android.widget.ScrollView;

import androidx.annotation.RequiresApi;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.uimanager.UIManagerModule;

import javax.annotation.Nonnull;

public class ReactNativeMoSafeArea extends ReactContextBaseJavaModule {

    private View windowInsetView;

    private boolean verbose = false;

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
        enableSafeAreaEvent(false);
        super.onCatalystInstanceDestroy();
    }

    @RequiresApi(api = Build.VERSION_CODES.M)
    private void startWatchingWindowInsets(final Activity activity) {
        if (windowInsetView != null) {
            windowInsetView.setOnApplyWindowInsetsListener(null);
            windowInsetView = null;
        }
        windowInsetView = activity.findViewById(android.R.id.content);
        windowInsetView.setOnApplyWindowInsetsListener((v, insets) -> {
            if (verbose) Log.i("ReactNativeMoSafeArea", "insets changed " + insets);
            final WindowInsets insets2 = activity.getWindow().getDecorView().getRootWindowInsets();
            if (verbose) Log.i("ReactNativeMoSafeArea", "insets2 " + insets2);
            final float density = activity.getResources().getDisplayMetrics().density;
            WritableMap args = Arguments.createMap();
            {
                WritableMap args2 = Arguments.createMap();
                args2.putDouble("top", (1.0 / density) * insets.getStableInsetTop());
                args2.putDouble("left", (1.0 / density) * insets.getStableInsetLeft());
                args2.putDouble("bottom", (1.0 / density) * insets.getStableInsetBottom());
                args2.putDouble("right", (1.0 / density) * insets.getStableInsetRight());
                args.putMap("safeArea", args2);
            }
            {
                WritableMap rs = Arguments.createMap();
                rs.putDouble("top", (1.0 / density) * insets.getStableInsetTop());
                rs.putDouble("left", (1.0 / density) * insets.getStableInsetLeft());
                rs.putDouble("bottom", (1.0 / density) * insets.getStableInsetBottom());
                rs.putDouble("right", (1.0 / density) * insets.getStableInsetRight());
                args.putMap("stableInsets", rs);
            }
            {
                WritableMap rs = Arguments.createMap();
                rs.putDouble("top", (1.0 / density) * insets.getSystemWindowInsetTop());
                rs.putDouble("left", (1.0 / density) * insets.getSystemWindowInsetLeft());
                rs.putDouble("bottom", (1.0 / density) * insets.getSystemWindowInsetBottom());
                rs.putDouble("right", (1.0 / density) * insets.getSystemWindowInsetRight());
                args.putMap("systemWindowInsets", rs);
            }
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
                WritableArray list = Arguments.createArray();
                for (Rect cutout : insets.getDisplayCutout().getBoundingRects()) {
                    WritableMap rs = Arguments.createMap();
                    rs.putDouble("top", (1.0 / density) * cutout.top);
                    rs.putDouble("left", (1.0 / density) * cutout.left);
                    rs.putDouble("bottom", (1.0 / density) * cutout.bottom);
                    rs.putDouble("right", (1.0 / density) * cutout.right);
                    list.pushMap(rs);
                }
                args.putArray("displayCutouts", list);
            }
            getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("ReactNativeMoSafeArea", args);
            return v.onApplyWindowInsets(insets);
        });
    }

    @SuppressWarnings("unused")
    @ReactMethod
    public void setVerbose(boolean verbose) {
        this.verbose = verbose;
    }

    @SuppressWarnings({"unused", "WeakerAccess"})
    @ReactMethod
    public void enableSafeAreaEvent(boolean enable) {
        Log.i("ReactNativeMoSafeArea", "enableSafeAreaEvent " + enable);
        if (verbose) Log.i("ReactNativeMoSafeArea", "enableSafeAreaEvent " + enable);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            if (!enable) {
                if (windowInsetView != null) {
                    windowInsetView.setOnApplyWindowInsetsListener(null);
                    windowInsetView = null;
                }
            }
            if (enable) {
                final Activity activity = getCurrentActivity();
                if (activity == null) {
                    if (verbose) Log.i("ReactNativeMoSafeArea", "enableSafeAreaEvent wait for activity");
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
    }

    private void getSafeAreaFromActivity(Activity activity, Promise promise) {
        if (activity == null) throw new RuntimeException("activity == null");
        View view = activity.getWindow().getDecorView();
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            final WindowInsets insets = view.getRootWindowInsets();
            if (insets != null) {
                final float density = getReactApplicationContext().getResources().getDisplayMetrics().density;
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

    @SuppressWarnings({"WeakerAccess"})
    public static Rect getViewInsets(View view) {
        Rect insets = new Rect();
        View cur = view;
//        Log.i("XXX", "trace:");
        while (cur != null) {
//            Log.i("XXX", "  " + cur);
//            Log.i("XXX", "    pos " + cur.getX() + " " + cur.getY() + " " + cur.getWidth() + " " + cur.getHeight());
            insets.left += cur.getX();
            insets.top += cur.getY();
            if (cur instanceof ScrollView) {
                // @TODO: padding?
                // @TODO: handle this in general somehow?
                ScrollView scrollView = (ScrollView)cur;
                if (scrollView.getChildCount() > 0) {
                    insets.bottom += scrollView.getChildAt(0).getHeight() - cur.getHeight();
                    insets.right += scrollView.getChildAt(0).getWidth() - cur.getWidth();
                }
            }
            ViewParent viewParent = cur.getParent();
            View parent = (viewParent instanceof View) ? ((View)viewParent) : null;
            if (parent != null) {
                insets.right += parent.getWidth() - (cur.getX() + cur.getWidth());
                insets.bottom += parent.getHeight() - (cur.getY() + cur.getHeight());
            }
            cur = parent;
        }
        return insets;
    }

    @SuppressWarnings({"unused"})
    @ReactMethod
    public void measureViewInsets(int node, Promise promise) {
        UIManagerModule uiManager = this.getReactApplicationContext().getNativeModule(UIManagerModule.class);
        uiManager.addUIBlock(nativeViewHierarchyManager -> {
            View view = nativeViewHierarchyManager.resolveView(node);
            if (view == null) {
                promise.resolve(null);
                return;
            }
            Rect insets = getViewInsets(view);
            WritableMap res = Arguments.createMap();
            final float density = getReactApplicationContext().getResources().getDisplayMetrics().density;
            res.putDouble("top", insets.top / density);
            res.putDouble("left", insets.left / density);
            res.putDouble("right", insets.right / density);
            res.putDouble("bottom", insets.bottom / density);
            promise.resolve(res);
        });
    }

}