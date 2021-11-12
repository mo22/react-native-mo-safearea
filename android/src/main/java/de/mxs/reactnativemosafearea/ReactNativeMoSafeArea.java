package de.mxs.reactnativemosafearea;

import android.app.Activity;
import android.content.res.Resources;
import android.content.res.TypedArray;
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

import java.util.Objects;

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

    private WritableMap convertInsetsToArgs(WindowInsets insets) {
        final float density = getReactApplicationContext().getResources().getDisplayMetrics().density;
        WritableMap args = Arguments.createMap();
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            WritableMap rs = Arguments.createMap();
            rs.putDouble("top", (1.0 / density) * insets.getStableInsetTop());
            rs.putDouble("left", (1.0 / density) * insets.getStableInsetLeft());
            rs.putDouble("bottom", (1.0 / density) * insets.getStableInsetBottom());
            rs.putDouble("right", (1.0 / density) * insets.getStableInsetRight());
            args.putMap("stableInsets", rs);
        }
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            WritableMap rs = Arguments.createMap();
            rs.putDouble("top", (1.0 / density) * insets.getSystemWindowInsetTop());
            rs.putDouble("left", (1.0 / density) * insets.getSystemWindowInsetLeft());
            rs.putDouble("bottom", (1.0 / density) * insets.getSystemWindowInsetBottom());
            rs.putDouble("right", (1.0 / density) * insets.getSystemWindowInsetRight());
            args.putMap("systemWindowInsets", rs);
        }
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
            WritableArray list = Arguments.createArray();
            if (insets.getDisplayCutout() != null) {
                for (Rect cutout : insets.getDisplayCutout().getBoundingRects()) {
                    WritableMap rs = Arguments.createMap();
                    rs.putDouble("top", (1.0 / density) * cutout.top);
                    rs.putDouble("left", (1.0 / density) * cutout.left);
                    rs.putDouble("bottom", (1.0 / density) * cutout.bottom);
                    rs.putDouble("right", (1.0 / density) * cutout.right);
                    list.pushMap(rs);
                }
            }
            args.putArray("displayCutouts", list);
        }
        return args;
    }

    @RequiresApi(api = Build.VERSION_CODES.M)
    private void startWatchingWindowInsets(final Activity activity) {
        activity.runOnUiThread(() -> {
            if (windowInsetView != null) {
                windowInsetView.setOnApplyWindowInsetsListener(null);
                windowInsetView = null;
            }
//            windowInsetView = activity.findViewById(android.R.id.content);
            windowInsetView = activity.getWindow().getDecorView();
            windowInsetView.setOnApplyWindowInsetsListener((v, insets) -> {
                if (verbose) Log.i("ReactNativeMoSafeArea", "insets changed " + insets);
                final WindowInsets insets2 = activity.getWindow().getDecorView().getRootWindowInsets();
                if (verbose) Log.i("ReactNativeMoSafeArea", "insets2 " + insets2);
                WritableMap args = convertInsetsToArgs(insets);
                getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("ReactNativeMoSafeArea", args);
                return v.onApplyWindowInsets(insets);
            });
            windowInsetView.requestApplyInsets();
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
                WritableMap args = convertInsetsToArgs(insets);
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
        while (cur != null) {
            insets.left += cur.getX();
            insets.top += cur.getY();
            if (cur instanceof ScrollView) {
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
        UIManagerModule uiManager = Objects.requireNonNull(this.getReactApplicationContext().getNativeModule(UIManagerModule.class));
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

    @SuppressWarnings({"unused"})
    @ReactMethod
    public void getCompatInfo(Promise promise) {
        WritableMap res = Arguments.createMap();
        Resources resources = getReactApplicationContext().getResources();
        {
            int resourceId = resources.getIdentifier("status_bar_height", "dimen", "android");
            if (resourceId > 0) {
                res.putInt("statusBarHeight", resources.getDimensionPixelSize(resourceId));
            }
        }
        {
            final TypedArray styledAttributes = getReactApplicationContext().getTheme().obtainStyledAttributes(
                    new int[] { android.R.attr.actionBarSize }
            );
            int actionBarHeight = (int)styledAttributes.getDimension(0, -1);
            if (actionBarHeight != -1) {
                res.putInt("actionBarHeight", actionBarHeight);
            }
            styledAttributes.recycle();
        }
        {
            int resourceId = resources.getIdentifier("navigation_bar_height", "dimen", "android");
            if (resourceId > 0) {
                res.putInt("navigationBarHeight", resources.getDimensionPixelSize(resourceId));
            }
        }
        {
            Rect decorViewRect = new Rect();
            Activity activity = getReactApplicationContext().getCurrentActivity();
            if (activity != null) {
                activity.getWindow().getDecorView().getWindowVisibleDisplayFrame(decorViewRect);
                WritableMap rs = Arguments.createMap();
                rs.putInt("top", decorViewRect.top);
                rs.putInt("left", decorViewRect.left);
                rs.putInt("right", decorViewRect.right);
                rs.putInt("bottom", decorViewRect.bottom);
                res.putMap("decorViewRect", rs);
            }
        }
        res.putBoolean("haveInsets", Build.VERSION.SDK_INT >= Build.VERSION_CODES.M);
        promise.resolve(res);
    }

    @SuppressWarnings("unused")
    @ReactMethod
    public void addListener(String eventName) {}

    @SuppressWarnings("unused")
    @ReactMethod
    public void removeListeners(double count) {}
}
