---
layout: page
title: Posts
---
Posts:
{% for collection in site.collections %}
    Post: {{ collection.label }}, count: {{ collection.docs.size }}
    {% for post in collection.docs %}
        {{ post.name }} - {{ post.output }}
    {% endfor %}
{% endfor %}
