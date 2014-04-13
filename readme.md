You can use this library to define routes and generate URLs in your JavaScript environment be it NodeJS or web browser.

This library is *CommonJS* and *AMD* compatible.

# Installation

Install it with bower: `bower install --save-dev js-router`

# Usage

## Instantiate a routing service

### NodeJS

    var RoutingService = require('router.js');
    var routingService = new RoutingService();

### Browser

In browser environment `RoutingService` is registered globally with your `window` object.

    <script type="text/javascript" src="router.js"></script>
    <script type="text/javascript">
        var routingService = new RoutingService();
    </script>

## Specify routes configuration

    routingService
        .addRoute('home', {
            path: '/home'
        })
        .addRoute('user', {
            path: '/user/{userId}'
        })
        .addRoute('user.service', {
            path: '/user/{userId}/service/{serviceId}'
        })
        .addRoute('spaces', {
            path: '/spaces/{ spaces }'
        })
    ;

## Generate some routes

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