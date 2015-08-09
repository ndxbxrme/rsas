express = require 'express'
proxy = require 'express-http-proxy'
compression = require 'compression'
gzippo = require 'gzippo'
morgan = require 'morgan'
http = require 'http'
path = require 'path'
findFileSync = require 'find-file-sync'
chalk = require 'chalk'
argv = require('minimist') process.argv.slice(2)

rsas = (args) ->
  env = args?.env or argv.env or process.env.NODE_ENV or 'development'
  dir = (args?.dir or argv._[0] or process.cwd()).replace(/^[\/\\]/,'')
  proxyUrl = args?['proxy-url'] or argv['proxy-url']
  proxyRoute = (args?['proxy-route'] or argv['proxy-route'] or 'api').replace(/^[\/\\]/,'')
  externalDir = args?['external-dir'] or argv['external-dir']
  userAgent = args?['user-agent'] or argv['user-agent']
  safeDepth = 0
  
  if not path.isAbsolute dir
    dir = path.join process.cwd(), dir
  if dir isnt process.cwd() and dir[0] is process.cwd()[0]
    safeDepth = dir.split(path.sep).length - process.cwd().split(path.sep).length
  
  app = express()
  app.set 'port', args?.port or argv.port or process.env.PORT or 9000
  .use compression()
  .use morgan(if env is 'development' then 'dev' else 'tiny')
  
  index = findFileSync dir, 'index.html', ['node_modules', '.git', 'bower_components']
  
  if userAgent
    app.use '/', (req, res, next) ->
      if req.headers['user-agent'] isnt userAgent
        return res.status(500).send 'Not found'
      else
        return next()
      
  
  if proxyUrl
    app.use '/' + proxyRoute, proxy(proxyUrl,
      forwardPath: (req, res) ->
        return require('url').parse(req.url).path
    )

  if env is 'development'
    app.use '/', gzippo.staticGzip path.dirname(index)
    app.use '/', gzippo.staticGzip dir
    app.use '/', gzippo.staticGzip path.join(dir, 'app')
    app.use '/', gzippo.staticGzip path.join(dir, 'client')
    app.use '/', gzippo.staticGzip path.join(dir, 'assets')
    app.use '/', gzippo.staticGzip path.join(dir, '.tmp')
    if safeDepth > 0
      app.use '/', gzippo.staticGzip path.join(dir, '..')
    if safeDepth > 1
      app.use '/', gzippo.staticGzip path.join(dir, '../..')
    if externalDir
      app.use '/', gzippo.staticGzip path.join(dir, externalDir)
    app.all '/*', (req, res) ->
      res.sendFile index
  else
    app.use '/', gzippo.staticGzip path.dirname(index)
    app.use '/', gzippo.staticGzip dir
    app.all '/*', (req, res) ->
      res.sendFile index

  server = http.createServer app

  server.listen app.get('port'), ->
    console.log 'Server listening on port ' + chalk.yellow.bold(app.get 'port') 
    console.log 'Hit Ctrl+C twice to stop'
    
if require.main is module
  rsas()

module.exports =
  listen: (args) ->
    rsas args
  serve: (args) ->
    rsas args