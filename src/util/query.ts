import { QueryParams } from '../types';


export function serializeQuery(query: QueryParams) {
  return Object.entries(query)
    .map(([key, value]) => {
      if (key.length === 0) {
        return;
      } else if (value.length === 0) {
        return encodeURIComponent(key);
      } else {
        return encodeURIComponent(key) + '=' + encodeURIComponent(value);
      }
    })
    .filter(part => !!part)
    .join('&')
  ;
}


export function parseQuery(query: string) {
  return query.split('&').reduce((t, s) => {
    const p = s.split('=');
    const key = decodeURIComponent(p[0]);
    const val = decodeURIComponent(p[1] || '');

    if (key.length > 0) {
      t[key] = val;
    }

    return t;
  }, {} as QueryParams);
}
