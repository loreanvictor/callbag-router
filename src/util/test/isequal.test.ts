/* eslint-disable no-unused-expressions */
import { should } from 'chai';
import { isEqual } from '../isequal';

should();

describe('isEqual()', () => {
  it('should determine whether two route/query params are the same.', () => {
    isEqual({}, undefined as any).should.be.false;
    isEqual(undefined as any, {}).should.be.false;
    isEqual({}, {a: '2'}).should.be.false;
    isEqual({a: '2'}, {a: '3'}).should.be.false;
    isEqual({}, {}).should.be.true;
    isEqual({a: '2', b: '3'}, {b: '3', a: '2'}).should.be.true;
  });
});
