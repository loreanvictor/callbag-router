import { makeRenderer } from 'callbag-jsx';
import state from 'callbag-state';
import { pipe, map } from 'callbag-common';

import { Route, navigate } from '../src';

const renderer = makeRenderer();
const s = state('');

renderer.render(<>
  <input _state={s} type='string'/>
  <button onclick={() => navigate('/a/:id', { route: { id: s.get() || ''} })}>Goto A</button>
  <button onclick={() => navigate('/b')}>Goto B</button>

  <Route path='a/:id' component={(params) => <div>AAA = {pipe(params, map(p => p.id))}</div>}/>
  <Route path='b' component={() => <div>BBB</div>}/>
</>).on(document.body);
