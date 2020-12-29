import { RouteParams } from '../types';


export function injectParams(template: string, params: RouteParams) {
  return template.split('/').map(s => {
    if (s.startsWith(':')) {
      return encodeURIComponent(params[s.substr(1)]);
    } else {
      return s;
    }
  }).join('/');
}


export function extractParams(template: string, route: string) {
  const splits = route.split('/');
  const P: RouteParams = {};

  template.split('/').forEach((s, i) => {
    if (s.startsWith(':')) {
      P[s.substr(1)] = decodeURIComponent(splits[i]);
    }
  });

  return P;
}
