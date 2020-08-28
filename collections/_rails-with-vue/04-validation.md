---
title: Validation
date: 2020-05-07
layout: post
return_link: /blog-posts/02-rails-with-vue-index
thumbnail: https://res.cloudinary.com/delete-44/image/upload/c_scale,w_300/v1597824076/Website/wrong-greta-pichetti_lsovmd.webp
image: https://res.cloudinary.com/delete-44/image/upload/c_scale,w_1920/v1597824076/Website/wrong-greta-pichetti_lsovmd.webp
image-owner: "@gretapichi"
image-link: https://unsplash.com/photos/6qpGLW5YmCI
image-alt: A picture of a blue door with a "No entry" sticker on it
custom_excerpt: This is the fourth installment in a series, describing a way to implement validation for your vue tables.
---

#### This tutorial assumes you have read the previous articles, starting from [here](/rails-with-vue/01-your-first-component.html). If you want to skip straight to this step, pick up a copy of the code you'll need from [this](https://github.com/delete-44/vue-test-app/tree/chp-3.0.1) repo

### 1. Why I avoided Vuelidate

  If you've looked into validation on Vue components before, chances are you've encountered the [Vuelidate](https://vuelidate.js.org/) package - if you're trying to validate a Vue component on it's own, this is a fantastic all-in-one solution. However, I'm approaching this as a Ruby developer first and foremost, and as such am much more comfortable using Ruby's in-built validations.

  If I add Vuelidate, I'd need to

  1. recreate these validations specifically for the component;
  2. make sure to keep them updated whenever I changed the Ruby validations.

  In the interest of DRY code, I want to avoid any additional modules - I just want to apply my existing validations.

### 2. Adding validations

  This is of course a demo application, so our validations are going to be as straightforward as possible. If you are working with anything more complex then don't worry, by the end our Vue component will be rendering any error messages that would be displayed in a typical Rails application. With that in mind...

  ```rb
  # app/models/film.rb

  class Film < ApplicationRecord
    validates :title, length: { in: 2..20 }, presence: true
    validates :description, length: { in: 5..100 }, presence: true
  end
  ```

  If you're unfamiliar with Ruby validation, this simply requires that both fields be complete (`presence: true`) and defines upper and lower character limits for them both (`length: { in lower_bound..upper_bound }`). In a full application I'd take this opportunity to write a full test suite covering these validations, but for the sake of a demo application we can move past it. As a sanity check, you can confirm that the validations work by running the following commands:

  ```bash
  $ bin/rails c
    > Loading development environment (Rails 5.2.4.1)
    $ film = Film.create
      >   (0.2ms)  BEGIN
      >   (0.1ms)  ROLLBACK
      > => #<Film id: nil, title: nil, description: nil, created_at: nil, updated_at: nil>
    $ film.errors.full_messages
      > => ["Title is too short (minimum is 2 characters)", "Title can't be blank", "Description is too short (minimum is 5 characters)", "Description can't be blank"]
    $ film = Film.create(title: '1', description: '1234')
      >   (0.2ms)  BEGIN
      >   (0.4ms)  ROLLBACK
      > => #<Film id: nil, title: "1", description: "1234", created_at: nil, updated_at: nil>
    $ film.errors.full_messages
      > ["Title is too short (minimum is 2 characters)", "Description is too short (minimum is 5 characters)"]
    $ film = Film.create(title: '123456789012345678901', description: 'A string long enough to hit the 100-character limit')
      >   (0.2ms)  BEGIN
      >   (0.4ms)  ROLLBACK
      > => #<Film id: nil, title: "123456789012345678901", description: "...", created_at: nil, updated_at: nil>
    $ film.errors.full_messages
      > ["Title is too long (maximum is 20 characters)", "Description is too long (maximum is 100 characters)"]
    $ film = Film.create(title: 'Reasonable Title', description: 'Reasonable Description')
      >   (0.2ms)  BEGIN
      >   Film Create (0.6ms)  INSERT INTO "films" ("title", "description", "created_at", "updated_at") VALUES ($1, $2, $3, $4) RETURNING "id"  [["title", "Reasonable Title"], ["description", "Reasonable Description"], ["created_at", "2020-05-08 12:23:47.784686"], ["updated_at", "2020-05-08 12:23:47.784686"]]
      >   (0.8ms)  COMMIT
      > => #<Film id: 12, title: "Reasonable Title", description: "Reasonable Description", created_at: "2020-05-08 12:23:47", updated_at: "2020-05-08 12:23:47">
  ```

  Now - save yourself some hassle and write a test suite so you don't need to go through this again.

### 3. Returning appropriate responses

  The next step is to update our controller action to handle requests with bad data.

  ```rb
  # app/controllers/films_controller.rb

  def update
    if @film.update(film_params)
      head :ok
    else
      render json: {
        error: @film.errors.full_messages.first
      }, status: :unprocessable_entity
    end
  end
  ```

  The `.update` method returns true or false based on whether the update was successful, so we're using that to set the response accordingly. We're only returning the first error message - at the very least, when the user corrects that one they can progress onto the others. Of course, you are more than welcome to adjust this response as appropriate for your application. Now if you go through and try updating your films with invalid data via the UI, you'll see none of the records save; check the console and you'll see something like the following:

  ```bash
    Error: Request failed with status code 422
  ```

  Which is good! The update action is failing and returning the `unprocessable_entity` head we set.

### 4. Processing erroneous data

  Now we are succesfully causing errors (the irony isn't lost on me, don't worry) we can appropriately convey that information to the user. Firstly, lets add some css to show the problematic entry:

  ```css
  /* app/javascript/films-table.vue */

  <style scoped>
    body { padding: 1rem; }
    .danger input { border-color: red !important; }
  </style>
  ```

  I **know** the `!important` tag is bad - but the CSS written here applies only to this component, and without it we cannot overwrite the bootstrap defaults.

  Next, add the class to the target row:

  ```js
  // app/javascript/films-table.vue

  <script>
    export default {
      data() { // Unchanged },
      created () { // Unchanged },
      methods: {
        dataChanged(e) {
          let row = e.target.closest('tr')
          // ...

          axios
            .put( // Unchanged )
            // Add this clause
            .catch(function(response) {
              row.classList.add('danger')
            })
        },
      }
    }
  </script>
  ```

  At this point you can fill in your table with broken data and see the cells highlight.

  Now there are two major issues for us to handle; firstly, when you fix the errors the `danger` highlight stays. Axios gives us a convenient hook to fix this:

  ```js
  // app/javascript/films-table.vue

  <script>
    export default {
      data() { // Unchanged },
      created () { // Unchanged },
      methods: {
        dataChanged(e) {
          // ...

          axios
            .put( // Unchanged )
            // Add this clause
            .then(function(response) {
              row.classList.remove('danger')
            })
            .catch( // Unchanged )
        },
      }
    }
  </script>
  ```

  Or: when the response returns successfully, remove the `danger` class from the target row. You should now be able to add and remove the warning border by entering different data states.

  The second issue is that we've gone to all the effort to return the warning message, but haven't actually shown that to the user. For the sake of brevity, I'm going to show you how to retrieve the message and then simply alert it. Feel free to show it however you can:

  ```js
  // app/javascript/films-table.vue

  <script>
    export default {
      data() { // Unchanged },
      created () { // Unchanged },
      methods: {
        dataChanged(e) {
          // ...

          axios
            .put( // Unchanged )
            .then(function(response) (// Unchanged)
            .catch( function(response) {
              row.classList.add('danger')

              let message = response.response.data.error
              alert(message)
            })
        },
      }
    }
  </script>
  ```

  Now go mess with your data - you'll see the errors displaying as appropriate, and the erroneous cells highlighted.

As usual, if you lost track at any point you can pick up a complete version of the code covered here from [this](https://github.com/delete-44/vue-test-app/tree/chp-4) code repo.
