You can use this library to define routes and generate URLs in your JavaScript environment be it NodeJS or web browser.

This library is *AngularJS*, *CommonJS* and *AMD* compatible.

# Installation

## Using bower

`bower install --save-dev betsol-js-router`

# Usage

## 1. Instantiate a routing service

### NodeJS

``` javascript
var RoutingService = require('js-router.js');
var routingService = new RoutingService();
```

### Browser

In browser environment `RoutingService` is registered globally with your `window` object.

``` html
<script type="text/javascript" src="router.js"></script>
<script type="text/javascript">
    var routingService = new RoutingService();
</script>
```

### AngularJS

``` javascript
angular.module('myModule', ['ng', 'ngRoutingService'])
    .controller('AppCtrl', function(routingService) {
        // Use "routingService" instance.
    })
;
```

## 2. Specify routes configuration

``` javascript
routingService
    .add('home', {
        path: '/home'
    })
    .add('user', {
        path: '/user/{userId}'
    })
    .add('user.service', {
        path: '/user/{userId}/service/{serviceId}'
    })
    .add('spaces', {
        path: '/spaces/{ spaces }'
    })
;
```

## 3. Generate some routes

``` javascript
// '/home' => '/home'
routingService.generate('home');

// '/user/{userId}' => '/user/117'
routingService.generate('user', {
    userId: 117
});

// '/user/{userId}' => '/user/1'
routingService.generate('user', {
    userId: true
});

// '/user/{userId}' => '/user/0'
routingService.generate('user', {
    userId: false
});

// '/user/{userId}' => '/user/'
routingService.generate('user', {
    userId: null
});

// '/user/{userId}/service/{serviceId}' => '/user/117/service/33'
routingService.generate('user.service', {
    userId: 117,
    serviceId: 33
});

// '/spaces/{ spaces }' => '/spaces/spaces'
routingService.generate('spaces', {
    spaces: 'spaces'
});
```

# Configuration

## Placeholder format

It's possible to use different placeholder formats for your routes definitions.

Consider this paths:

- /foo/:fooId/bar/:barId/baz
- /foo/{fooId}/bar/{barId}/baz

First path is using [AngularJS style placeholders][angular-routing], i.e. `:placeholder`
and the second one is using [Symfony style placeholders][symfony-routing]: `{placeholder}`.

Routing service needs to now what placeholder format you are going to use in order to
correctly parse paths and generate URLs. You can specify format by using public method
`setPlaceholderPattern`.

**Example:**

``` javascript
var routingService = new RoutingService()
    .setPlaceholderPattern('symfony')
    .add('foo-bar-baz', {
        path: '/foo/{fooId}/bar/{barId}/baz'
    })
;

var url = routingService.generate('foo-bar-baz', {
    fooId: 100,
    barId: 500
});

// url == "/foo/100/bar/500/baz"
```

The are two built-in placeholder formats:

- "angular" (AngularJS or Ruby on Rails style)
- "symfony" (Symfony framework style)

It's also possible to specify arbitrary placeholder format by providing part of
regular expression used both for parsing paths and generating URLs.

**Example:**

``` javascript
var routingService = new RoutingService()
    .setPlaceholderPattern('(%s)') // Django-style placeholder.
    .add('foo-bar-baz', {
        path: '/foo/(fooId)/bar/(barId)/baz'
    })
;
```

`%s` will be replaced with placeholder name during pattern matching.

# Changelog

[Changelog is here][changelog].

# License

The MIT License (MIT)

Copyright (c) 2014 Slava Fomin II

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

[angular-routing]: http://docs.angularjs.org/api/ngRoute/provider/$routeProvider
[symfony-routing]: http://symfony.com/doc/current/book/routing.html
[changelog]: https://github.com/betsol/js-router/blob/master/changelog.md