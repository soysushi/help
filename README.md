# Project 2

Web Programming with Python and JavaScript

Personal Touches:

- Used bootstrap template to better understand Javascript and Document Object Model Manipulation

- Used websocket for loading messages which made using HTML5 history API more challenging; gave
the illusion of returning to the same directory by using socket emit and pushing the states
into document title and url. (reason for this features is because at this scale, websockets fire at
4000 times per second versus 10 for XMLHttpRequest). This also made me temper with Broadcast=False
for loading the messages that only shows for the client that requested it. Naturally Ajax request
will be client specific.
