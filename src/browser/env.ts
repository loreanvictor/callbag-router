/* istanbul ignore file */
import { RoutingEnvironment } from '../env';


export class BrowserRoutingEnvironment implements RoutingEnvironment {
  getUrl(){
    return window.location.pathname.substr(1).split('?')[0];
  }

  getQuery(): string {
    return window.location.search.substr(1);
  }

  push(url: string, query?: string): void {
    const target = query ? url + '?' + query : url;
    history.pushState(target, '', '/' + target);
  }

  onPop(callback: () => void): void {
    window.addEventListener('popstate', callback);
  }
}
