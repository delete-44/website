---
layout: post
title: Software Development for Beginners
image: https://placekitten.com/1920/1920
date:  2019-10-19
---
### Content warning: this article covers serious basics - if you're at all familiar with GitHub & version control, you're going to get bored *very* quickly

At time of writing, I've just finished the second year of my CompSci degree and am taking a placement year in industry. Two years ago, I had absolutely no programming experience and I'm sure there are other people in a similar situation. Here's what I wish somebody had told me...

## 1. Make a GitHub profile, and put everything on there.
If your course is structured anything like mine, you might not encounter Git *at all* until second year. Given that it's such a fundamental part of this field, this is unacceptable. GitHub will become your public technical profile, a way to share your work with others and an access point like a portfolio you can show to employers.

### What is it?
GitHub is used for version control. Whenever you make a significant change to your code, you upload the change (called a 'commit'), and the project (stored in a 'repository') can be rebuilt any number of times using this commit history. For example, my personal [website](https://github.com/ctrlaltdelete44/website) has a repository, and you can see a detailed list of the commit history.

### Glossary of terms
 * **Version Control:** The process of uploading incremental changes to your work
 * **Repository:** The online location of your entire project
 * **Commit:** A change to your code. This is given a message and a unique identifier (a SHA code), which means you can see a clear history of your development and undo steps as needed
 * **Diff~~erence~~ Report:** A tool provided by GitHub that allows you to see a direct, line-by-line comparison of your commit with what's already on the repository

### What makes that useful?
 * You can access this code from any computer with an internet connection
 * Having a commit history means you can see clearly how your development progressed. But more importantly, you can undo commits as needed. *Bugs are going to happen.* They're unavoidable. But being able to see the difference report for your commits is invaluable in finding where the bug was introduced, and being able to undo commits as needed is invaluable in fixing them.
 * As mentioned briefly above, GitHub creates a diff report for your commits. This is useful for reviewing code - you can see exactly what changes have been made and raise comments if you think something looks wrong or could be improved. It's a process I've started using even when I'm working on my own, because it's useful to have that final look through what you're about to save
 * This is how things are actually done in industry - this might seem like an odd point, but getting used to it early encourages better programming practice. There's a high chance you'll be outright asked for your experience with version control in interviews, and being able to show a GitHub profile (even if it's just filled with small projects you've done for fun or for your course) will be a good reflection on you.

### Sounds great in theory! How do I actually use it?
#### Initialising a repository
Assuming you've got a GitHub account set up and project in mind, getting started with version control is simple.
1. Through the GitHub site, create a new repository. There will be an option to initialise the project with a `README.md`, which is good to check. That will create an empty Markdown document that will be displayed on the repositories page to share important information with people viewing it.
2. With this created, you'll be presented with a page like [this](), albeit much more empty. There will be a button in the corner, `Clone or Download`, and when you click it you'll be given a link:
`https://github.com/your-github-username/your-repository-name.git`
Get a copy of this!
3. You'll need to open up a command line - `cmd.exe` on Windows, or `Terminal` on Mac. This will by default open in your root drive (something like `C:/`) and you can use basic commands to navigate to where you want to store your repositories. I've put a Command cheatsheet below, feel free to refer to this

N.B here a $ denotes a command to type, do not include this in your terminal
```
$ mkdir documents/repositories
$ cd documents/repositories
```
4. ...clone a local copy of your repository..
```
$ git clone https://github.com/your-github-username/your-repository-name.git
```

5. ... and navigate into your repository
```
$ cd your-repository-name
```

That's the setup for local development sorted! You can do this from any machine and get a copy of your repository to use anywhere. You can create your project in this directory and start to fill in content. When you have something you want to upload - this can just be setting up the default project, for example - go to the next steps.

#### Making a commit
With your command line set up as before and already in the correct directory, you're good to make your first commit
1. Check what you're about to upload. Run the following command which will show you what files you're about to commit

N.B here a > denotes a response from the terminal
```
$ git status
   > On branch github-blog-post
   > Changes not staged for commit:
   >   (use "git add <file>..." to update what will be committed)
   >   (use "git checkout -- <file>..." to discard changes in working directory)

   > 	modified:   _layouts/post.html
   > 	modified:   collections/_blog-posts/01-github-for-beginners.md

   > no changes added to commit (use "git add" and/or "git commit -a")
```
This response is telling me that, at time of writing, I've modified two documents in my repository - both related to the blog post I'm writing at the moment.

2. Stage these changes for commit - this is where you select which changes to include in the commit
```
$ git add collections/_blog-posts/01-github-for-beginners.md
---
Alternatively, to add all changed files...
---
$ git add -A
```

3. Create a commit for these changes. Give this a message with the `-m` tag
---
$ git commit -m 'Added making a commit tutorial'
---

4. And push this to your repository:
---
$ git push
---
### CLI Cheatsheet

## 2. Make projects for fun!

## 3. Stay in the loop with technologies you're interested in(?)
## 4. Go to hackathons!
## 5. Use online tutorials
