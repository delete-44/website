---
title: Your First Component
date: 2020-03-02
layout: post
return_link: /blog-posts/02-rails-with-vue-index
image: https://placekitten.com/1920/1920
custom_excerpt: This is intended to be an introduction to the VueJS framework, running from the creation of a new Rails project through to creating your first Vue component
---

#### This article assumes you have a fundamental knowlege of Ruby on Rails, but will discuss the complete basics of Vue

### This is the first of a series of articles intended to be an introduction to the VueJS framework and it's integration with a Ruby on Rails backend

## 1. My favourite command - `rails new`

Sometimes, the best feeling in the world is starting a new, fast, and up-to-date project. That's why this article is going to start at the beginning and we're going to go through the classic steps of creating a new application and creating a Vue project from scratch.

#### *If you are already familiar with loading Vue components into Rails and want to explore their API potential, then you might be looking for the [next article](/blog-posts/03-rails-with-vue-accessing-rails-data.html) in this series*

1. Create your project

    ```bash
    $ cd your/directory
    $ rails new vue-test-app
    $ cd vue-test-app
    ```

2. Initialise your local git repo

    ```bash
    $ git init
    # For the sake of this demo, I did clean the app a little by removing files that will not be used

    $ git status
        > On branch master
        > No commits yet
        > Untracked files:
        > (use "git add <file>..." to include in what will be committed)
        > ... # File list
        > nothing added to commit but untracked files present (use "git add" to track)

    $ git add -A
    $ git commit -m 'Initial commit'
    ```

3. Initialise the remote git repository

    ```bash
    # 1. Navigate to github.com and sign in
    # 2. Create a repository with a name matching your app (ie vue-test-app) and no README
    # 3. Follow the commands under "…or push an existing repository from the command line":

    $ git remote add origin https://github.com/your-github-username/your-app-name.git
    $ git push -u origin master
    ```

4. And confirm that everything works as intended!

    ```bash
    $ rails db:create db:migrate
        >  Created database 'vue-test-app_development'
        >  Created database 'vue-test-app_test'

    $ rails s
    # Navigate to localhost:3000 to see the familiar welcome screen
    ```

## 2. Installing VueJS

We're going to use the `webpacker` gem to manage assets: visit [https://rubygems.org/gems/webpacker/versions/4.2.2](https://rubygems.org/gems/webpacker/versions/4.2.2 "https://rubygems.org/gems/webpacker/versions/4.2.2") and grab the latest version (at time of writing, 4.2.2) and add it to your Gemfile.

*While you're there, if you plan to follow this tutorial faithfully, remove the `turbolinks` gem. This will require an additional dependency to be installed in step 4, which is discussed in the default Vue documentation*

```bash
// Gemfile
...
# Build JSON APIs with ease. Read more: [https://github.com/rails/jbuilder](https://github.com/rails/jbuilder "https://github.com/rails/jbuilder")
gem 'jbuilder', '~> 2.5'
# Use webpack to manage app-like JavaScript modules in Rails
gem 'webpacker', '~> 4.2', '>= 4.2.2'
# Reduces boot times through caching; required in config/boot.rb
gem 'bootsnap', '>= 1.1.0', require: false
...
```

And then run

```bash
$ bundle install
$ rails webpacker:install
    > ...
    > Webpacker successfully installed 🎉 🍰
```

to initialise the gem.

Awesome! We can now use webpacker to install packages such as Vue.

```bash
$ rails webpacker:install:vue
    > ...
    > Webpacker now supports Vue.js 🎉

$ yarn install
    > yarn install v1.22.0
    > \[1/4\] 🔍  Resolving packages...
    > success
    > Already up-to-date.
    > ✨  Done in 0.35s.
```

vue-test-app now supports Vue.js 🎉:thumbsup:

## 3. A discussion of the Vue component structure

Vue's strength is in sectioning away `components`, completely isolated visual elements that you can test and build independently.

In your standard view folder, you'll be including a `javascript_pack_tag`. This links to the `[javascript]` element, which will simply add an event handler to initialise a number of Vue components.

```bash
                             -> [ Vue Object ]
[ View ] -> [ Javascript ] -|
                             -> [ Vue Object ]

# By default, these are located at...
> app
  > views
    - View folders (.html.erb)
  > javascript
    - Vue objects (.vue)
    > packs
      - Javascripts (.js)
```

The Vue components themselves are entirely self-contained pieces of front-end work built with the following sections:

```html
<template>
    <!-- Layout rules go here -->
</template>

<script>
    // Methods and data go here
</script>

<style>
    /* Styling rules, scoped to this component only, go here */
</style>
```

There are caveats to these sections that make them different to base html/javascript/css that you might expect, but I'll give you an example to kick-start your understanding in the next steps

## 4. Your first component

Vue comes installed with a useful demo - see `javascript/app.vue` and `javascript/packs/hello_vue.js`. To make use of this demo, we're going to set up some basic rails...

```bash
$ rails g controller static_pages landing
    > create  app/controllers/static_pages_controller.rb
    >  route  get 'static_pages/landing'
    > invoke  erb
    > create    app/views/static_pages
    > create    app/views/static_pages/landing.html.erb
    ...
```

then you'll want to amend the following files to...

```ruby
# config/routes.rb

Rails.application.routes.draw do
  root to: 'static_pages#landing' # Add this line
  get 'static_pages/landing'
end
```

```html
<!-- to app/views/layouts/application.html.erb -->

<!DOCTYPE html>
<html>
  <head>
    <title>VueTestApp</title>
    <%= csrf_meta_tags %>
    <%= csp_meta_tag %>

    <%= javascript_pack_tag 'hello_vue' %> <%# Add this line %>
  </head>

  <body>
    <%= yield %>
  </body>
</html>
```

And now to run the server there's an extra step of complexity. In one tab you can run the default:

```bash
$ rails s
    > => Booting Puma
    > => Rails 5.2.4.1 application starting in development
    > => Run `rails server -h` for more startup options
    > Puma starting in single mode...
    > * Version 3.12.2 (ruby 2.6.3-p62), codename: Llamas in Pajamas
    > * Min threads: 5, max threads: 5
    > * Environment: development
    > * Listening on tcp://localhost:3000
    > Use Ctrl-C to stop

```

But we'll need to run a separate webpack instance to serve assets. So in a different tab:

```bash
$ bin/webpack
    > ...
$ bin/webpack-dev-server
    > ℹ ｢wds｣: Project is running at http://localhost:3035/
    > ℹ ｢wds｣: webpack output is served from /packs/
    > ℹ ｢wds｣: Content not from webpack is served from /Users/anthony/vue-test-app/public/packs
    > ℹ ｢wds｣: 404s will fallback to /index.html
    > ℹ ｢wdm｣: Hash: e12bca63bf16232241e2
    > Version: webpack 4.42.0
    > Time: 2301ms
    > Built at: 03/02/2020 20:05:01
```

... and now, like usual, navigate to [localhost:3000](localhost:3000). All being well, you should see a welcome message from Vue!

As a note on the Vue `reactive` model, update the welcome message at `javascript/app.vue:11` -> `message: "Hello Vue!"` to a message of your choice.
Save the document, and return to your browser - **without** refreshing the page. Notice how the message changed automatically?

### Now to make your own

The default is great to get to grips with Vue components, but you'll learn much better by writing your own (or following a blog post, sure). You'll need to add two files:

```bash
> app
  > javascript
    + navigation.vue
    > packs
      + navigation.js
```

And then fill these in as following:

```js
// app/javascript/packs/navigation.js

import Vue from 'vue'
import NavigationApp from '../navigation.vue'

document.addEventListener('DOMContentLoaded', () => {
    const app = new Vue({
        render: h => h(NavigationApp)
    }).$mount()

    document.body.insertBefore(app.$el, document.body.firstChild);
})
```

This adds an event listener to the page: When the page loads, render the given Vue component and insert it at the top of the DOM structure.
The `insertBefore` is standard javascript for injecting html elements, and any alternative methods are applicable - see [appendChild](https://developer.mozilla.org/en-US/docs/Web/API/Node/appendChild). In the next chapter it will also be discussed how to attach the component to a given HTML element using it's `el` attribute.

```html
<template>
  <!-- This is the html-esque code used to define the layout. Note the syntax difference in assigning variable attributes -->
  <div class='navigation-bar'>
    <a class='navigation-item' :href=link.path>
      {{link.text}}
    </a>
  </div>
</template>
```

```js
<script>
  export default {
    // This is data you can access in the template
    // It's a standard hash of data in key:value pairs
    data: function () {
      return {
        link: {
          path: '/',
          text: 'Home',
          id: 1
        }
      }
    }
  }
</script>
```

```css
<style scoped>
  /* This css applies *only* to this component */
  .navigation-bar {
    display: flex;
    justify-content: space-around;
    width: 100%;
    background-color: #198dbb;
    padding: 10px 0;
  }

  .navigation-item {
    font-family: Arial, Helvetica, sans-serif;
    color: white;
    line-height: 1.6;
  }
</style>
```

Return to your console and exit your webpack server (`ctrl + C`):

```bash
# Update with the new Vue components
$ bin/webpack
    > ...
    > [./node_modules/webpack/buildin/global.js] (webpack)/buildin/global.js 905 bytes {hello_vue} {navigation} [built]
    > + 12 hidden modules
# And restart the server
$ bin/webpack-dev-server
    > ...
    > ℹ ｢wdm｣: Compiled successfully.
```

... And finally, return to your `app/views/layouts/application.html.erb` and add the following:

```erb
<%= javascript_pack_tag 'hello_vue' %>
<%= javascript_pack_tag 'navigation' %> <%# Add this line %>
```

You will need to refresh your page this time after restarting the `webpack` server but, all being well, you should get a fairly useless navigation bar!

This is what I mean by the power of Vue being in it's completely isolated components: the navigation bar is fully created, styled, and configured without impacting anything else on the page. You could feasibly add other Vue components with the `.navigation-bar` and `.navigation-item` classes styled differently, and both would work *independently*.

Now that we've created our new Vue project in Rails, its time to take a look at APIs and how we can use these components to access your Rails data. Join me in the next article, [Accessing Rails Data](/blog-posts/03-rails-with-vue-accessing-rails-data)
