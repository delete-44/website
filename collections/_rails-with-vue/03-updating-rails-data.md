---
title: Updating Rails Data
date: 2020-03-03
layout: post
return_link: /blog-posts/02-rails-with-vue-index
image: https://placekitten.com/1920/1920
custom_excerpt: This is the third installment in a series, covering updating Rails data using an inline table editor made with Vue
---

#### This tutorial assumes you have read the previous articles, starting from [here](/blog-posts/02-rails-with-vue-your-first-component.html). If you want to skip straight to this step, pick up a copy of the code you'll need from [this](https://github.com/ctrlaltdelete44/vue-test-app/tree/chp-2) repo

## 1. Adding a static table

### 1. Install `bootstrap-vue` package

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

### 2. Create the table

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

### 3. Attach the Vue to the View

  Now we can update the Javascript `films-list` mounter to render the table as well:

  ```js
  // app/javascript/packs/films-list.js

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

  ... add the relevant `div` for this to attach to into our view...

  ```html
  <!-- app/views/films/index.html.erb -->

  <div id='filmTable'></div>
  ```

  ... and update our webpack server:

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

Boom - we have our table. Now let's hook it up to our API.

Step one is clearing out the static data, so you should end up with something like this:

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

*N.B that around here the `films-list` component becomes really redundant. If you're checking against the [repository](https://github.com/ctrlaltdelete44/vue-test-app) and are concerned, I've just cleared out some of the older code from the first two chapters*

## 3. Updating the data

Currently we're three steps into this article and essentially all we've done is glorified the output from the last chapter. Let's get to *actually* updating Rails data.

### 1. Add form fields to your table

  This is done by specifying a template for the cells you want to edit - in this case the `title` and `year` of the movies.

  ```html
  <!-- app/javascript/films-table.vue -->

  <template>
    <div>
      <b-table striped hover
        :items='items'
        :fields='fields'
        >
        <!-- Add these templates to add text fields for title and description -->
        <template v-slot:cell(title)='row'>
          <b-form-input v-model='row.item.title'/>
        </template>

        <template v-slot:cell(description)='row'>
          <b-form-input v-model='row.item.description'/>
        </template>
      </b-table>
    </div>
  </template>
  ```

#### N.B - for additional input types, see the [documentation](https://bootstrap-vue.js.org/docs/components/form-input/)

#### N.B.2 - If you're working with a complex datamodel or one with variable fields you can use the following as a 'default' template - any fields you overwrite above it will be set to the overwritten template instead

  ```html
  <template v-slot:cell()='data'>
    <b-form-input v-model="data.value" />
  </template>
  ```

### 2. Create an api action to accept changes to the data

  There are a few things that need to happen here. Firstly we want to collect the film to be updated from the params:

  ```rb
  # app/controllers/films_controller.rb

  before_action :fetch_film, except: :index

  private

  def fetch_film
    @film = Film.find(params[:id])
  end
  ```

  ... and, as good practice, use strong parameters when we update this:

  ```rb
  private

  def film_params
    params.require(:film).permit(:id, :title, :description)
  end
  ```

  ... and, finally, add the actual `update` action. Your final controller should look like this:

  ```rb
  class FilmsController < ApplicationController
    before_action :fetch_film, except: :index

    def index
      # I added this order as a minor quality-of-life improvement for later :smiley:
      @films = Film.all.order(:id)
    end

    def update
      @film.update(film_params)
    end

    private

    def fetch_film
      @film = Film.find(params[:id])
    end

    def film_params
      params.require(:film).permit(:id, :title, :description)
    end
  end
  ```

### 3. Create the route

  ```rb
  # config/routes.rb

  resources :films, only: %i[index update] # -> formerly resources :films, only: :index
  ```

### 4. Create a method to send the updated data

  Due to Rails CSRF protection, we're going to hit issues updating data. As such we'll ned to extract the CSRF header from the document and allow Axios to use it. We're going to do this by creating a new document: `app/javascript/packs/csrf-token.js`.

  ```js
  function setCSRFToken(axios, document) {
    const csrfTokenQuery = document.querySelector("meta[name=csrf-token]")
    const csrfToken = csrfTokenQuery ? csrfTokenQuery.content : ''

    axios.defaults.headers.common['X-CSRF-Token'] = csrfToken
  }

  export { setCSRFToken }
  ```

  This function does exactly that - extracts the CSRF header and attaches it to our axios module. Now we just need to import and call it in our component:

  ```js
  <script>
    import axios from 'axios'
    import { setCSRFToken } from './packs/csrf-token.js'

    export default {
      data() { // Unchanged },
      created () {
        setCSRFToken(axios, document)

        // Unchanged...
      }
    }
  </script>
  ```

  The importance of creating it in a separate document and exporting it is that we can use this in any other Vue components - and indeed any other javascript at all - we may need.

  As well as the lifecycle hooks (such as `created`, which we have used already) Vue has an option for entirely custom methods:

  ```js
  <script>
    import axios from 'axios'

    export default {
      data() { // Unchanged }
      created () { // Unchanged }
      methods: {
        dataChanged(e) {
          // This is just a process of getting the selected film and then finding the new data in the table.
          // The put request, as before, is handled by Axios.
          let row = e.target.closest('tr')
          let film = this.items[row.rowIndex - 1]

          axios
            .put('/films/' + film.id,
            {
              film: {
                title: row.children[1].children[0]._value,
                description: row.children[2].children[0]._value
              }
            })
        },
      }
    }
  </script>
  ```

### 5. Bind the method to the native `onchange` event of the input fields

  Alongside their own method maps, Vue lets you access input field native methods. Any experience with javascript and you've probably encountered these before, but [W3Schools](https://www.w3schools.com/js/js_input_examples.asp) is a useful reference. We're going to be using one of these, specifically `onchange`, to trigger our method.

  ```html
  <!-- app/javascript/films-table.vue, on each of your template input fields -->

  <template v-slot:cell(title)='row'>
    <b-form-input v-model='row.item.title' v-on:change.native="dataChanged"/>
  </template>
  ```

  The moment of truth. Make some changes to your data, refresh your page and see the change in data persisted. You can check this in the console, in other Vue components, wherever - you've just built an inline editor for Rails data!

As usual, if you lost track at any point a version of the code, complete to this point, is available [here](https://github.com/ctrlaltdelete44/vue-test-app/tree/chp-3.0.1)
