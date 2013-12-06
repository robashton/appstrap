This probably already exists in NPM somewhere, but I want this module for a cage match I'm going into


### Just a crappy little bootstrapper

Spawns a process, passes in the PORT environment variable and waits for the server to become ready so you can do end-to-end-tests on it

### Usage

var Appstrap = require('appstrap')
  , instance = new Appstrap('app.js')

  instance.start(function() {
    console.log("Server is listening, you can make http requests to", instance.root_path, "as the server is listening on port", instance.port)

    instance.stop()
  })


###

    Browser = require 'zombie'
    Appstrap = require 'appstrap'

    Scenario "Bootstrapping my application", ->
      app = null
      client = new Browser()

      Given "An express application", ->
        app = new Appstrap('app.js')

      When "Spawning it up", (done) ->
        app.start done

      Then "I can run some tests against it", (done) ->
        client.visit app.root_url, ->
          client.text('title').should.equal('hello world')
          done()

      after -> app.stop()
