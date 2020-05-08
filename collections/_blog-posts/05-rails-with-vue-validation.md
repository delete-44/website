---
title: Validation
date: 2020-05-07
layout: post
image: https://placekitten.com/1920/1920
custom_excerpt: This is the fourth installment in a series, describing a way to implement validation for your vue tables.
---

#### This tutorial assumes you have read the previous articles, starting from [here](/blog-posts/02-rails-with-vue-your-first-component.html). If you want to skip straight to this step, pick up a copy of the code you'll need from [this](https://github.com/ctrlaltdelete44/vue-test-app/tree/chp-3.0.1) repo

### 1. Why I avoided Vuelidate

  If you've looked into validation on Vue components before, chances are you've encountered the [Vuelidate](https://vuelidate.js.org/) package - if you're trying to validate a Vue component on it's own, this is a fantastic all-in-one solution. However, I'm approaching this as a Ruby developer first and foremost, and I am much more comfortable using Ruby's in-built validations.
  
  If I add Vuelidate, I'd need to recreate these validations specifically for the component, and make sure to keep them updated whenever I changed the Ruby validations. So, in the interest of DRY code, I want to avoid any additional modules - I just want to apply my existing validations.

### 2. Adding validations

  This is of course a demo application, so our validations are going to be as straightforward as possible. If you are working with anything more complex then don't worry, by the end our Vue component will be rendering any error messages that would be displayed by your typical Rails application.

  With that in mind:

  ```rb
    # app/models/film.rb
    class Film < ApplicationRecord
      validates :title, length: { in: 2..20 }, presence: true
      validates :description, length: { in: 5..100 }, presence: true
    end
  ```

  If you're unfamiliar with Ruby validation, this simply requires that both fields be complete (`presence: true`) and defines upper and lower character limits for them both (`length: { in lower_bound..upper_bound }`). In a full application I'd take this opportunity to write a full test suite covering these validations, but for the sake of a demo application we can move past it. You can confirm that the validations work by running the following commands:

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

### 3. Handling erroneous data
