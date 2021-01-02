import { should } from 'chai';
import register from 'jsdom-global';
import subscribe from 'callbag-subscribe';
import pipe from 'callbag-pipe';

import { BrowserRoutingEnvironment } from '../browser';
import { Router } from '../router';
import { InMemRoutingEnvironment } from '../util';
import { QueryParams } from '../types';


should();

describe('Router', () => {
  it('should initialize with given parameters.', () => {
    const env = new InMemRoutingEnvironment();
    const router = new Router({
      environment: env,
      defaultRoute: 'hellow'
    });

    router.defaultRoute.should.equal('hellow');
    router.environment.should.equal(env);
  });

  it('should initialize with proper default parameters.', () => {
    const cleanup = register();

    const router = new Router();
    router.environment.should.be.instanceOf(BrowserRoutingEnvironment);
    router.defaultRoute.should.equal('');

    cleanup();
  });

  describe('.getUrl()', () => {
    it('should return environment URL.', () => {
      const env = new InMemRoutingEnvironment();
      const router = new Router({ environment: env });

      router.getUrl().should.equal('');
      env.push('/hellow/there');
      router.getUrl().should.equal('/hellow/there');
    });

    it('should return default route if no enviroment URL is set.', () => {
      const env = new InMemRoutingEnvironment();
      const router = new Router({ environment: env, defaultRoute: 'x' });
      router.getUrl().should.equal('x');
    });
  });

  describe('.getQuery()', () => {
    it('should return environment query params.', () => {
      const env = new InMemRoutingEnvironment();
      const router = new Router({ environment: env });

      router.getQuery().should.eql({});
      env.push('', 'x=y');
      router.getQuery().should.eql({x: 'y'});
      env.push('/x', 'x=y&z=w');
      router.getQuery().should.eql({x: 'y', z: 'w'});
      env.push('a/b/c', 'z=42');
      router.getQuery().should.eql({z: '42'});
    });
  });

  describe('.navigate()', () => {
    it('should navigate to given path.', () => {
      const env = new InMemRoutingEnvironment();
      const router = new Router({ environment: env });

      router.navigate('/hellow');
      env.getUrl().should.equal('hellow');
      router.navigate('/hellow/world/');
      env.getUrl().should.equal('hellow/world');
    });

    it('should navigate using given query params.', () => {
      const env = new InMemRoutingEnvironment();
      const router = new Router({ environment: env });

      router.navigate('/hellow', { query: {x : '2', y: ''}});
      env.getUrl().should.equal('hellow');
      env.getQuery().should.equal('x=2&y');
      router.navigate('/hellow', { query: {x : '42'}});
      env.getQuery().should.equal('x=42');
    });

    it('should navigate using given route params.', () => {
      const env = new InMemRoutingEnvironment();
      const router = new Router({ environment: env });

      router.navigate('/hellow/:name', {route: {name: 'world'}});
      env.getUrl().should.equal('hellow/world');
      router.navigate('/hellow/:name', {route: {name: 'jack'}});
      env.getUrl().should.equal('hellow/jack');
    });

    it('should navigate properly with relative URLs.', () => {
      const env = new InMemRoutingEnvironment();
      const router = new Router({ environment: env });

      router.navigate('hellow');
      env.getUrl().should.equal('hellow');
      router.navigate('./world');
      env.getUrl().should.equal('hellow/world');
      router.navigate('../jack');
      env.getUrl().should.equal('hellow/jack');
      router.navigate('../');
      env.getUrl().should.equal('hellow');
    });
  });

  describe('.nav', () => {
    it('should reflect the navigated URL (absolute unparametrized).', () => {
      const env = new InMemRoutingEnvironment();
      const router = new Router({ environment: env });
      const r: string[] = [];

      pipe(router.nav, subscribe(n => r.push(n)));
      router.navigate('/hellow');
      r.should.eql(['', 'hellow']);
      router.navigate('hellow/world/');
      r.should.eql(['', 'hellow', 'hellow/world']);
      router.navigate('../');
      r.should.eql(['', 'hellow', 'hellow/world', 'hellow']);
      router.navigate('hellow/:name', { route: {name: 'world'}});
      r.should.eql(['', 'hellow', 'hellow/world', 'hellow', 'hellow/world']);
      router.navigate('../:name', { route: {name: 'jack'}, query: {x: '42'}});
      r.should.eql(['', 'hellow', 'hellow/world', 'hellow', 'hellow/world', 'hellow/jack']);
    });

    it('should remain updated when environment state is popped.', () => {
      const env = new InMemRoutingEnvironment();
      const router = new Router({ environment: env });
      const r: string[] = [];

      router.navigate('A');
      router.navigate('B');
      router.navigate('B', {query: {x: ''}});
      router.navigate('C');
      router.navigate('C/:name', {route: {name: 'jack'}});
      router.navigate('D');

      pipe(router.nav, subscribe(n => r.push(n)));

      r.should.eql(['D']);
      env.back();
      r.should.eql(['D', 'C/jack']);
      env.back();
      r.should.eql(['D', 'C/jack', 'C']);
      env.back();
      r.should.eql(['D', 'C/jack', 'C', 'B']);
      env.back();
      r.should.eql(['D', 'C/jack', 'C', 'B', 'B']);
      env.go(2);
      r.should.eql(['D', 'C/jack', 'C', 'B', 'B', 'C']);
      env.go(-10);
      r.should.eql(['D', 'C/jack', 'C', 'B', 'B', 'C', 'A']);
    });
  });

  describe('.query', () => {
    it('should reflect the query params.', () => {
      const env = new InMemRoutingEnvironment();
      const router = new Router({ environment: env });
      const r: QueryParams[] = [];

      pipe(router.query, subscribe(n => r.push(n)));

      r.should.eql([{}]);
      router.navigate('hellow', {query: {x: '2'}});
      r.should.eql([{}, {x: '2'}]);
      router.navigate('hellow', {query: {x: '3', y: ''}});
      r.should.eql([{}, {x: '2'}, {x: '3', y: ''}]);
    });

    it('should trace environment state pops.', () => {
      const env = new InMemRoutingEnvironment();
      const router = new Router({ environment: env });
      const r: QueryParams[] = [];

      router.navigate('hellow', {query: {x: '2'}});
      router.navigate('hellow', {query: {x: '3'}});
      router.navigate('world', {query: {x: '3'}});
      router.navigate('world', {query: {y: ''}});

      pipe(router.query, subscribe(n => r.push(n)));

      r.should.eql([{y: ''}]);
      env.back();
      r.should.eql([{y: ''}, {x: '3'}]);
      env.back();
      r.should.eql([{y: ''}, {x: '3'}, {x: '3'}]);
      env.back();
      r.should.eql([{y: ''}, {x: '3'}, {x: '3'}, {x: '2'}]);
      env.go(10);
      r.should.eql([{y: ''}, {x: '3'}, {x: '3'}, {x: '2'}, {y: ''}]);
    });

    it('should update environment query when it is updated.', () => {
      const env = new InMemRoutingEnvironment();
      const router = new Router({ environment: env });

      router.query.sub('x').set('42');
      env.getQuery().should.equal('x=42');
      router.query.sub('x').set('43');
      env.getQuery().should.equal('x=43');
      router.query.set({y: ''});
      env.getQuery().should.equal('y');
    });

    it('should only push to history state when something has really changed.', () => {
      const env = new InMemRoutingEnvironment();
      const router = new Router({ environment: env });

      router.navigate('hellow');
      router.query.sub('x').set('42');
      router.query.sub('x').set('42');
      env.getQuery().should.equal('x=42');
      env.back();
      env.getQuery().should.equal('');
    });
  });

  describe('.clear()', () => {
    it('should stop tracking of pop events on `.nav`', () => {
      const env = new InMemRoutingEnvironment();
      const router = new Router({ environment: env });
      const r: string[] = [];

      router.navigate('A');
      router.navigate('B');
      router.navigate('C');

      pipe(router.nav, subscribe(n => r.push(n)));
      env.back();
      r.should.eql(['C', 'B']);
      router.clear();
      env.back();
      r.should.eql(['C', 'B']);
    });

    it('should stop tracking of pop events on `.query`', () => {
      const env = new InMemRoutingEnvironment();
      const router = new Router({ environment: env });
      const r: QueryParams[] = [];

      router.navigate('A');
      router.navigate('B', {query: {x: '42'}});
      router.navigate('B', {query: {y: ''}});

      pipe(router.query, subscribe(n => r.push(n)));
      env.back();
      r.should.eql([{y: ''}, {x: '42'}]);
      router.clear();
      env.back();
      r.should.eql([{y: ''}, {x: '42'}]);
    });

    it('should stop updating query parameters from `.query` state.', () => {
      const env = new InMemRoutingEnvironment();
      const router = new Router({ environment: env });

      router.query.sub('x').set('42');
      env.getQuery().should.equal('x=42');
      router.clear();
      router.query.sub('x').set('43');
      env.getQuery().should.equal('x=42');
    });
  });
});
