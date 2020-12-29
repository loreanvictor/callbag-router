import { makeRenderer } from 'callbag-jsx';
import state from 'callbag-state';

import { Route, navigate, query } from '../src';

const renderer = makeRenderer();
const s = state('');

renderer.render(<>
  <input _state={s} type='string'/>
  <button onclick={() => navigate('/a/:id', { route: { id: s.get() || ''} })}>Goto A</button>
  <button onclick={() => navigate('/b')}>Goto B</button>
  <input _state={query().sub('x')} type='text'/>

  <Route path='a/:id' rerender component={(params) => <div>AAA = {params.id}</div>}/>
  <Route path='b' component={() => <div>BBB</div>}/>
</>).on(document.body);
