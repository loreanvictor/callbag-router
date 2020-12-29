import { should } from 'chai';
import { parseQuery, serializeQuery } from '../query';

should();

describe('serializeQuery()', () => {
  it('should encode query string', () => {
    serializeQuery({
      hellow: 'world',
      name: 'mr jack'
    }).should.equal('hellow=world&name=mr%20jack');
  });
});

describe('parseQuery()', () => {
  it('should decode query string', () => {
    parseQuery('hellow=world&name=mr%20jack&x').should.eql({
      hellow: 'world',
      name: 'mr jack',
      x: '',
    });
  });

  it('should properly handle empty strings.', () => {
    parseQuery('').should.eql({});
  });
});
