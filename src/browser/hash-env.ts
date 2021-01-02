/* istanbul ignore file */

import { RoutingEnvironment } from '../env';


export class BrowserHashRoutingEnvironment implements RoutingEnvironment {
  getUrl(){
    return window.location.hash.substr(1).split('?')[0];
  }

  getQuery(): string {
    return window.location.hash.substr(1).split('?')[1];
  }

  push(url: string, query?: string): void {
    const target = query ? url + '?' + query : url;
    history.pushState(target, '', '#' + target);
  }

  onPop(callback: () => void) {
    window.addEventListener('popstate', callback);

    return () => window.removeEventListener('popstate', callback);
  }
}
