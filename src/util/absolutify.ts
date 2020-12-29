export function absolutify(current: string, route: string, depth = -1): string {
  if (route.startsWith('../')) {
    return current.split('/').slice(0, -depth).concat(absolutify(current, route.substr(3), depth + 1)).join('/');
  } else {
    return route;
  }
}
