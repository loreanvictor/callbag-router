import { should } from 'chai';
import { TestRoutingEnvironment } from '../test-env';

should();

describe('TestRoutingEnvironment', () => {
  it('should route using `.push()`.', () => {
    const env = new TestRoutingEnvironment();

    env.getUrl().should.equal('');
    env.getQuery().should.equal('');

    env.push('hellow');
    env.getUrl().should.equal('hellow');
    env.getQuery().should.equal('');

    env.push('world', 'hehe');
    env.getUrl().should.equal('world');
    env.getQuery().should.equal('hehe');
  });

  it('should go back using `.back()`.', () => {
    const env = new TestRoutingEnvironment();

    env.push('A');
    env.push('B', 'Q');
    env.push('B', 'R');
    env.push('C');

    env.getUrl().should.equal('C');
    env.getQuery().should.equal('');
    env.back();
    env.getUrl().should.equal('B');
    env.getQuery().should.equal('R');
    env.back();
    env.getUrl().should.equal('B');
    env.getQuery().should.equal('Q');
    env.back();
    env.getUrl().should.equal('A');
    env.getQuery().should.equal('');
    env.back();
    env.getUrl().should.equal('A');
    env.getQuery().should.equal('');
  });

  it('should go forward using `.forward()`.', () => {
    const env = new TestRoutingEnvironment();

    env.push('A');
    env.push('B', 'Q');
    env.push('B', 'R');
    env.push('C');

    env.back(); env.back(); env.back(); env.back();

    env.getUrl().should.equal('A');
    env.getQuery().should.equal('');
    env.forward();
    env.getUrl().should.equal('B');
    env.getQuery().should.equal('Q');
    env.forward();
    env.getUrl().should.equal('B');
    env.getQuery().should.equal('R');
    env.forward();
    env.getUrl().should.equal('C');
    env.getQuery().should.equal('');
  });

  it('should seek using `.go()`.', () => {
    const env = new TestRoutingEnvironment();

    env.push('A');
    env.push('B', 'Q');
    env.push('B', 'R');
    env.push('C');

    env.go(-2);
    env.getUrl().should.equal('B');
    env.getQuery().should.equal('Q');
    env.go(-10);
    env.getUrl().should.equal('A');
    env.getQuery().should.equal('');
    env.go(2);
    env.getUrl().should.equal('B');
    env.getQuery().should.equal('R');
    env.go(10);
    env.getUrl().should.equal('C');
    env.getQuery().should.equal('');
  });

  it('should remove forward stack when pushed after some seek.', () => {
    const env = new TestRoutingEnvironment();

    env.push('A');
    env.push('B', 'Q');
    env.push('B', 'R');
    env.push('C');

    env.go(-2);
    env.push('D');
    env.back();
    env.getUrl().should.equal('B');
    env.getQuery().should.equal('Q');
    env.forward();
    env.getUrl().should.equal('D');
    env.forward();
    env.getUrl().should.equal('D');
  });

  it('should call popstate listeners registered with `.onPop()`.', () => {
    const env = new TestRoutingEnvironment();
    const r: any[] = [];

    env.onPop(() => r.push([env.getUrl(), env.getQuery()]));

    env.push('A');
    env.push('B', 'Q');
    env.push('B', 'R');
    env.push('C');

    r.should.eql([]);
    env.back();
    r.should.eql([['B', 'R']]);
    env.go(-2);
    r.should.eql([['B', 'R'], ['A', '']]);
    env.forward();
    r.should.eql([['B', 'R'], ['A', ''], ['B', 'Q']]);
    env.go(10);
    r.should.eql([['B', 'R'], ['A', ''], ['B', 'Q'], ['C', '']]);
  });
});
