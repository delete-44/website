---
title: Accessing Rails Data
date: 2020-03-03
layout: post
return_link: /blog-posts/02-rails-with-vue-index
image: https://placekitten.com/1920/1920
custom_excerpt: This is intended to be a guide to accessing your Rails data in Vue components. It works independently of the first article, but if you're new to Vue it's recommended you start there
---

#### This tutorial assumes you have read the first article, found [here](/rails-with-vue/01-your-first-component.html). If you want to skip straight to this step, pick up a copy of the code you'll need from [this](https://github.com/delete-44/vue-test-app/tree/chp-1) repo

## 1. Adding a rails model

Vue components are fantastic on their own, but they really shine when we can pass data from our Rails backend into them. I'm going to explain how to achieve this, but first we need some data to use.

*This part very briefly covers the creation of a model, an index page, and seeds for your database so that we have mock data to work with*

```bash
# Create the model with a title and a description
$ rails g model film title:string description:text
    > invoke  active_record
    > create    db/migrate/20200303090850_create_films.rb
    > create    app/models/film.rb
    > ...

# Create a controller with just an index action
$ rails g controller films index  
    > create  app/controllers/films_controller.rb
    >  route  get 'films/index'
    > invoke  erb
    > create    app/views/films
    > create    app/views/films/index.html.erb
    > ...

# And run the newly created migrations
$ rails db:migrate
    > == 20200303090850 CreateFilms: migrating ======================================
    > -- create_table(:films)
    > -> 0.0485s
    > == 20200303090850 CreateFilms: migrated (0.0485s) =============================
```

```ruby
# config/routes.rb

# For the sake of future expansion, we will update this to be a resource:
resources :films, only: :index # -> Formerly get 'films/index'
```

Your codebase should be looking a lot more fleshed out. Navigate to [localhost:3000/films](localhost:3000/films) to see the new page.

### Cleanup

To make this a touch nicer to use, we need to make a few changes.

1. Move your `<%= javascript_pack_tag 'hello_vue' %>` from `application.html.erb` to `landing.html.erb`

    *(You can use this opportunity to clear out the default text as well)*

    ```html
    <!-- app/views/layouts/application.html.erb -->

    <!DOCTYPE html>
    <html>
    <head>
        <title>VueTestApp</title>
        <%= csrf_meta_tags %>
        <%= csp_meta_tag %>

        <%= javascript_pack_tag 'navigation' %>
    </head>

    <body>
        <%= yield %>
    </body>
    </html>
    ```

    ```erb
    <%# app/views/static_pages/landing.html.erb %>
    <%= javascript_pack_tag 'hello_vue' %>
    ```

2. Add seed films

    ```ruby
    # db/seeds.rb

    (0..9).each do |i|
      Film.create(title: "Film-#{i}", description: "This is film #{i}")
    end
    ```

    ```bash
    $ rails db:seed
    ```

3. Add a second link to your navigation component

    *(You **could** achieve this by adding a second element to your template, and expanding the data... I'm going to take it a step further*)

    ```js
    // app/javascript/navigation.vue

    <script>
    export default {
      data: function () {
        return {
          links: {
            home: {
                path: '/',
                text: 'Home',
                id: 1
            },
            films: {
                path: '/films',
                text: 'Films',
                id: 2
            }
          }
        }
      }
    }
    </script>
    ```

    Here I've updated our data object to be a collection of `links` as opposed to separate ones. This is so we can iterate over them and create a link for each one, meaning that in order to expand these in the future we just need to add an entry to the data.

    I've also added an `id` field to each. This is for the vue loop, which needs a key for each item in the loop. While you *can* just use the entire item, it is recommended for efficiency to use a unique id.

    ```html
    <template>
      <div class='navigation-bar'>
        <a v-for="link in links" :key="link.id" class='navigation-item' :href=link.path>
          {{link.text}}
        </a>
      </div>
    </template>
    ```

    This is the syntax for the Vue `for loop`. It has been instantiated *within* the <a></a> tags as this is the element you want to create for every item.
    As mentioned above you can see the `key` has been assigned to the link id, and as per usual the syntax has been updated for variable attributes.

    Save your changes and visit your page **without refreshing** - you should see your navigation bar has become slightly more useful!

## 6. A Rails API

To access your seed data in your frontend, we're going to add an API view to your rails app. If you haven't created a rails API before, let me assure you now that it is astoundigly easy.

1. Retrieve the data

    In your `films_controller` `#index` action, get a list of the available films.

    ```ruby
    # app/controllers/films_controller.rb

    def index
      @films = Film.all
    end
    ```

2. Add a `json` response using `jbuilder`

    ```ruby
    # CREATE app/views/films/index.json.jbuilder
    json.array! @films, :id, :title, :description
    ```

3. That's it. Really.

    Navigate to [localhost:3000/films.json](localhost:3000/films.json) if you don't believe me

## 7. Accessing your data

At this stage we have:

  1. Data in our Rails backend
  2. An API to access this data
  3. The knowledge required to make Vue components, including iterating over a dataset

Now we put them all together!

1. Creating the base `Vue` component

    Create a new component as following:

    ```bash
    > app
      > javascript
        + films-list.vue
    ```

    ```html
    <!-- app/javascript/films-list.vue -->

    <template>
      <ul class='films'>
        <li v-for="film in films" :key="film.id" class='film-item'>
          {{film.title}}: {{film.description}}
        </li>
      </ul>
    </template>
    ```

    ```css
    <style scoped>
    ul { padding-left: 0; }

    li {
      list-style: none;
      text-align: center;
    }
    </style>
    ```

    For the script, we're going to need to access the api. To that end, we're going to use a node module called [axios](https://github.com/axios/axios).

    ```bash
    $ yarn add axios
        > ...
        > success Saved 2 new dependencies.
        > info Direct dependencies
        > └─ axios@0.19.2
        > info All dependencies
        > ├─ axios@0.19.2
        > └─ follow-redirects@1.5.10
        > ✨  Done in 3.61s.
    ```

    This lets us make API calls from within our Vue components, like so:

    ```js
    <script>
      import axios from 'axios'

      export default {
        data () {
            return {
            films: []
            }
        },
        created () {
            axios
            .get('/films.json')
            .then(response => (this.films = response.data))
        }
      }
    </script>
    ```

    This might need some explaining...

    We've created our usual data structure. By default we're using an empty array for `films` so that the for loop will just skip.

    `created ()` is a lifecycle hook in Vue. It's similar to the Rails `before_save` and `before_action` callbacks. More information is available [here](https://vuejs.org/v2/guide/instance.html#Instance-Lifecycle-Hooks), but this istance says that once the element has been created run the axios request.

    The axios request itself sends a `GET` request to `localhost:3000/films.json` - much like you do when you visit this page in browser. As such you can confirm that this returns a json object in the format:

    ```json
    "films": {
      "0": {
        "id": "1",
        "title": "Film-0",
        "description": "This is film 0"
      }
    }
    ```

    And *this* json structure is what we're assigning to our Vue data.

2. Creating the js middleman to add the Vue component

    ```bash
    > app
      > javascript
        > packs
          + films-list.js
    ```

    ```js
    // app/javascript/packs/films-list.js

    import Vue from 'vue'
    import List from '../films-list.vue'

    document.addEventListener('DOMContentLoaded', () => {
      new Vue({
        el: '#filmList',
        render: h => h(List),
      });
    });
    ```

    This is slightly different to the ones we've seen before - we aren't adding it at a relative point (ie we're not injecting it at the top of the html body). Instead we're telling it to look for a **el**ement with the id `filmList` that it will attach to.

3. Update webpacker...

    As before, exit your `webpack-dev-server` with `ctrl + C`.

    ```bash
    # Update with the new Vue components
    $ bin/webpack
        > [./app/javascript/packs/application.js] 802 bytes {application} [built]
        > [./app/javascript/packs/films-list.js] 224 bytes {films-list} [built]
        > [./app/javascript/packs/hello_vue.js] 347 bytes {hello_vue} [built]
        > [./app/javascript/packs/navigation.js] 305 bytes {navigation} [built]
        >     + 47 hidden modules

    # And restart the server
    $ bin/webpack-dev-server
        > ...
        > ℹ ｢wdm｣: Compiled successfully.
    ```

4. Import your Vue component, and give it an element to attach to

    ```erb
    <%# app/views/films/index.html.erb %>
    <%= javascript_pack_tag 'films-list' %>
    <div id='filmList'></div>
    ```

    All being well, refresh your [localhost:3000/films](localhost:3000/films) and see your rails data!
