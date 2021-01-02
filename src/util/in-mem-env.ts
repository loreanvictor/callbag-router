import { RoutingEnvironment } from '../env';


export class InMemRoutingEnvironment implements RoutingEnvironment {
  private _stack: string[] = [];
  private _cursor = -1;
  private _poplisteners: (() => void)[] = [];

  getUrl(): string {
    if (this._cursor >= 0 && this._stack[this._cursor]) {
      return this._stack[this._cursor].split('?')[0];
    } else {
      return '';
    }
  }

  getQuery(): string {
    if (this._cursor >= 0 && this._stack[this._cursor]) {
      return this._stack[this._cursor].split('?')[1] || '';
    } else {
      return '';
    }
  }

  push(url: string, query?: string): void {
    this._stack.splice(this._cursor + 1);

    if (query) {
      this._stack.push(url + '?' + query);
    } else {
      this._stack.push(url);
    }

    this._cursor = this._stack.length - 1;
  }

  onPop(callback: () => void) {
    this._poplisteners.push(callback);

    return () => this._poplisteners = this._poplisteners.filter(cb => cb !== callback);
  }

  forward() {
    this.go(1);
  }

  back() {
    this.go(-1);
  }

  go(delta: number) {
    this._cursor += delta;
    if (this._cursor < 0) {
      this._cursor = 0;
    }
    if (this._cursor > this._stack.length - 1) {
      this._cursor = this._stack.length - 1;
    }
    this._poplisteners.forEach(l => l());
  }
}
