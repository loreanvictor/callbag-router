import g2re from 'glob-to-regexp';
import map from 'callbag-map';
import pipe from 'callbag-pipe';
import { Source } from 'callbag';


export function match(target: string, route: string): boolean;
export function match(target: Source<string>, route: string): Source<boolean>;
export function match(target: string | Source<string>, route: string): boolean | Source<boolean> {
  const path = route.split('/').map(s => s.startsWith(':') ? '*' : s).join('/');
  const re = g2re(path, { globstar: true });

  if (typeof target === 'string') {
    return re.test(target);
  } else {
    return pipe(target, map(t => re.test(t)));
  }
}
