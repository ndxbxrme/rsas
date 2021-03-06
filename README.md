# rsas [![Build Status](https://travis-ci.org/ndxbxrme/rsas.svg?branch=master)](https://travis-ci.org/ndxbxrme/rsas)
## A super-basic angular server

Can be used globally or required as a module

### Installing
*Stand alone*
```sh
npm install -g rsas
```
*As a module*
```sh
npm install --save rsas
```

### Usage
#### Stand alone  
Simple
```sh
rsas
```
Fully loaded
```sh
rsas /my-angular-project --port=8080 --env=production --proxy-url=www.google.com --proxy-route=/proxy
```
#### As a module
Quarter-pounder
```js
var rsas = require('rsas');
rsas.listen();
```
With cheese
```js
var rsas = require('rsas');
rsas.listen({
    dir: '/my-angular-project',
    port: 8080,
    env: 'production',
    'proxy-url': 'www.google.com',
    'proxy-route': '/proxy'
});
```

### Options

#### port
Type: `Number`  
Default value: `9000`

The port to listen on.

#### dir
Type: `String`  
Default value: `current working directory`

The directory to serve.

#### env
Type: `String`  
Default value: `development`

The current development environment `development/production`.

#### proxy-url
Type: `String`  
Default value: `undefined`

The url for the proxy to forward to.

#### proxy-route
Type: `String`  
Default value: `/api`

The server route to forward to the proxy.
