import { should } from 'chai';
import { extractParams, injectParams } from '../params';

should();

describe('injectParams()', () => {
  it('should inject given params into given route.', () => {
    injectParams('/hellow/:world/and/:name', {
      world: 'World',
      name: 'Jack'
    }).should.equal('/hellow/World/and/Jack');
  });

  it('should URL-encode params.', () => {
    injectParams('hey/:there', {
      there: 'hellow world'
    }).should.equal('hey/hellow%20world');
  });

  it('should ignore non-existing params and mark missing params as undefined.', () => {
    injectParams('x/:y/:z', {
      w: '2',
      z: 'HH'
    }).should.equal('x/undefined/HH');
  });
});

describe('extractParams()', () => {
  it('should extract route params based on given template.', () => {
    extractParams('/hellow/:name/and/:dude/', '/hellow/world/and/jack').should.eql({
      name: 'world',
      dude: 'jack'
    });
  });

  it('should decode parameters', () => {
    extractParams('/hellow/:name', '/hellow/mr%20jack').should.eql({
      name: 'mr jack'
    });
  });

  it.skip('should properly extract parameters with globstar routes.', () => {
    extractParams('/hellow/**/world/:name', '/hellow/x/y/world/z').should.eql({
      name: 'z'
    });
  });
});

