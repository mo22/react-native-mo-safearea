import * as React from 'react';
import * as hoistStatics from 'hoist-non-react-statics';

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
    const withStatics = hoistStatics(render, component as any);
    return withStatics as any;
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
    ComponentType &
    ( new (props: Omit<Props, keyof Injected>, context?: any) => React.Component<Omit<Props, keyof Injected>, State> )
  ) {
    const forwardRef = React.forwardRef<ComponentType, Props>((props, ref) => callback(component, props, ref));
    const withStatics = hoistStatics(forwardRef, component as any);
    return withStatics as any;
  };
  return res;
}
