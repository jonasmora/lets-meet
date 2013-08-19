Let's Meet
==========

Let's Meet is a simple application I built to learn the MEAN stack (Mongo, Express, AngularJS and node.js). It allows users to easily share their position on a map and set up a meeting place.

Mongoose is used to interface with a Mongodb database.

Steps to get this working
-------------------------

The usual...

    npm install -d

Set up mongodb if you don't got it so that Mongoose can use it. I like using homebrew:

    brew install mongodb

And start-up a mongod service in terminal:

    mongod

To start the server, just run:

    node app

Navigate your browser to http://localhost:3000/ to see the app up and running.

Pull requests more than welcome! Enjoy!
