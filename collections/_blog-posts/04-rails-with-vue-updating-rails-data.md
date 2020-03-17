---
title: Updating Rails Data
date: 2020-03-03
layout: post
image: https://placekitten.com/1920/1920
custom_excerpt: This is intended to be a guide to updating Rails data using an inline table editor made with Vue
---

#### This tutorial assumes you have read the previous articles, starting from [here](/blog-posts/02-rails-with-vue-your-first-component.html). If you want to skip straight to this step, pick up a copy of the code you'll need from [this](https://github.com/ctrlaltdelete44/vue-test-app/tree/chp-2) repo

## 1. Adding a static table

To create our table, we're going to use the `bootstrap-vue` package, chosen to help this table module more easily integrate with existing web apps.

```bash
  $ yarn add bootstrap-vue
    ...
    > info All dependencies
    > ├─ @nuxt/opencollective@0.3.0
    > ├─ bootstrap-vue@2.7.0
    > ├─ bootstrap@4.4.1
    > ├─ consola@2.11.3
    > ├─ node-fetch@2.6.0
    > ├─ popper.js@1.16.1
    > ├─ portal-vue@2.1.7
    > └─ vue-functional-data-merge@3.1.0
    > ✨  Done in 7.69s.
```

Lets build our base component:

```bash
  > app
    > javascript
      + films-table.vue
```

```vue
// As a base...
<template>
</template>

<script>
</script>


<style scoped>
</style>
```

And now fill out the three sections. Firstly we'll give it some mock data to work with...

```js
<script>
  export default {
    data() {
      return {
        fields: [{ ID: 'id', Title: 'title', Description: 'description' }],
        items: [
          {
            id: 0,
            title: 'My Neighbour Totoro',
            description: 'Mei and Satsuki shift to a new house to be closer to their mother...',
          },
          {
            id: 1,
            title: 'Spirited Away',
            description: 'Chihiro and her parents stumble upon a seemingly abandoned amusement park...'
          },
        ]
      };
    },
  }
</script>
```

And then some basic styling (Bootstrap will do most of the work :grin:)

```css
<style scoped>
  body { padding: 1rem; }
</style>
```

And finally, lets set the table layout:

```html
<template>
  <div>
    <b-table striped hover
      :items='items'
      :fields='fields'
      >
    </b-table>
  </div>
</template>
```

Now we can update the Javascript `films-list` mounter to render the table as well:

```js
// At app/javascript/packs/films-list.js

// your previous imports

// import the new component
import Table from '../films-table.vue'

// configure Vue to use the bootstrap-vue styling
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// And import the bootstrap vue package to use
import BootstrapVue from 'bootstrap-vue'
Vue.use(BootstrapVue)

document.addEventListener('DOMContentLoaded', () => {
  // Your previous event handler...

  new Vue({
    el: '#filmTable',
    render: h => h(Table),
  })
});
```

, add the relevant `div` for this to attach to into our view...

```html
<!-- Add to app/views/films/index.html.erb -->
<div id='filmTable'></div>
```

, and update our webpack server:

```bash
$ bin/webpack
  > Version: webpack 4.42.0
  > Time: 4675ms
  > Built at: 03/17/2020 16:57:27
  ...
$ bin/webpack-dev-server
  ...
  > ℹ ｢wdm｣: Compiled successfully.
```

To enjoy your moment of glory, head to [http://localhost:3000/films](http://localhost:3000/films) and see your new table!

## 2. Populating the table with Rails data

The particularly eagle-eyed amongst you will notice that this article promises the use of Rails data - indeed, by the end of the [last article]() we already had access to our data. And now we're back to static data? Prepostorous!

I can only humbly apologise, dear reader, and seek to rectify this as soon as possible.

Step one is clearing out that awful, nasty static data to stop you from complaining about it any more.

```js
// app/javascript/films-table.vue
<script>
  export default {
    data() {
      return {
        fields: [{ ID: 'id', Title: 'title', Description: 'description' }],
        items: []
      };
    },
  }
</script>
```

And then add the simple axios request we used in the list. The only caveat is to remember to assign the retrieved data to `items` instead of `films`.

```js
// app/javascript/films-table.vue
<script>
  import axios from 'axios'

  export default {
    data() {
      return {
        fields: [{ ID: 'id', Title: 'title', Description: 'description' }],
        items: []
      };
    },
    created () {
      axios
      .get('/films.json')
      .then(response => (this.items = response.data))
    }
  }
</script>
```

And that's it!

*N.B that around here the `films-list` component becomes really redundant. If you're checking against the [repository]() and are concerned, I've just cleared out some of the older code from the first two chapters*

## 3. Updating the data
