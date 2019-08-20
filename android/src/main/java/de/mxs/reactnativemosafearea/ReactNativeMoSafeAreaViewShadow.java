package de.mxs.reactnativemosafearea;

import android.app.Activity;
import android.graphics.Point;
import android.os.Build;
import android.util.Log;
import android.view.Display;
import android.view.WindowInsets;

import androidx.annotation.RequiresApi;

import com.facebook.react.uimanager.LayoutShadowNode;
import com.facebook.react.uimanager.ReactShadowNodeImpl;
import com.facebook.react.uimanager.Spacing;
import com.facebook.react.uimanager.annotations.ReactProp;

public class ReactNativeMoSafeAreaViewShadow extends LayoutShadowNode {
    private WindowInsets windowInsets;

    private boolean safeAreaTop;
    private boolean safeAreaLeft;
    private boolean safeAreaRight;
    private boolean safeAreaBottom;

    private float minPaddingTop;
    private float minPaddingLeft;
    private float minPaddingRight;
    private float minPaddingBottom;

    private float addPaddingTop;
    private float addPaddingLeft;
    private float addPaddingRight;
    private float addPaddingBottom;

    @SuppressWarnings("unused")
    @ReactProp(name = "safeAreaTop")
    public void setSafeAreaTop(boolean value) {
        safeAreaTop = value;
    }

    @SuppressWarnings("unused")
    @ReactProp(name = "safeAreaLeft")
    public void setSafeAreaLeft(boolean value) {
        safeAreaLeft = value;
    }

    @SuppressWarnings("unused")
    @ReactProp(name = "safeAreaRight")
    public void setSafeAreaRight(boolean value) {
        safeAreaRight = value;
    }

    @SuppressWarnings("unused")
    @ReactProp(name = "safeAreaBottom")
    public void setSafeAreaBottom(boolean value) {
        safeAreaBottom = value;
    }

    @SuppressWarnings("unused")
    @ReactProp(name = "minPaddingTop")
    public void setMinPaddingTop(float value) {
        minPaddingTop = value;
    }

    @SuppressWarnings("unused")
    @ReactProp(name = "minPaddingLeft")
    public void setMinPaddingLeft(float value) {
        minPaddingLeft = value;
    }

    @SuppressWarnings("unused")
    @ReactProp(name = "minPaddingRight")
    public void setMinPaddingRight(float value) {
        minPaddingRight = value;
    }

    @SuppressWarnings("unused")
    @ReactProp(name = "minPaddingBottom")
    public void setMinPaddingBottom(float value) {
        minPaddingBottom = value;
    }

    @SuppressWarnings("unused")
    @ReactProp(name = "addPaddingTop")
    public void setAddPaddingTop(float value) {
        addPaddingTop = value;
    }

    @SuppressWarnings("unused")
    @ReactProp(name = "addPaddingLeft")
    public void setAddPaddingLeft(float value) {
        addPaddingLeft = value;
    }

    @SuppressWarnings("unused")
    @ReactProp(name = "addPaddingRight")
    public void setAddPaddingRight(float value) {
        addPaddingRight = value;
    }

    @SuppressWarnings("unused")
    @ReactProp(name = "addPaddingBottom")
    public void setAddPaddingBottom(float value) {
        addPaddingBottom = value;
    }

    @SuppressWarnings("unused")
    @Override
    public void onAfterUpdateTransaction() {
        super.onAfterUpdateTransaction();
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            updatePadding();
        }
    }

    @RequiresApi(api = Build.VERSION_CODES.M)
    private void updatePadding() {
        Log.i("XXX", "updatePadding " + this);
        float safeTop = 0;
        float safeLeft = 0;
        float safeRight = 0;
        float safeBottom = 0;
        if (windowInsets != null) {
            // Display.getSize height = 2028
            // Display.getRealSize height = 2160 // this is the root view height in react native...
            // getDisplayMetrics.height = 2028

            Activity activity = getThemedContext().getCurrentActivity();
            if (activity == null) throw new RuntimeException("activity == null");
            Point displaySize = new Point();
            activity.getWindowManager().getDefaultDisplay().getRealSize(displaySize);
            float displayWidth = displaySize.x;
            float displayHeight = displaySize.y;

            Log.i("XXX", "stable " + windowInsets.hasStableInsets() + " " + windowInsets.getStableInsetBottom());

//            float displayWidth = getThemedContext().getResources().getDisplayMetrics().widthPixels;
//            float displayHeight = getThemedContext().getResources().getDisplayMetrics().heightPixels;

            Log.i("XXX", "displaySize " + displayWidth + " " + displayHeight);
            Log.i("XXX", "screenPos " + getScreenX() + " " + getScreenY() + " " + getScreenWidth() + " " + getScreenHeight());
//            displayHeight -= 16; // @TODO what is this? this matches exactly. but not for telba InfoPage.

            float insetTop = windowInsets.getSystemWindowInsetTop();
            float curTop = getScreenY();
            safeTop = Math.max(0, insetTop - curTop);

            float insetBottom = windowInsets.getSystemWindowInsetBottom();
            float curBottom = displayHeight - (getScreenY() + getLayoutHeight());
            // @TODO really minus getSystemWindowInsetTop ?!
//            Log.i("XXX", "curBottom " + curBottom);
//            curBottom = curBottom - windowInsets.getSystemWindowInsetTop();
            Log.i("XXX", "insetBottom " + insetBottom);
            Log.i("XXX", "curBottom " + curBottom);
            safeBottom = Math.max(0, insetBottom - curBottom);

            float insetLeft = windowInsets.getSystemWindowInsetLeft();
            float curLeft = getScreenX();
            safeLeft = Math.max(0, insetLeft - curLeft);
            float insetRight = windowInsets.getSystemWindowInsetRight();
            float curRight = displayWidth - (getScreenX() + getLayoutWidth());
            safeRight = Math.max(0, insetRight - curRight);
            Log.i("XXX", "insets " + insetTop + " " + insetLeft + " " + insetRight + " " + insetBottom);
        }
//        Log.i("XXX", "updatePadding safeArea " + safeAreaTop + " " + safeAreaLeft + " " + safeAreaRight+ " " + safeAreaBottom);
//        Log.i("XXX", "updatePadding minPadding " + minPaddingTop + " " + minPaddingLeft + " " + minPaddingRight+ " " + minPaddingBottom);
//        Log.i("XXX", "updatePadding addPadding " + addPaddingTop + " " + addPaddingLeft + " " + addPaddingRight+ " " + addPaddingBottom);
//        Log.i("XXX", "updatePadding safe " + safeTop + " " + safeLeft + " " + safeRight+ " " + safeBottom);
        super.setPadding(Spacing.TOP, Math.max(minPaddingTop, safeAreaTop ? safeTop : 0) + addPaddingTop);
        super.setPadding(Spacing.LEFT, Math.max(minPaddingLeft, safeAreaLeft ? safeLeft : 0) + addPaddingLeft);
        super.setPadding(Spacing.RIGHT, Math.max(minPaddingRight, safeAreaRight ? safeRight : 0) + addPaddingRight);
        super.setPadding(Spacing.BOTTOM, Math.max(minPaddingBottom, safeAreaBottom ? safeBottom : 0) + addPaddingBottom);
    }

    @Override
    public void setLocalData(Object data) {
//        Log.i("XXX", "ReactNativeMoSafeAreaViewShadow.setLocalData " + data);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            windowInsets = (WindowInsets)data;
            updatePadding();
        }
    }
}
