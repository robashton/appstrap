var fork = require('child_process').fork
  , http = require('http')
  , debug = process.env.DEBUG
  , path = require('path')

var System = function(path) {
  this.server = null
  this.path = path
  this.port = parseInt(Math.random() * 63000) + 1000 
  this.root_url = "http://localhost:" + this.port
}

System.prototype = {
  start: function(cb) {
    this.server = fork(path.join(process.cwd(), this.path), null, {
      silent: !debug,
      env: {
        PORT: this.port,
        test: true,
        debug: debug
      }
    })
    this.waitForReady(cb)
  },
  waitForReady: function(cb) {
    var system = this
    http.get({
      host: 'localhost',
      port: this.port,
      path: '/',
      method: 'GET'
    }, function(res) {
      if(res.statusCode != 200) {
        setTimeout(function() {
          system.waitForReady(cb)
        })
      }
      else {
        cb()
      }
    }).on('error', function() {
      system.waitForReady(cb)
    })
  },
  stop: function() {
    this.server.kill('SIGKILL')
  }
}

module.exports = System
