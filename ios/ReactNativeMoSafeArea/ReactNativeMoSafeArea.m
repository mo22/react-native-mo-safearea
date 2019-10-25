#import <UIKit/UIKit.h>
#import <React/RCTEventEmitter.h>
#import <React/RCTUIManager.h>

@interface ReactNativeMoSafeArea : RCTEventEmitter {
    UIView* _referenceView;
    BOOL _verbose;
}
@end

@implementation ReactNativeMoSafeArea

RCT_EXPORT_MODULE()

+ (BOOL)requiresMainQueueSetup {
    return YES;
}

// we are interacting with UI
- (dispatch_queue_t)methodQueue {
    return dispatch_get_main_queue();
}

- (NSArray<NSString *> *)supportedEvents {
    return @[ @"ReactNativeMoSafeArea" ];
}

- (NSDictionary *)constantsToExport {
    NSMutableDictionary* constants = [NSMutableDictionary new];
    if (@available(iOS 11.0, *)) {
        UIEdgeInsets insets = UIApplication.sharedApplication.keyWindow.safeAreaInsets;
        constants[@"initialSafeArea"] = @{
            @"top": @(insets.top),
            @"bottom": @(insets.bottom),
            @"left": @(insets.left),
            @"right": @(insets.right),
        };
    }
    return constants;
}

RCT_EXPORT_METHOD(setVerbose:(BOOL)verbose) {
    _verbose = verbose;
}

RCT_EXPORT_METHOD(getSafeArea:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
    if (@available(iOS 11.0, *)) {
        UIEdgeInsets insets = UIApplication.sharedApplication.keyWindow.safeAreaInsets;
        resolve(@{
            @"top": @(insets.top),
            @"bottom": @(insets.bottom),
            @"left": @(insets.left),
            @"right": @(insets.right),
        });
    } else {
        resolve(nil);
    }
}

- (void)observeValueForKeyPath:(NSString *)keyPath ofObject:(id)object change:(NSDictionary<NSKeyValueChangeKey,id> *)change context:(void *)context {
    if ([keyPath isEqualToString:@"safeAreaInsets"]) {
        if (@available(iOS 11.0, *)) {
            UIEdgeInsets insets = UIApplication.sharedApplication.keyWindow.safeAreaInsets;
            if (_verbose) NSLog(@"ReactNativeMoSafeArea.observeValueForKeyPath new insets %@", NSStringFromUIEdgeInsets(insets));
            if (self.bridge) {
                [self sendEventWithName:@"ReactNativeMoSafeArea" body:@{
                    @"safeArea": @{
                        @"top": @(insets.top),
                        @"bottom": @(insets.bottom),
                        @"left": @(insets.left),
                        @"right": @(insets.right),
                    },
                }];
            }
        }
    }
}

RCT_EXPORT_METHOD(enableSafeAreaEvent:(BOOL)enable) {
    if (enable) {
        if (_referenceView) {
            [self->_referenceView removeObserver:self forKeyPath:@"safeAreaInsets"];
        }
        self->_referenceView = RCTSharedApplication().keyWindow.rootViewController.view;
        if (_verbose) NSLog(@"ReactNativeMoSafeArea.enableSafeAreaEvent enable view %@", self->_referenceView);
        [self->_referenceView addObserver:self forKeyPath:@"safeAreaInsets" options:NSKeyValueObservingOptionNew context:nil];
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(handleKeyboardNotification:) name:UIKeyboardWillShowNotification object:nil];
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(handleKeyboardNotification:) name:UIKeyboardWillChangeFrameNotification object:nil];
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(handleKeyboardNotification:) name:UIKeyboardWillHideNotification object:nil];
    } else {
        if (_referenceView) {
            if (_verbose) NSLog(@"ReactNativeMoSafeArea.enableSafeAreaEvent disable");
            [self->_referenceView removeObserver:self forKeyPath:@"safeAreaInsets"];
            self->_referenceView = nil;
        }
        [[NSNotificationCenter defaultCenter] removeObserver:self];
    }
}

- (void)stopObserving {
    [self enableSafeAreaEvent:NO];
}

+ (UIEdgeInsets)getViewInsets:(UIView*)view {
    UIEdgeInsets insets = UIEdgeInsetsZero;
    UIView* cur = view;
//    NSLog(@"check:");
    while (cur) {
        UIView* parent = cur.superview;
//        NSLog(@"  cur %@", cur);
//        NSLog(@"    frame %@", NSStringFromCGRect(cur.frame));
//        NSLog(@"    parent.frame %@", parent ? NSStringFromCGRect(parent.frame) : @"-");
        if ([cur conformsToProtocol:@protocol(UIFocusItemScrollableContainer)]) {
            UIView<UIFocusItemScrollableContainer>* container = (UIView<UIFocusItemScrollableContainer>*)cur;
//            NSLog(@"    is UIFocusItemScrollableContainer");
//            NSLog(@"    contentOffset %@", NSStringFromCGPoint(container.contentOffset));
//            NSLog(@"    contentSize %@", NSStringFromCGSize(container.contentSize));
            insets.bottom += container.contentSize.height - container.frame.size.height;
            insets.right += container.contentSize.width - container.frame.size.width;
        }
        // @TODO: for scrollviews that are larger the parent frame size is smaller than the bottom offset... use this as a generic case?
        insets.top += cur.frame.origin.y;
        insets.left += cur.frame.origin.x;
        if (parent) {
            insets.right += parent.frame.size.width - (cur.frame.origin.x + cur.frame.size.width);
            insets.bottom += parent.frame.size.height - (cur.frame.origin.y + cur.frame.size.height);
        } else {
            // screen size?!
        }
        cur = parent;
    }
    return insets;
}

RCT_EXPORT_METHOD(measureViewInsets:(nonnull NSNumber*)node resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
    RCTUIManager* uiManager = [self.bridge moduleForClass:[RCTUIManager class]];
    if (!uiManager) {
        resolve([NSNull null]);
        return;
    }
    UIView* view = [uiManager viewForReactTag:node];
    if (!view) {
        resolve([NSNull null]);
        return;
    }
    UIEdgeInsets insets = [[self class] getViewInsets:view];
    resolve(@{
        @"top": @(insets.top),
        @"bottom": @(insets.bottom),
        @"left": @(insets.left),
        @"right": @(insets.right),
    });
}

- (void)handleKeyboardNotification:(NSNotification *)notification {
    if (_verbose) NSLog(@"ReactNativeMoSafeArea.handleKeyboardNotification %@", notification);
    if (self.bridge) {
    }
}

@end

