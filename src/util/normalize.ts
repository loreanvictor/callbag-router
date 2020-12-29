export function normalize(route: string, defaultRoute = '') {
  let normal = route;

  if (normal.length === 0) {
    return defaultRoute;
  }

  if (normal.endsWith('/')) {
    normal = normal.substr(0, normal.length - 1);
  }

  if (normal.startsWith('/')) {
    normal = normal.substr(1);
  }

  return normal;
}
