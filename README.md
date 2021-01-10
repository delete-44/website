# Rainy Days Site

This is a personal site and blog. It can be found at [delete44.com](https://www.delete44.com)

## Running locally

To run locally, you must have Docker installed on your development machine. Firstly clone a copy of the repository:

```bash
$ git clone https://github.com/delete-44/website.git`
```

Next build the image:

```bash
$ docker-compose build
```

And, all being successful, run the server and navigate to your [localhost](localhost:4000) on port 4000 to see the site served with Jekyll

```bash
$ docker-compose up
```

## Development pipeline

A branch has been created for each feature to be developed. In order to merge with master the branch must be pull requested and reviewed, and Netlify will create a temporary staging server for the site
