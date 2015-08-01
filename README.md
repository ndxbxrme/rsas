# rsas [![Build Status](https://travis-ci.org/ndxbxrme/rsas.svg?branch=master)](https://travis-ci.org/ndxbxrme/rsas)
## A super-basic angular server

Can be used globally or required as a module

## Installing
*Stand alone*
```sh
npm install -g rsas
```
*As a module*
```sh
npm install --save rsas
```

## Usage
### Stand alone  
Simple
```sh
rsas
```
Fully loaded
```sh
rsas /my-angular-project --port=8080 --env=production
```
### As a module
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
    env: 'production'
});
```