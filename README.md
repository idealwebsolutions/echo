# echo
Experimental Comment Engine (alternative to disqus) using firebase to host data

# Design idea
Each singular database is composed of an entire static site. There are two subtrees (so far).

1. Users
- Each subtree represents a user (which have a variety of options to sign in from).
2. Threads/Posts
- Each subtree is a flat representation of a URL. i.e a simple blog post - mysite.com/today-was-great
