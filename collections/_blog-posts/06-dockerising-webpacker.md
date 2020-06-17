---
title: Dockerizing Webpacker
date: 2020-06-10
layout: post
image: https://placekitten.com/1920/1920
custom_excerpt: Create a dockerised Rails app with webpack-dev-server
---

### This article will create a starter Rails application (running Ruby 2.6.5), dockerise it, and teach you how to run the `webpack-dev-server` (key for developing with JS frameworks such as React or Vue) in Docker

#### For the sake of brevity I'm not going to cover installing Docker or Rails. If you are looking for guides to cover these, I can recommend the [Docker](https://docs.docker.com/get-docker/) and [Rails](https://guides.rubyonrails.org/v5.0/getting_started.html) official documentation

#### I could not have written this post without the [Rails on Docker]() book, to the extent that several lines I use are taken from here and adapted for purpose (with consent, and marked when used). If you're new to Docker I can't recommend it enough.

### 1. Getting started

We're going to need an application to dockerise. I'm sure you're familiar with this process, but we're going to take it up a level. Following the [Rails on Docker]() guidelines, we're going to complete this entirely in Docker.

```bash
  docker run --rm -it -v ${PWD}:/usr/src -w /usr/src ruby:2.7 sh -c 'gem install rails:"~> 6.0.3" && rails new --skip-test webpacker-on-docker-demo'
```

A breakdown:

- `--rm`: Remove the container once we've completed the task
- `-it`: Allows our terminal to connect to the running instance - all I know here is it gives us proper syntax highlighting :P
- `-v`: Attaches a specific volume to the running container. This allows persistent data, so you get too keep your app even the the container is disposed
- `${PWD}:/us/src`:
- `-w`:
- `ruby:2.7`:
- `sh -c`:
- `gem install rails:"~> 6.0.3"`
- `rails new --skip-test applet`

Let that run through to create our base application. If you're used to older versions of Rails then this might take longer than you'd expect. No worries, it's because webpacker is now included by default, so creating a new project will also install yarn and webpacker. I'm also skipping tests - I want to keep this lightweight, but also would always advise using [RSpec](https://rspec.info/) instead.

<!-- To make sure everything has worked as intended, boot up your server.

```bash
  $ cd dockerising-webpacker-demo
  $ rails s
    > => Booting Puma
    > ...
```

And navigate to [localhost:3000](localhost:3000) to see the classic screen. -->

### 2. Dockerising the base application

We need to add two files to the root directory of our application:

  1. A `Dockerfile` to define our Docker image
  2. A `docker-compose.yml` to organise our containers, including our webpack one

Lets start with our Dockerfile - this is, if you're unfamiliar, a file created in the root directory of your app (alongside your Gemfile and .gitignore) with that exact name: `Dockerfile`.

```rb
  # Dockerfile
  FROM ruby:2.6

  # Install nodejs
  RUN apt-get update -qq && apt-get install -y nodejs

  ADD . /usr/src/app
  WORKDIR /usr/src/app

  # Install & run bundler
  RUN gem install bundler:'~> 2.1.4'

  RUN bundle

  CMD rails server -b 0.0.0.0
```

This is code adapted from Chris Blunt's [Rails on Docker](https://www.plymouthsoftware.com/courses), which proivdes an extensive introduction to Docker and the concept of containerisation.

With it, you should be able to build your application:

```bash
  $ docker build -t dockerising-webpacker-demo .
    > Step 1/7 : FROM ruby:2.6
    > ...
    > Successfully built 2b600f10c089
    > Successfully tagged dockerising-webpacker-demo:latest
```

Next, our `docker-compose` file. This is a `yml` document that organises and names our services to make them easier to manage.

```yml

```

With this written, we can run a command in a disposable container to setup our local environment.

```bash
  $ docker-compose up -d db
    >
  $ docker-compose run --rm web rails db:setup
```
