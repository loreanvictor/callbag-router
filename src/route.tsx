import pipe from 'callbag-pipe';
import subscribe from 'callbag-subscribe';
import map from 'callbag-map';
import { RendererLike } from 'render-jsx';
import { scanRemove } from 'render-jsx/dom/util';
import { Source } from 'callbag';
import { Conditional, TrackerComponentThis } from 'callbag-jsx';

import { RouteParams } from './types';
import { Router } from './router';
import { Routing } from './singleton';
import { extractParams, match, normalize, isEqual } from './util';


export interface RoutePropsNoRerender {
  path: string;
  router?: Router;
  pure: true;
  component: (params: Source<RouteParams>) => Node;
}

export interface RouterPropsRerender {
  path: string;
  router?: Router;
  component: (params: RouteParams) => Node;
}

export type RouteProps = RoutePropsNoRerender | RouterPropsRerender;

function rerender(props: RouteProps): props is RouterPropsRerender {
  return !(props as any).pure;
}

export function Route(props: RoutePropsNoRerender, renderer: RendererLike<Node>): Node;
export function Route(props: RouterPropsRerender, renderer: RendererLike<Node>): Node;
export function Route(this: TrackerComponentThis, props: RouteProps, renderer: RendererLike<Node>) {
  const router = props.router || Routing.instance;
  const path = normalize(props.path);

  if (rerender(props)) {
    const start = renderer.leaf();
    const end = renderer.leaf();

    type State = [boolean, RouteParams];
    let last: State = [false, {}];
    const fragment = <>{start}{end}</>;

    this.track(pipe(
      router.nav,
      map(route => [match(route, path), extractParams(path, route)] as State),
      subscribe(state => {
        if (state[0] !== last[0] || !isEqual(state[1], last[1])) {
          last = state;
          scanRemove(start, end, { remove: node => renderer.remove(node) });
          if (state[0]) {
            renderer.render(props.component(state[1])).after(start);
          }
        }
      })
    ));

    return fragment;
  } else {
    return <Conditional
      if={match(router.nav, path)}
      then={() => props.component(pipe(router.nav, map(n => extractParams(path, n))))}
    />;
  }
}
