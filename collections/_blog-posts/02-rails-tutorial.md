---
layout: post
title: Ruby on Rails Basics
image: https://placekitten.com/1920/1920
date:  2019-11-20
---
This is the start in what is intended to be a series of tutorials covering the development of a Rails app - from a fresh installation to a web app with an API built on it so you can expand it however you want. I'm planning to structure this with each subsequent chapter being a pull request, *but that is inevitably due to change as I progress more*. This first one is going to cover the absolute **basics** of setup, starting with installation - but by the end of the chapter you'll have a default starting app **live**!

# 1. Initial Installation
*It is important to note that for this stage I am installing on Windows. Please consult the linked guides for information on installation for other operating systems - see you at step #2*

The official [tutorials]() are a very useful reference point here. However, they recommend the use of `RailsInstaller`, which will bundle a number of useful tools (such as Sqlite & Git) into one install - this is very useful, but the latest version supports Ruby 2.3.3, and at time of writing the latest stable Ruby release is 2.6.5. For the purposes of this guide I'm going to run through the steps needed alongside writing to keep it as comprehensive as possible.

1. Head to [Ruby Installer](https://rubyinstaller.org/downloads/). This is a convenient installer that will simultaneously install a number of dependencies detailed on the same page - for now you'll just need to grab the `Ruby+Devkit 2.6.5-1` link.

2. Head through the installer (screenshot one). Make sure you install the MSYS2 devkit on the next page. Ruby versions greater than 2.4 use this. (screenshot two) ... and on the final page mage sure you check the `run 'ridk install'...` checkbox. This will open a terminal window with a number of options and some snazzy ASCII work: (screenshot three)

3. Initialise MSYS2 - this really is as easy as pressing `1` and hitting enter. Let your terminal run and, providing it succeeds, you'll be sent to a screen with...

*Here `>` denotes a response from the terminal...*
```bash
    > MSYS2 seems to be properly installed
```
You're now safe to close this terminal window (and in fact, this is required to complete the MSYS installation)

1. You're now clear to open a new terminal (either `CMD.exe` or `Powershell`). We need to confirm your installation with the following commands:

*... and `$` denotes a command to type*
```bash
$ ruby -v       # This is the shorthand tag for $ ruby --version
    > ruby 2.6.5p114 (2019-10-01 revision 67812) [x64-mingw32]
$ irb           # This will take you to the ruby console - you'll see a lot more of him in later chapters
    $ puts 'Hello world'
    > Hello world
    > nil
```

5. Use `ctrl+d` to exit out of the ruby terminal, and we're going to move onto installing Rails.

```bash
$ gem install rails
    > ... # Here you'll see a lot of temrinal output where a number of gems are fetched & installed
    > 41 gems installed
$ rails -v
    > Rails 6.0.1
```

And that's it! We're good to get started.

# 2. Creating a local app
The first step, which is both encouraged for version control but required for #4, is to create a GitHub repository for your project.
*New to GitHub? Don't know what I'm talking about? Try reading [this](01-github-for-beginners)!*

Create a new repository; #4 requires it to be public, and you don't need to worry about initialising the repo with a README. Just grab the link and clone it to your local machine:

```bash
$ cd path/to/repository
$ git clone https://github.com/github-username/project-name.git
    > Cloning into 'project-name'...
    > warning: You appear to have cloned an empty repository
```

And we're going to use the `rails new` command to create the base project.
```bash
$ rails new project-name --skip-bootsnap --skip-javascript
    > ... # Another long list of output as it creates the file structure
    > Bundle complete! 13 Gemfile dependencies, 68 gems now installed
```
*NB. Here I'm passing the `--skip-bootsnap` option to the command. This is because this gem doesn't play well with Heroku, which we'll be using later in the chapter. The `--skip-javascript` option is because the new rails default for handling Javascript assets is Webpacker, which requires Node.js to be installed. It has been omitted in the interest of keeping this install light. You can run `rails new --help` or the shorthand `rails new -h` for a discussion of other options you can use here*

To test that this works, return to your terminal and run:
```bash
$ cd project-name
$ rails s   # This is shorthand for `rails server` :)
    > => Booting Puma
    > => Rails 6.0.1 application starting in development
    > => Run 'rails server --help' for more startup options
```

Open a browser of your choice, cross your fingers for luck, and navigate to `localhost:3000`. You should be greeted with the "Yay! You're on Rails!" starting screen. If so, it's time to get more familar with your program...

# 3. The Ruby Directory Structure
For someone unfamilar with Ruby, the file structure can be confusing. I'm going to cover the basics here, but I fully recommend reading [this wonderful blog](https://www.sitepoint.com/a-quick-study-of-the-ruby-directory-structure) that discusses it in more depth.

*Here `>` denotes a folder, and `*` a file*
```
# This is by no means a full list, and your generated directory will be a lot more full than this.
# Consult the link above for further discussion

> app
    > assets
        > stylesheets
            * application.css
    > controllers
        > concerns
    > helpers
    > jobs
    > models
        > concerns
    > views
        > layouts
            * application.html.rb
> config
    * routes.rb
> db
    > migrate
    * seeds.rb
> test
* Gemfile
* Gemfile.lock
```

## app/assets
This is where you'll keep any assets for your program frontend - this includes css & javascript documents. The document `application.css` is required for the **asset pipeline** - this is how Rails compiles and serves assets. In this document you can reference any other stylesheets you create

## app/controllers
MVC dictates that the Models & Views of your application should be kept separate, with Controllers handling user requests and responding by rendering the appropriate view. To that end, controllers in Rails have a set of actions - for example `show` or `index`. In these controller actions you can dictate what view is to be shown, and what information the view should have.

Additionally here you have `concerns`. These are importable modules that allow the reuse of code across several controllers. The same folder & system exists for models

## app/helpers
These are modules you can import into views that promote the reuse of code. There will be a default `application_helper.rb` that will be available in all views, but additional helpers will be created for specific controllers

## app/jobs
These are a component of the `ActiveJobs` gem. These can be used to run expensive or slow tasks on a background worker as opposed to on the main web server

## app/models
This is where the logic of your program will reside. Convention is to have skinny controllers and fat methods - that is, keep your controllers limited to request handling, and keep as much logic in the models as possible.

That being said, model methods should be context-free. They should not need to know about the logged-in user, and should be able to be operated from controllers, background workers, or the terminal without issues.

## app/views
Your actual HTML output will be stored here. These are the views that your controllers will render. The `application.html.rb` includes the `<head></head>` tags you'd expect, and every other view derives from this as per the `<%= yield %>` tag - we'll explain **that** later.

## config/routes
This can be a confusing system to understand, but incredibly useful. This will map HTTP requests to controller actions, and will then generate a number of helper methods to let you access these controller actions throughout your codebase.

For example, if you have a route declared as `get '/characters/:id', to: 'characters#show'` your application will recieve the `GET characters/1` HTTP request and navigate to the `characters` controller, looking for the `show` action. The parameters will include `id: '1'` as per the request.

## db/migrate
Rails handles database creation a little differently to how I've seen it before (take this with a pinch of salt, I don't have a whole lot of past experience). Instead of writing a table in SQL and subsequently building relationships, in Rails you write incremental `migrations`. These are used to make minor adjustments to the database schema, with the idea that running through the migrations in order will fully regenerate the schema.

Example migrations could be creating a table, or adding a column to an existing one.

## db/seeds
This can be useful for development purposes - you can dictate a set of sample information that can be injected into your database so you have access to test data.

## test
I mention this document purely to mention that convention prefers Test Driven Development. The Rails default is a gem called `minitest`, which creates this file, but as part of this guide we'll be switching over to use a gem called `rspec` instead.

With either, test files are created for most pages you generate, including for models and controllers. You should write tests for the expected output of a method or action, which will then flag if you ever make a breaking change.

## Gemfile & Gemfile.lock
I've mentioned 'Gems' a lot in this first chapter alone. Gems can be installed to your project and offer functionality. For example, `rspec` provides an alternative test suite to the default. The [Ruby Toolbox](https://www.ruby-toolbox.com/) is a very useful service for finding Gems as it includes statistics on usage & upkeep. 

# 4. Going Live
For hosting this app we're going to use [Heroku](). This is a PaaS hosting platform that works well with Ruby on Rails applications, and has some very useful GitHub interactions.

**However**, it's important to state that some Rails defaults do not work with Heroku - particularly SQLite3, a storage gem. Heroku has some information on *why* [here](https://devcenter.heroku.com/articles/sqlite3).
So your first task is going to be to go into your `Gemfile` - a folder in your projects root directory - and remove the `sqlite3` gem.

```ruby
...
gem 'rails', '~> 6.0.1'
# Use sqlite3 as the database for Active Record
gem 'sqlite3', '~1.4' # Remove THIS line!
...
```

Then return to your terminal and run the following:
```bash
$ bundle install
$ rails s
```

The first step here is to commit your initial project creation. If you're happy you can get it running locally and access the 'Welcome to Ruby' screen, push it up to your repo.

*Don't know how? Give [this](01-github-for-beginners) a read*

Next, go to Heroku and create an account. I won't walk you through this, it's fairly standard. But you should reach a point where you can `Create a new app`. At which point you should see a screen something like this...

Screenshot
*NB. You can leave the name blank to get a randomly-generated one*

A very powerful feature of Heroku that we're going to be taking advantage of is the automatic deployment process. For this we're going to need to connect the app to GitHub, and then to the specific repository you created for this app - hence needing it to be public.

Screenshot

Connect your branch, and then enable automatic deployments from the `master` branch.

Screenshot

Finally, make the initial manual deployment and navigate to the `Overview` tab. You should see a message along the lines of `Build in progress`, with a link to view the build logs. You can follow this link and compare the logs to those that generated when you created the project - the output is from the `bundle install` command that runs in both processes.

Assuming the project build successfully, your logs should end up looking like this:


# 5. Next Steps
