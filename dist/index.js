#!/usr/bin/env node
//'use strict';
(function() {
  var argv, chalk, compression, express, gzippo, http, morgan, path, proxy, rsas;

  express = require('express');

  proxy = require('express-http-proxy');

  compression = require('compression');

  gzippo = require('gzippo');

  morgan = require('morgan');

  http = require('http');

  path = require('path');

  chalk = require('chalk');

  argv = require('minimist')(process.argv.slice(2));

  rsas = function(args) {
    var app, dir, env, proxyRoute, proxyUrl, server;
    env = (args != null ? args.env : void 0) || argv.env || process.env.NODE_ENV || 'development';
    dir = ((args != null ? args.dir : void 0) || argv._[0] || process.cwd()).replace(/^[\/\\]/, '');
    proxyUrl = (args != null ? args['proxy-url'] : void 0) || argv['proxy-url'];
    proxyRoute = ((args != null ? args['proxy-route'] : void 0) || argv['proxy-route'] || 'api').replace(/^[\/\\]/, '');
    if (!path.isAbsolute(dir)) {
      dir = path.join(process.cwd(), dir);
    }
    app = express();
    app.set('port', (args != null ? args.port : void 0) || argv.port || process.env.PORT || 9000).use(compression()).use(morgan('dev'));
    if (proxyUrl) {
      app.use('/' + proxyRoute, proxy(proxyUrl, {
        forwardPath: function(req, res) {
          return require('url').parse(req.url).path;
        }
      }));
    }
    if (env === 'development') {
      app.use('/', gzippo.staticGzip(dir + '/'));
      app.use('/', gzippo.staticGzip(dir + '/app'));
      app.use('/', gzippo.staticGzip(dir + '/client'));
      app.use('/', gzippo.staticGzip(dir + '/assets'));
      app.use('/', gzippo.staticGzip(dir + '/..'));
      app.use('/', gzippo.staticGzip(dir + '/../..'));
      app.all('/*', function(req, res) {
        return res.sendFile('index.html', {
          root: dir
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
