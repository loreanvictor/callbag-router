import { QueryParams, RouteParams } from '../types';

export function isEqual(a: RouteParams | QueryParams, b: RouteParams | QueryParams) {
  if (!a && b || !b && a) {
    return false;
  }

  const aent = Object.entries(a);
  const bent = Object.entries(b);

  if (aent.length !== bent.length) {
    return false;
  }

  for (let i = 0; i < aent.length; i++) {
    const [key, value] = aent[i];
    if (b[key] !== value) {
      return false;
    }
  }

  return true;
}
