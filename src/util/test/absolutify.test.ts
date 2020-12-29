import { should } from 'chai';
import { absolutify } from '../absolutify';

should();

describe('absolutify()', () => {
  it('should turn a relative address to an absolute one based on given current address.', () => {
    absolutify('a/b/c', 'd').should.equal('d');
    absolutify('a/b/c', './d').should.equal('a/b/c/d');
    absolutify('a/b/c', '../d').should.equal('a/b/d');
    absolutify('a/b/c', '../../d').should.equal('a/d');
    absolutify('a/b/c', '../../../d').should.equal('d');
    absolutify('a/b/c', './d/e').should.equal('a/b/c/d/e');
    absolutify('a/b/c', '../d/e').should.equal('a/b/d/e');
    absolutify('a/b/c', '../../d/e').should.equal('a/d/e');
    absolutify('a/b/c', '../../d/./e').should.equal('a/d/e');
    absolutify('a/b/c', '../../d/../e').should.equal('a/e');
  });
});
