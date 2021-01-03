<div align="center">

<img src="https://raw.githubusercontent.com/loreanvictor/callbag-common/main/callbag.svg" width="156"/>
<br><br>

# callbag-router

[![tests](https://img.shields.io/github/workflow/status/loreanvictor/callbag-router/Test%20and%20Report%20Coverage?label=tests&logo=mocha&logoColor=green&style=flat-square)](https://github.com/loreanvictor/callbag-router/actions?query=workflow%3A%22Test+and+Report+Coverage%22)
[![coverage](https://img.shields.io/codecov/c/github/loreanvictor/callbag-router?logo=codecov&style=flat-square)](https://codecov.io/gh/loreanvictor/callbag-router)
[![version](https://img.shields.io/npm/v/callbag-router?logo=npm&style=flat-square)](https://www.npmjs.com/package/callbag-router)

</div>

<br/><br/>

Routing for single-page applications, using [Callbags](https://github.com/callbag/callbag).
- Integrates with [`callbag-jsx`](https://loreanvictor.github.io/callbag-jsx/)
- Can be used independently though (or with other UI libraries and frameworks)
- Supports normal routing and hash-based routing (all routes start with `#`) out of the box
- You can plug in your own [routing environment](https://github.com/loreanvictor/callbag-router/blob/main/src/env.ts), for use outside of browser
- Supports [glob](https://en.wikipedia.org/wiki/Glob_(programming)) route matching, i.e. `**/hellow`
- Supports route parameters, i.e. `/hellow/:name`
- Supports relative navigation, i.e. `navigate('../wherever')`

```bash
npm i callbag-router
```

<br>

👉 Use with [`callbag-jsx`](https://loreanvictor.github.io/callbag-jsx/):
```tsx
import { Route } from 'callbag-router'
import { pipe, map } from 'callbag-common'
import { makeRenderer } from 'callbag-jsx'

const renderer = makeRenderer()
renderer.render(
  <>
    <Route
      path='/hellow/:name'
      component={params => <div>Hellow {params.name}!</div>}
    />
    <Route path='/goodbye' component={() => <div>GoodBye!</div>}/>
  </>
).on(document.body)
```

<br>

👉 Navigate around:

```ts
import { navigate } from 'callbag-router'

// --> navigates to /hellow/world
navigate('/hellow/world')

// --> navigates to /hellow?name=World
navigate('/hellow', {
  query: {
    name: 'World'
  }
})

// --> navigates to /hellow/World
navigate('hellow/:name', {
  route: {
    name: 'World'
  }
})

// --> navigates to /hellow/john
navigate('../john')
```

<br>

👉 Listen to query parameter changes:

```ts
import { query } from 'callbag-router'
import { pipe, subscribe } from 'callbag-common'

pipe(
  query(),
  subscribe(console.log)     // --> logs an object of query parameters
)
```

<br>

👉 Update query parameters:

```ts
import { query, navigate } from 'callbag-router'
import { pipe, subscribe } from 'callbag-common'

navigate('hellow')
query().sub('name').set('world')    // --> set query parameter `name` to 'world'
```

<br>

👉 Manually listen to route changes:

```ts
import { match } from 'callbag-router'
import { pipe, subscribe } from 'callbag-common'

pipe(
  match('hellow/**'),                 // --> matches `/hellow/x`, `/hellow/x/y/z`, etc.
  subscribe(matched => {
    if (matched) {
      console.log('Hellow there!')
    }
  })
)
```

<br>

👉 Hash-based routing:

```ts
import { initialize } from 'callbag-router'
import { BrowserHashRoutingEnvironment } from 'callbag-router/browser'

initialize({
  environment: new BrowserHashRoutingEnvironment()
})
```

<br>

<br>

## Contribution

Play nice and respectful. Useful commands for development:

```bash
git clone https://github.com/loreanvictor/callbag-router.git
```
```bash
npm i               # --> install dependencies
```
```bash
npm start           # --> serve samples/index.tsx on localhost:3000
```
```bash
npm test            # --> run tests
```
```bash
npm run cov:view    # --> view coverage
```

<br><br>
