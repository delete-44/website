---
layout: page
title: Posts
---
Posts:
{% for post in site.collections %}
    Collection: {{ post.label }}
{% endfor %}
