export function absolutify(current: string, route: string) {
  if (route.startsWith('../') || route.startsWith('./')) {
    const segments = current.split('/');
    let cursor = segments.length;

    route.split('/').forEach(step => {
      if (step === '.') {
        // nothing
      } else if (step === '..' && cursor > 0) {
        cursor --;
      } else {
        segments[cursor] = step;
        cursor ++;
      }
    });

    segments.splice(cursor);

    return segments.join('/');
  } else {
    return route;
  }
}

