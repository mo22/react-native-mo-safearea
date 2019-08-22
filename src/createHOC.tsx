import * as React from 'react';

export function hoistStatics(target: any, source: any) {
  for (const key of [...Object.getOwnPropertyNames(source), ...Object.getOwnPropertySymbols(source)]) {
    // overwrite or not?
    const descriptor = Object.getOwnPropertyDescriptor(source, key);
    if (!descriptor) continue;
    try {
      Object.defineProperty(target, key, descriptor);
    } catch (e) {
    }
  }
}

export function createHOC<Injected>(callback: (component: React.ComponentType<Injected>, props: {}) => React.ComponentType<{}>) {
  const res = function HOC<Props extends Injected>(component: React.ComponentType<Injected>) {
    const render = (props: Props) => callback(component, props);
    return render as any as React.FunctionComponent<Omit<Props, keyof Injected>>;
  };
  return res;
}

export function createStaticHOC<Injected>(callback: (component: any, props: any, ref: any) => any) {
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
    // @TODO: is this really correct?
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
    React.ForwardRefExoticComponent<React.PropsWithoutRef<Props> & React.RefAttributes<ComponentType>>
    // React.ForwardRefExoticComponent<Props>
    // ComponentType &
    // ( new (props: Omit<Props, keyof Injected>, context?: any) => React.Component<Omit<Props, keyof Injected>, State> )
  ) {
    const forwardRef = React.forwardRef<ComponentType, Props>((props, ref) => callback(component, props, ref));
    hoistStatics(forwardRef, component);
    return forwardRef;
  };
  return res;
}
