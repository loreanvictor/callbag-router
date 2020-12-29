import state, { State } from 'callbag-state';
import { pipe } from 'callbag-common';
import { BrowserRoutingEnvironment } from './browser';
import { RoutingEnvironment } from './env';
import { QueryParams, RouteParams } from './types';
import { absolutify, injectParams, normalize, parseQuery, serializeQuery } from './util';

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

  constructor(options?: RouterOptions) {
    this.defaultRoute = options?.defaultRoute || '';
    this.environment = options?.environment || new BrowserRoutingEnvironment();

    this.nav = state(this.getUrl());
    this.query = state(this.getQuery());
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

    this.query.set(options?.query || {});
    if (push) {
      this.environment.push(absolute, serializeQuery(options?.query || {}));
    }

    this.nav.set(absolute);
  }
}
