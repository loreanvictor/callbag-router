/* eslint-disable no-unused-expressions */
import { pipe, subscribe } from 'callbag-common';
import state from 'callbag-state';
import { should } from 'chai';
import { match } from '../match';

should();

describe('match()', () => {
  it('should check if given target matches given route.', () => {
    match('a/b/c', 'a/b/c').should.be.true;
    match('a/b/c', 'a/b/d').should.be.false;
    match('/a/b/c', 'a/b/c').should.be.false;
    match('a/b/c', 'a/b/c/').should.be.false;

    match('a/b/c', 'a/*/c').should.be.true;
    match('a/b/c', 'a/*/d').should.be.false;
    match('a/b/c', '*/b/c').should.be.true;
    match('a/b/c', 'a/b/*').should.be.true;
    match('a/b/c', 'a/*').should.be.false;
    match('a/b/c', '*/c').should.be.false;
    match('a/b/c/d', 'a/*/d').should.be.false;
    match('a/b/c', '*/b/*').should.be.true;
    match('a/b/c/d', '*/b/*').should.be.false;

    match('a/b/c', '**/c').should.be.true;
    match('a/b/c', '**/d').should.be.false;
    match('a/b/c', 'a/**').should.be.true;
    match('a/b/c', 'd/**').should.be.false;
    match('a/b/c/d', 'a/**/d').should.be.true;
    match('a/b/c/d', 'a/**/e').should.be.false;
    match('a', 'a/**').should.be.false;
    match('a', 'a**').should.be.true;

    match('a/b/c', 'a/:x/c').should.be.true;
    match('a/b/c', 'a/:x/d').should.be.false;
    match('a/b/c', ':x/b/c').should.be.true;
    match('a/b/c', ':x/b/d').should.be.false;
    match('a/b/c', 'a/b/:x').should.be.true;
    match('a/b/c', 'd/b/:x').should.be.false;
    match('a/b/c/d', 'a/:x/d').should.be.false;
    match('a/b/c/d', 'a/:x/:y/d').should.be.true;
  });

  it('should return a callbag when a callbag is given as target.', () => {
    const s = state('a/b/c');
    const r: any[] = [];
    pipe(match(s, 'a/**/:x/d/*'), subscribe(v => r.push(v)));
    s.set('a/b/c/d');
    s.set('a/b/b/c/d');
    s.set('a/b/b/c/d/e');
    s.set('a/b/c/d/e');

    r.should.eql([false, false, false, false, true, true]);
  });
});
