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
    > 40 gems installed
$ rails -v
    > Rails 6.0.1
```

And that's it! We're good to get started.

# 2. Creating a local app
# 3. Going Live
# 4. Next Steps
