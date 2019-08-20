package de.mxs.reactnativemolayout;

import android.content.Context;
import android.os.Build;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowInsets;

import androidx.annotation.RequiresApi;

import com.facebook.react.bridge.ReactContext;
import com.facebook.react.uimanager.UIManagerModule;

public class ReactNativeMoSafeAreaView extends ViewGroup {

    public ReactNativeMoSafeAreaView(Context context) {
        super(context);
    }

    @Override
    protected void onLayout(boolean changed, int l, int t, int r, int b) {
//        Log.i("XXX", "ReactNativeMoSafeAreaView.onLayout " + changed + " [" + l + "," + t + "," + r + "," + b + "]");
    }

    @Override
    protected void onAttachedToWindow() {
//        Log.i("XXX", "ReactNativeMoSafeAreaView.onAttachedToWindow");
        super.onAttachedToWindow();
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.M) {
            requestApplyInsets();
        }
    }

    @RequiresApi(api = Build.VERSION_CODES.KITKAT_WATCH)
    @Override
    public WindowInsets onApplyWindowInsets(WindowInsets insets) {
        Log.i("XXX", "ReactNativeMoSafeAreaView.onApplyWindowInsets " + insets);
        ReactContext reactContext = (ReactContext)getContext();
        UIManagerModule uiManager = reactContext.getNativeModule(UIManagerModule.class);
        uiManager.setViewLocalData(getId(), insets);
        return super.onApplyWindowInsets(insets);
    }
}
