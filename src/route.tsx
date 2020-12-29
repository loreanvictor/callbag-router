import { RendererLike } from 'render-jsx';
import { Source, map, pipe } from 'callbag-common';
import { Conditional } from 'callbag-jsx';

import { RouteParams } from './types';
import { Router } from './router';
import { Routing } from './singleton';
import { extractParams, match } from './util';

// TODO: add re-build option
export interface RouteProps {
  path: string;
  router?: Router;
  component: (params: Source<RouteParams>) => Node;
}

export function Route(props: RouteProps, renderer: RendererLike<Node>) {
  const router = props.router || Routing.instance;

  return <Conditional
    if={match(router.nav, props.path)}
    then={() => props.component(pipe(router.nav, map(n => extractParams(props.path, n))))}
  />;
}
