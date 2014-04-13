var should = require('should');
var RoutingService = require('../src/router.js');

describe('RoutingService', function() {

    var routingService = new RoutingService()
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

    describe('getRoute()', function() {

        it('should return object', function() {
            routingService.getRoute('home').should.be.an.instanceOf(Object);
        });

        it('should preserve data', function() {
            routingService.getRoute('home').path.should.equal('/home');
        });

    });

    describe('getRoutes()', function() {

        var routes = routingService.getRoutes();
        var routeNames = Object.keys(routes);

        it('should return valid routes', function() {
            routes.should.be.an.instanceOf(Object);
            routeNames.length.should.be.equal(4);
            routeNames[0].should.be.equal('home');
            routeNames[1].should.be.equal('user');
            routeNames[2].should.be.equal('user.service');
            routeNames[3].should.be.equal('spaces');
        });
    });

    describe('generate()', function() {
        it('should generate valid URLs', function() {
            routingService.generate('home').should.be.equal('/home');

            routingService.generate('user', {
                userId: 117
            }).should.be.equal('/user/117');

            routingService.generate('user', {
                userId: true
            }).should.be.equal('/user/1');

            routingService.generate('user', {
                userId: false
            }).should.be.equal('/user/0');

            routingService.generate('user', {
                userId: null
            }).should.be.equal('/user/');

            routingService.generate('user.service', {
                userId: 117,
                serviceId: 33
            }).should.be.equal('/user/117/service/33');

            routingService.generate('spaces', {
                spaces: 'spaces'
            }).should.be.equal('/spaces/spaces');
        });
    });

});