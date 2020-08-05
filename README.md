# Rainy Days Site

This is a site built in [Jekyll](https://jekyllrb.com/) and containerised with [Docker](https://docker.com). It is hosted on [Netlify](https://www.netlify.com) with a temporary URL of https://unruffled-minsky-f3b245.netlify.com/. It is intended to be a portfolio and blog.

## Running locally

To run locally, you must have Docker installed on your development machine. Firstly clone a copy of the repository:
`$git clone https://github.com/ctrlaltdelete44/website.git`

Next build the image:
`$docker-compose build`

And, all being successful, run the server and navigate to your [localhost](localhost:4000) on port 4000 to see the site served with Jekyll
`$docker-compose up`

## Development pipeline

A branch has been created for each feature to be developed. In order to merge with master the branch must be pull requested and reviewed, and Netlify will create a temporary staging server for the site
