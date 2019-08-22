#import <UIKit/UIKit.h>
#import <React/RCTEventEmitter.h>
#import <React/RCTUIManager.h>

@interface ReactNativeMoSafeArea : RCTEventEmitter {
    UIView* _referenceView;
}
@end

@implementation ReactNativeMoSafeArea

RCT_EXPORT_MODULE()

+ (BOOL)requiresMainQueueSetup {
    return YES;
}

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
            NSLog(@"ReactNativeMoSafeArea.observeValueForKeyPath new insets %@", NSStringFromUIEdgeInsets(insets));
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

RCT_EXPORT_METHOD(enableSafeAreaEvent:(BOOL)enable) {
    if (enable) {
        if (_referenceView) {
            [self->_referenceView removeObserver:self forKeyPath:@"safeAreaInsets"];
        }
        self->_referenceView = RCTSharedApplication().keyWindow.rootViewController.view;
        NSLog(@"ReactNativeMoSafeArea.enableSafeAreaEvent enable view %@", self->_referenceView);
        [self->_referenceView addObserver:self forKeyPath:@"safeAreaInsets" options:NSKeyValueObservingOptionNew context:nil];
    } else {
        if (_referenceView) {
            NSLog(@"ReactNativeMoSafeArea.enableSafeAreaEvent disable");
            [self->_referenceView removeObserver:self forKeyPath:@"safeAreaInsets"];
            self->_referenceView = nil;
        }
    }
}

- (void)stopObserving {
    [self enableSafeAreaEvent:NO];
}

@end

