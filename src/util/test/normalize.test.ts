import { should } from 'chai';
import { normalize } from '../normalize';

should();

describe('normalize()', () => {
  it('should remove leading and trailing slashes.', () => {
    normalize('/x').should.equal('x');
    normalize('/x/').should.equal('x');
    normalize('x').should.equal('x');
    normalize('x/y/').should.equal('x/y');
    normalize('x/y').should.equal('x/y');
    normalize('/x/y').should.equal('x/y');
    normalize('/x/y/').should.equal('x/y');
    normalize('').should.equal('');
    normalize('', 'x').should.equal('x');
  });
});
