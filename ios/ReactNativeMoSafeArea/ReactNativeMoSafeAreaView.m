#import <React/RCTBridge.h>
#import <React/RCTUIManager.h>
#import <React/RCTView.h>
#import <React/RCTViewManager.h>
#import <React/RCTShadowView.h>
#import <yoga/Yoga.h>

@interface ReactNativeMoSafeAreaViewLocal : NSObject
@property UIEdgeInsets insets;
@end
@implementation ReactNativeMoSafeAreaViewLocal
@end



@interface ReactNativeMoSafeAreaView : RCTView {
    __weak RCTBridge* _bridge;
    UIEdgeInsets _currentInsets;
}
@end

@implementation ReactNativeMoSafeAreaView

- (instancetype)initWithBridge:(RCTBridge*)bridge {
    if (self = [super initWithFrame:CGRectZero]) {
        _bridge = bridge;
    }
    return self;
}
RCT_NOT_IMPLEMENTED(- (instancetype)initWithCoder:(NSCoder*)decoder)
RCT_NOT_IMPLEMENTED(- (instancetype)initWithFrame:(CGRect)frame)

- (void)safeAreaInsetsDidChange {
    NSLog(@"ReactNativeMoSafeAreaView.safeAreaInsetsDidChange");
    // hmm not good while we're moving?
    [super safeAreaInsetsDidChange];
//    [self invalidateSafeAreaInsets];
}

- (void)layoutSubviews {
    NSLog(@"ReactNativeMoSafeAreaView.layoutSubviews");
    [super layoutSubviews];
    [self invalidateSafeAreaInsets];
}

- (void)invalidateSafeAreaInsets {
    if (@available(iOS 11.0, *)) {
//        NSLog(@"ReactNativeMoSafeAreaView.invalidateSafeAreaInsets %@", NSStringFromUIEdgeInsets(self.safeAreaInsets));
        CGFloat d = MAX(
                        MAX(
                            fabs(self.safeAreaInsets.top - _currentInsets.top),
                            fabs(self.safeAreaInsets.bottom - _currentInsets.bottom)
                            ),
                        MAX(
                            fabs(self.safeAreaInsets.left - _currentInsets.left),
                            fabs(self.safeAreaInsets.right - _currentInsets.right)
                            )
                        );
//        NSLog(@"ReactNativeMoSafeAreaView.invalidateSafeAreaInsets d=%f (%f)", d, 1.0 / RCTScreenScale());
        if (d >= 1.0 / RCTScreenScale()) {
//            NSLog(@"ReactNativeMoSafeAreaView.invalidateSafeAreaInsets updated %f", d);
            _currentInsets = self.safeAreaInsets;
            ReactNativeMoSafeAreaViewLocal* data = [ReactNativeMoSafeAreaViewLocal new];
            data.insets = self.safeAreaInsets;
            [_bridge.uiManager setLocalData:data forView:self];
        }
    }
}

@end



@interface ReactNativeMoSafeAreaViewShadow : RCTShadowView {
    UIEdgeInsets _insets;
    UIEdgeInsets _current;
}

@property BOOL safeAreaTop;
@property BOOL safeAreaLeft;
@property BOOL safeAreaRight;
@property(nonatomic) BOOL safeAreaBottom;

@property CGFloat minPaddingTop;
@property CGFloat minPaddingLeft;
@property CGFloat minPaddingRight;
@property CGFloat minPaddingBottom;

@property CGFloat addPaddingTop;
@property CGFloat addPaddingLeft;
@property CGFloat addPaddingRight;
@property CGFloat addPaddingBottom;

@end

@implementation ReactNativeMoSafeAreaViewShadow

- (void)setSafeAreaBottom:(BOOL)safeAreaBottom {
    NSLog(@"changed safeAreaBottom");
    _safeAreaBottom = safeAreaBottom;
    [self recalc];
}

- (void)setLocalData:(ReactNativeMoSafeAreaViewLocal*)localData {
    NSLog(@"ReactNativeMoSafeAreaViewShadow.setLocalData");
    _insets = localData.insets;
    [self recalc];
}

- (void)recalc {
    NSLog(@"ReactNativeMoSafeAreaViewShadow.recalc");
    UIEdgeInsets tmp;
    tmp.top = MAX(self.safeAreaTop ? _insets.top : 0, self.minPaddingTop) + self.addPaddingTop;
    tmp.left = MAX(self.safeAreaLeft ? _insets.left : 0, self.minPaddingLeft) + self.addPaddingLeft;
    tmp.right = MAX(self.safeAreaRight ? _insets.right : 0, self.minPaddingRight) + self.addPaddingRight;
    tmp.bottom = MAX(self.safeAreaBottom ? _insets.bottom : 0, self.minPaddingBottom) + self.addPaddingBottom;
    NSMutableArray* changed = [NSMutableArray new];
    if (tmp.top != _current.top) {
        super.paddingTop = (YGValue){ tmp.top, YGUnitPoint};
        [changed addObject:@"paddingTop"];
    }
    if (tmp.left != _current.left) {
        super.paddingLeft = (YGValue){ tmp.left, YGUnitPoint};
        [changed addObject:@"paddingLeft"];
    }
    if (tmp.right != _current.right) {
        super.paddingRight = (YGValue){ tmp.right, YGUnitPoint};
        [changed addObject:@"paddingRight"];
    }
    if (tmp.bottom != _current.bottom) {
        super.paddingBottom = (YGValue){ tmp.bottom, YGUnitPoint};
        [changed addObject:@"paddingBottom"];
    }
    _current = tmp;
//    NSLog(@"recalc changed %@", changed);
    [self didSetProps:changed];
}

- (void)setPadding:(__unused YGValue)value {
}

- (void)setPaddingLeft:(__unused YGValue)value {
}

- (void)setPaddingRight:(__unused YGValue)value {
}

- (void)setPaddingTop:(__unused YGValue)value {
}

- (void)setPaddingBottom:(__unused YGValue)value {
}

@end



@interface ReactNativeMoSafeAreaViewManager : RCTViewManager
@end

@implementation ReactNativeMoSafeAreaViewManager

RCT_EXPORT_MODULE()

RCT_EXPORT_SHADOW_PROPERTY(safeAreaTop, BOOL);
RCT_EXPORT_SHADOW_PROPERTY(safeAreaLeft, BOOL);
RCT_EXPORT_SHADOW_PROPERTY(safeAreaRight, BOOL);
RCT_EXPORT_SHADOW_PROPERTY(safeAreaBottom, BOOL);
RCT_EXPORT_SHADOW_PROPERTY(minPaddingTop, CGFloat);
RCT_EXPORT_SHADOW_PROPERTY(minPaddingLeft, CGFloat);
RCT_EXPORT_SHADOW_PROPERTY(minPaddingRight, CGFloat);
RCT_EXPORT_SHADOW_PROPERTY(minPaddingBottom, CGFloat);
RCT_EXPORT_SHADOW_PROPERTY(addPaddingTop, CGFloat);
RCT_EXPORT_SHADOW_PROPERTY(addPaddingLeft, CGFloat);
RCT_EXPORT_SHADOW_PROPERTY(addPaddingRight, CGFloat);
RCT_EXPORT_SHADOW_PROPERTY(addPaddingBottom, CGFloat);

- (ReactNativeMoSafeAreaView*)view {
    return [[ReactNativeMoSafeAreaView alloc] initWithBridge:self.bridge];
}

- (ReactNativeMoSafeAreaViewShadow*)shadowView {
    return [ReactNativeMoSafeAreaViewShadow new];
}

@end
