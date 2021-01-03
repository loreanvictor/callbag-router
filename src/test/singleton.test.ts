import register from 'jsdom-global';
import pipe from 'callbag-pipe';
import subscribe from 'callbag-subscribe';
import { should } from 'chai';
import { BrowserRoutingEnvironment } from '../browser';

import { Router } from '../router';
import { initialize, navigate, match, Routing, path, query } from '../singleton';
import { InMemRoutingEnvironment } from '../util';

should();

describe('Routing', () => {
  describe('.instance', () => {
    it('should return a router instance, who by default is browser-based.', () => {
      const cleanup = register();

      Routing.instance.should.be.instanceOf(Router);
      Routing.instance.environment.should.be.instanceOf(BrowserRoutingEnvironment);

      cleanup();
    });

    it('should return the router instance that was initialized.', () => {
      const router = Routing.initialize({ environment: new InMemRoutingEnvironment() });
      Routing.instance.should.equal(router);
    });
  });

  describe('.initialize()', () => {
    it('should replace the singleton instance.', () => {
      const a = Routing.initialize({ environment: new InMemRoutingEnvironment() });
      Routing.instance.should.equal(a);
      const b = Routing.initialize({ environment: new InMemRoutingEnvironment() });
      Routing.instance.should.equal(b);
      Routing.instance.should.not.equal(a);
    });
  });
});


describe('initialize()', () => {
  it('should initialize Routing.instance.', () => {
    const a = initialize({ environment: new InMemRoutingEnvironment() });
    Routing.instance.should.equal(a);
    const b = initialize({ environment: new InMemRoutingEnvironment() });
    Routing.instance.should.equal(b);
    Routing.instance.should.not.equal(a);
  });
});

describe('navigate()', () => {
  it('should navigate Routing.instance.', () => {
    const env = new InMemRoutingEnvironment();
    initialize({ environment: env });
    navigate('/hellow/:name', { route: { name: 'world' }, query: { x: '' }});
    env.getUrl().should.equal('hellow/world');
    env.getQuery().should.equal('x');
  });
});

describe('match()', () => {
  it('should match Routing.instance.nav with given route.', () => {
    initialize({ environment: new InMemRoutingEnvironment() });
    const r: boolean[] = [];

    pipe(match('hellow/:name/**'), subscribe(v => r.push(v)));
    navigate('/hellow/world/x/y/z');
    navigate('/hellow');
    navigate('/hellow/jack');

    r.should.eql([false, true, false, false]);
  });
});

describe('path()', () => {
  it('should return Routning.instance.nav', () => {
    path().should.equal(Routing.instance.nav);
  });
});

describe('query()', () => {
  it('should return Routing.instance.query', () => {
    query().should.equal(Routing.instance.query);
  });
});

