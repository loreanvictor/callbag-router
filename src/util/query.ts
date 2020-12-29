import { QueryParams } from '../types';


export function serializeQuery(query: QueryParams) {
  return Object.entries(query)
    .map(([key, value]) => encodeURIComponent(key) + '=' + encodeURIComponent(value))
    .join('&')
  ;
}


export function parseQuery(query: string) {
  return query.split('&').reduce((t, s) => {
    const p = s.split('=');
    t[decodeURIComponent(p[0])] = decodeURIComponent(p[1] || '');

    return t;
  }, {} as QueryParams);
}
