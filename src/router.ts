import pipe from 'callbag-pipe';
import subscribe from 'callbag-subscribe';
import { state, State } from 'callbag-state';

import { BrowserRoutingEnvironment } from './browser';
import { RoutingEnvironment } from './env';
import { QueryParams, RouteParams } from './types';
import { isEqual, absolutify, injectParams, normalize, parseQuery, serializeQuery } from './util';


export interface RouterOptions {
  defaultRoute?: string;
  environment?: RoutingEnvironment;
}


export interface NavigationOptions {
  route?: RouteParams;
  query?: QueryParams;
}


export class Router {
  readonly defaultRoute: string;
  readonly environment: RoutingEnvironment;

  readonly nav: State<string>;
  readonly query: State<QueryParams>;

  private _clear: () => void;

  constructor(options?: RouterOptions) {
    this.defaultRoute = options?.defaultRoute || '';
    this.environment = options?.environment || new BrowserRoutingEnvironment();

    this.nav = state(normalize(this.getUrl(), this.defaultRoute));
    this.query = state(this.getQuery());

    this.environment.onPop(() => this.navigate(
      this.getUrl(),
      { query: this.getQuery() },
      false
    ));

    this._clear = pipe(
      this.query,
      subscribe(q => {
        if (!isEqual(q, this.getQuery())) {
          const nav = this.nav.get();
          this.environment.push(nav, serializeQuery(q));
        }
      })
    );
  }

  clear() {
    this._clear();
  }

  getUrl() { return this.environment.getUrl() || this.defaultRoute; }
  getQuery() { return parseQuery(this.environment.getQuery() || '') || {}; }

  navigate(target: string, options?: NavigationOptions, push = true) {
    const absolute = pipe(
      target,
      url => normalize(url, this.defaultRoute),
      url => injectParams(url, options?.route || {}),
      url => absolutify(this.nav.get(), url),
    );

    if (push) {
      this.environment.push(absolute, serializeQuery(options?.query || {}));
    }

    this.query.set(options?.query || {});
    this.nav.set(absolute);
  }
}
