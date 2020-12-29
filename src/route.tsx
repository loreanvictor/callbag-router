import isEqual from 'lodash.isequal';
import { RendererLike } from 'render-jsx';
import { scanRemove } from 'render-jsx/dom/util';
import { Source, map, pipe, filter, subscribe } from 'callbag-common';
import { Conditional, TrackerComponentThis } from 'callbag-jsx';

import { RouteParams } from './types';
import { Router } from './router';
import { Routing } from './singleton';
import { extractParams, match } from './util';


export interface RoutePropsNoRerender {
  path: string;
  router?: Router;
  component: (params: Source<RouteParams>) => Node;
}

export interface RouterPropsRerender {
  path: string;
  router?: Router;
  component: (params: RouteParams) => Node;
  rerender: true;
}

export type RouteProps = RoutePropsNoRerender | RouterPropsRerender;

function rerender(props: RouteProps): props is RouterPropsRerender {
  return (props as any).rerender;
}

export function Route(props: RoutePropsNoRerender, renderer: RendererLike<Node>): Node;
export function Route(props: RouterPropsRerender, renderer: RendererLike<Node>): Node;
export function Route(this: TrackerComponentThis, props: RouteProps, renderer: RendererLike<Node>) {
  const router = props.router || Routing.instance;

  if (rerender(props)) {
    const start = renderer.leaf();
    const end = renderer.leaf();

    type State = [boolean, RouteParams];
    let last: State = [false, {}];
    const fragment = <>{start}{end}</>;

    this.track(pipe(
      router.nav,
      map(route => [match(route, props.path), extractParams(props.path, route)] as State),
      filter(state => state[0] !== last[0] || !isEqual(state[1], last[1])),
      subscribe(state => {
        last = state;
        scanRemove(start, end, { remove: node => renderer.remove(node) });
        if (state[0]) {
          renderer.render(props.component(state[1])).after(start);
        }
      })
    ));

    return fragment;
  } else {
    return <Conditional
      if={match(router.nav, props.path)}
      then={() => props.component(pipe(router.nav, map(n => extractParams(props.path, n))))}
    />;
  }
}
