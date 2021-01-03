import { NavigationOptions, Router, RouterOptions } from './router';
import { match as _match } from './util';


export class Routing {
  private static __instance: Router;

  static get instance() {
    return this.__instance || this.initialize();
  }

  static initialize(options?: RouterOptions) {
    return this.__instance = new Router(options);
  }
}


export function initialize(options?: RouterOptions) {
  return Routing.initialize(options);
}


export function navigate(target: string, options?: NavigationOptions) {
  return Routing.instance.navigate(target, options);
}


export function match(route: string) {
  return _match(Routing.instance.nav, route);
}


export function path() {
  return Routing.instance.nav;
}


export function query() {
  return Routing.instance.query;
}
