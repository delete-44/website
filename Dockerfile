FROM jekyll/jekyll

ADD . /srv/jekyll/site

WORKDIR /srv/jekyll/site

RUN bundle install

CMD jekyll serve -l
