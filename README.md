# vue-module-acl

## main.js

```js
import NatAcl from 'vue-module-acl'

Vue.use(NatAcl, {
  router: router, init: [
    'news.show',
    'news.post',
  ], fail: '/error'
})

const routes = [
  {
    path: '/',
    component: require('./components/home.vue'),
  },
  {
    path: '/news',
    component: require('./components/news.vue'),
    meta: { permission: { module: 'news', fail: '/error' } }
  },
  {
    path: '/error',
    component: require('./components/error.vue')
  },
]
```

## file.vue

```html
<button v-can="'news.post'">Post News</button>
```

```js
this.$canShow('news.post')
```
