FROM jekyll/jekyll

ADD . /srv/jekyll/site

WORKDIR /srv/jekyll/site

RUN jekyll build

RUN bundle install

CMD jekyll serve
