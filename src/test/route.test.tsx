import { should } from 'chai';
import pipe from 'callbag-pipe';
import map from 'callbag-map';
import { testRender } from 'test-callbag-jsx';

import { Route } from '../route';
import { initialize, navigate } from '../singleton';
import { InMemRoutingEnvironment } from '../util';

should();

describe('Route', () => {
  it('should render stuff based on matching route.', () => {
    testRender((renderer, document) => {
      initialize({ environment: new InMemRoutingEnvironment() });

      renderer.render(<>
        <Route path='hellow/:name' component={params => <div>Hellow {params.name}!</div>}/>
        <Route path='goodbye' component={() => <div>Goodbye!</div>}/>
      </>).on(document.body);

      navigate('/hellow/world');
      document.body.textContent!.should.equal('Hellow world!');

      navigate('/hellow/jack');
      document.body.textContent!.should.equal('Hellow jack!');

      navigate('goodbye');
      document.body.textContent!.should.equal('Goodbye!');
    });
  });

  it('should render purely with `pure` flag.', () => {
    testRender((renderer, document) => {
      initialize({ environment: new InMemRoutingEnvironment() });

      let r = 0;

      renderer.render(<>
        <Route pure path='hellow/:name' component={params => {
          r++;

          return <div>Hellow {pipe(params, map(p => p.name))}!</div>;
        }}/>
      </>).on(document.body);

      navigate('/hellow/world');
      document.body.textContent!.should.equal('Hellow world!');

      navigate('/hellow/jack');
      document.body.textContent!.should.equal('Hellow jack!');

      r.should.equal(1);
    });
  });
});
