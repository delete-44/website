---
title: Dockerising Webpacker
date: 2020-06-10
layout: post
image: https://placekitten.com/1920/1920
custom_excerpt: Create a dockerised Rails app with webpack-dev-server
---

#### This article will create a starter Rails application (running Ruby 2.6.5), dockerise it, and teach you how to run the `webpack-dev-server` (key for developing with JS frameworks such as React or Vue) in Docker. If you have a pre-existing & already Dockerised app then skip to [Dockerising Webpacker](#dockerising-webpacker)

#### For the sake of brevity I'm not going to cover installing Docker or Rails. If you are looking for guides to cover these, I can recommend the [Docker](https://docs.docker.com/get-docker/) and [Rails](https://guides.rubyonrails.org/v5.0/getting_started.html) official documentation

#### I could not have written this post without the [Rails on Docker](https://www.plymouthsoftware.com/courses) book, to the extent that several lines I use are taken from here and adapted for purpose (with consent, and marked when used). If you're new to Docker I can't recommend it enough. Get started with a [free course](https://railsondocker.com/) by the same author

### 1. Getting started

We're going to need an application to dockerise. I'm sure you're familiar with this process, but we're going to take it up a level. Following the [Rails on Docker](https://www.plymouthsoftware.com/courses) guidelines, we're going to complete this entirely in Docker.

```bash
$ docker run --rm -it -v ${PWD}:/usr/src -w /usr/src ruby:2.7 sh -c 'gem install rails:"~> 6.0.3" && rails new --skip-test webpacker-on-docker-demo'
  > ...
  > Successfully installed rails-6.0.3.2
  > 40 gems installed
  > ...
  > Bundle complete! 14 Gemfile dependencies, 65 gems now installed.
  > rails webpacker:install
  > Node.js not installed. Please download and install Node.js https://nodejs.org/en/download/
```

If you're curious about the command above, here's a quick breakdown:

* `--rm`: Remove the container once we've completed the task
* `-it`: Allows our terminal to connect to the running instance - all I know here is it gives us proper syntax highlighting :P
* `-v`: Attaches a specific volume to the running container. This allows persistent data, so you get too keep your app even the the container is disposed
* `${PWD}:/usr/src`: The directory of the volume to mount into the container. `${PWD}` is used to represent the current directory
* `-w`: The working directory for the container - for this example this needs to be where the code is mounted so we can create the project
* `ruby:2.7`: The name of the [Docker image]() we want to use. These exist for different Ruby versions if you want to change this
* `sh -c gem install rails:"~> 6.0.3" rails new --skip-test applet` - The command to run in our container. In this case we are installing rails (at a locked version to ensure the tutorial works when later versions are released) and creating the base app, commands very typical in Ruby development

We'll get all the way to installing webpacker, and then hit an error. No worries, but to install Node and correctly install webpacker we're going to formalise our environment.

Now - there are a few more steps involved with setting up a modern rails app (ie installing webpacker) to run before we can get started. To start this process easier we're going to put together a `Dockerfile` and `docker-compose.yml`.

### 2. Dockerising the base application

We need to add two files to the root directory of our application:

  1. A `Dockerfile` to define our Docker image
  2. A `docker-compose.yml` to organise our containers, including our webpack one

Lets start with our Dockerfile - this is, if you're unfamiliar, a file created in the root directory of your app (alongside your Gemfile and .gitignore) with that exact name: `Dockerfile`. It dictates how to build our app's image.

```rb
# Dockerfile

FROM ruby:2.7

# Install nodejs
RUN apt-get update -qq && apt-get install -y nodejs

# Add Yarn repository
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list

# Update
RUN apt-get update -y

# Install Yarn
RUN apt-get install yarn -y

ADD . /usr/src/app
WORKDIR /usr/src/app

# Install & run bundler
RUN gem install bundler:'~> 2.1.4'

RUN bundle

CMD rails server -b 0.0.0.0
```

#### This is code adapted from Chris Blunt's [Rails on Docker](https://www.plymouthsoftware.com/courses), which provides an extensive introduction to Docker and the concept of containerisation

With it, you should be able to build your application:

```bash
$ docker build -t dockerising-webpacker-demo .
  > Step 1/11 : FROM ruby:2.7
  > ...
  > Successfully built xxxxxxxxxx
  > Successfully tagged dockerising-webpacker-demo:latest
```

Next, our `docker-compose` file. This is a `yml` document that organises and names our services to make them easier to manage.

```yml
# docker-compose.yml

version: '3.2'

volumes:
  dbdata:
    driver: local

services:
  db:
    image: postgres:11
    environment:
      - PGDATA=/var/lib/postgresql/data/pgdata
      - POSTGRES_USER=rails
      - POSTGRES_PASSWORD=secret123
    volumes:
      - dbdata:/var/lib/postgresql/data/pgdata

  web:
    build: .
    ports:
      - '3000:3000'
    environment:
      - RAILS_ENV=development
      - RACK_ENV=development
      - POSTGRES_USER=rails
      - POSTGRES_PASSWORD=secret123
    volumes:
      - .:/usr/src/app
    depends_on:
      - db
```

### Installing Webpacker

With this written, we can run a command in a disposable container to install webpacker!

```bash
$ docker-compose build
  > ...
  > Successfully tagged webpacker-on-docker-demo_web:latest
$ docker-compose run --rm web bundle exec rake webpacker:install
  > Starting webpacker-on-docker-demo_db_1 ... done
  > create  config/webpacker.yml
  > ...
  > Webpacker successfully installed 🎉 🍰
```

... And finally to check that everything has worked as intended:

```bash
$ docker-compose up -d db
$ docker-compose up web
  > web_1  | => Booting Puma
  > ...
  > web_1  | Use Ctrl-C to stop
```

And navigate to [localhost:3000](localhost:3000) to finally, finally hit that classic welcome screen.

To give us something to use, I'm going to scaffold something very briefly:

```bash
$ docker-compose run --rm web bin/rails g scaffold user name:string
  > ...
  > invoke  scss
  > create    app/assets/stylesheets/scaffolds.scss

$ docker-compose run --rm web bin/rails db:migrate
  > == 20200619160457 CreateUsers: migrating ======================================
  > -- create_table(:users)
  >    -> 0.0077s
  > == 20200619160457 CreateUsers: migrated (0.0082s) =============================
```

```rb
# config/routes.rb

Rails.application.routes.draw do
  root to: 'users#index'
  resources :users
end
```

### Dockerising Webpacker

If you've used webpacker (and it's `webpack-dev-server`) before, you'll know it runs on [localhost:3035](localhost:3035). Feel free to visit that now to see that it definitely is *not* running.

We're going to need to define a new service in our `docker-compose` file to run it. For clarity's sake, let's call it webpack:

```yml
# docker-compose.yml

webpack:
  build: .
  command: ./bin/webpack-dev-server
  volumes:
    - .:/usr/src/app
  ports:
    - '3035:3035'
  environment:
    NODE_ENV: development
    RAILS_ENV: development
    WEBPACKER_DEV_SERVER_HOST: 0.0.0.0
```

This will get the server running, but won't allow hot reloading... We can't have that. Additionally, if you've needed to restart your server for any reason you might be running into an error regarding leftover `server.pid` files. You can resolve this by manually deleting the temporary files, but I'm going to add a useful `docker-entrypoint` file to automatically resolve this.

```yml
# docker-compose.yml

services:
  web:
    ports: # Unchanged
    environment:
      # ...
      WEBPACKER_DEV_SERVER_HOST: webpack
    depends_on:
      # ...
      - webpack
    volumes: # Unchanged
```

```rb
# Dockerfile

... # Unchanged up to `CMD` line
CMD ./docker-entrypoint.sh
```

```sh
# docker-entrypoint.sh

#!/bin/sh

rm -f tmp/pids/server.pid
bin/rails server -b 0.0.0.0
```

And that should be all you need!

For the first run we're going to use `docker-compose up web webpack` to inspect the output from both containers. But, in the future, you can get away with `docker-compose up web` and the `webpack` service will run automatically :grin: You should get an output something like this...

```bash
$ docker-compose up web webpack
  > webpacker-on-docker-demo_db_1 is up-to-date
  > Starting webpacker-on-docker-demo_webpack_1 ... done
  > Starting webpacker-on-docker-demo_web_1     ... done
  > Attaching to webpacker-on-docker-demo_web_1, webpacker-on-docker-demo_webpack_1
  > web_1      | => Booting Puma
  > web_1      | => Rails 6.0.3.2 application starting in development
  > web_1      | => Run `rails server --help` for more startup options
  > webpack_1  | ℹ ｢wds｣: Project is running at http://localhost:3035/
  > webpack_1  | ℹ ｢wds｣: webpack output is served from /packs/
  > webpack_1  | ℹ ｢wds｣: Content not from webpack is served from /usr/src/app/public/packs
  > webpack_1  | ℹ ｢wds｣: 404s will fallback to /index.html
  > webpack_1  | ℹ ｢wdm｣: Hash: 4030c4049dd2c45d5d92
  > webpack_1  | Version: webpack 4.43.0
  > webpack_1  | Time: 5902ms
  > webpack_1  | Built at: 06/19/2020 3:45:00 PM
  > webpack_1  |                                      Asset       Size       Chunks                         Chunk Names
  > webpack_1  |     js/application-7ebe8ea7d1fee93ab92a.js    506 KiB  application  [emitted] [immutable]  application
  > webpack_1  | js/application-7ebe8ea7d1fee93ab92a.js.map    570 KiB  application  [emitted] [dev]        application
  > webpack_1  |                              manifest.json  364 bytes               [emitted]
  > webpack_1  | ℹ ｢wdm｣: Compiled successfully.
  > web_1      | Puma starting in single mode...
  > web_1      | * Version 4.3.5 (ruby 2.7.1-p83), codename: Mysterious Traveller
  > web_1      | * Min threads: 5, max threads: 5
  > web_1      | * Environment: development
  > web_1      | * Listening on tcp://0.0.0.0:3000
  > web_1      | Use Ctrl-C to stop
```

### N.B Alternatively, you can use `docker-compose up -d web` (which will launch web in a detached state and webpack due to the `depends_on`), and then call `docker-compose logs -f web webpack` to see the output for any selected services

Items of note here:

* Because you have both containers running in the same terminal, the output from each container is marked by their `web_1      |` and `webpack_1  |` tags
* Using this, you can see that the `web` service *starts* to build, then waits for the `webpack` server to compile successfully before hosting the server

To test that the webpack server is running successfully, you can check a few things.

1. Navigate to [localhost:3035](localhost:3035). If you get an `Unable to connect` error, something is wrong. If you get a white page with `Cannot GET /` then, even though it looks like a disaster, your server is running successfully. This is because everything that should usually run through [localhost:3035](localhost:3035) is routed to [localhost:3000](localhost:3000) for us to work with instead.
2. More importantly, test the **actual** reason we're here. Go to your `app/javascript/packs/application.js` and add a line - say, `console.log('Hello from webpacker!')`. Save the file, **don't** refresh your page, and it should update automatically.

From here, everything under the `app/javascript/` directory will trigger a hot reload when its contents change!

Now, to put your newfound dockerised app to the test, try adding Vue components. Maybe something a little like [this](https://delete44.com/blog-posts/02-rails-with-vue-your-first-component.html)...
