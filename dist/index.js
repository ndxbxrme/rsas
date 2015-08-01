#!/usr/bin/env node
//'use strict';
(function() {
  var argv, chalk, compression, express, gzippo, http, morgan, path, rsas;

  express = require('express');

  compression = require('compression');

  gzippo = require('gzippo');

  morgan = require('morgan');

  http = require('http');

  path = require('path');

  chalk = require('chalk');

  argv = require('minimist')(process.argv.slice(2));

  rsas = function(args) {
    var app, dir, env, server;
    env = (args != null ? args.env : void 0) || argv.env || process.env.NODE_ENV || 'development';
    dir = ((args != null ? args.dir : void 0) || argv._[0] || process.cwd()).replace(/^[\/\\]/, '');
    if (!path.isAbsolute(dir)) {
      dir = path.join(process.cwd(), dir);
    }
    console.log(dir);
    app = express();
    app.set('port', (args != null ? args.port : void 0) || argv.port || process.env.PORT || 9000).use(compression()).use(morgan('dev'));
    if (env === 'development') {
      app.use('/', gzippo.staticGzip(dir + '/app'));
      app.use('/', gzippo.staticGzip(dir + '/client'));
      app.use('/', gzippo.staticGzip(dir + '/assets'));
      app.all('/*', function(req, res) {
        return res.sendFile('index.html', {
          root: dir + '/app'
        });
      });
    } else {
      app.use('/*', gzippo.staticGzip(dir));
      app.all('/*', function(req, res) {
        return res.sendFile('index.html', {
          root: dir
        });
      });
    }
    server = http.createServer(app);
    return server.listen(app.get('port'), function() {
      console.log('Server listening on port ' + chalk.yellow.bold(app.get('port')));
      return console.log('Hit Ctrl+C twice to stop');
    });
  };

  if (require.main === module) {
    rsas();
  }

  module.exports = {
    listen: function(args) {
      return rsas(args);
    },
    serve: function(args) {
      return rsas(args);
    }
  };

}).call(this);
