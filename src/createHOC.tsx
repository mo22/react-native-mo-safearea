import * as React from 'react';
// import hoistStatics from 'hoist-non-react-statics';

export function hoistStatics(target: any, source: any) {
  for (const key of [...Object.getOwnPropertyNames(source), ...Object.getOwnPropertySymbols(source)]) {
    const descriptor = Object.getOwnPropertyDescriptor(source, key);
    if (!descriptor) continue;
    try {
      Object.defineProperty(target, key, descriptor);
    } catch (e) {
    }
  }
}

export function createHOC<Injected>(callback: (component: any, props: any, ref: any) => any) {
  const res = function HOC<
    Props extends Injected,
    State,
    ComponentType extends React.ComponentClass<Props, State>
  >(
    component: ComponentType & React.ComponentClass<Props>
  ): (
    ComponentType &
    ( new (props: Omit<Props, keyof Injected>, context?: any) => React.Component<Omit<Props, keyof Injected>, State> )
  ) {
    const render = (props: Props) => callback(component, props, undefined);
    hoistStatics(render, component);
    return render as any;
  };
  return res;
}

export function createRefHOC<Injected>(callback: (component: any, props: any, ref: any) => any) {
  const res = function HOC<
    Props extends Injected,
    State,
    ComponentType extends React.ComponentClass<Props, State>
  >(
    component: ComponentType & React.ComponentClass<Props>
  ): (
    // ForwardRefExoticComponent<>
    ComponentType &
    ( new (props: Omit<Props, keyof Injected>, context?: any) => React.Component<Omit<Props, keyof Injected>, State> )
  ) {
    const forwardRef = React.forwardRef<ComponentType, Props>((props, ref) => callback(component, props, ref));
    hoistStatics(forwardRef, component);
    return forwardRef as any;
  };
  return res;
}
