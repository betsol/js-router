var should = require('should');
var expect = require('expect.js');
var RoutingService = require('../src/router.js');

function testRouteGeneration(routingService) {
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
    }).should.be.equal('/foo/spaces/bar');
}

suite('RoutingService', function() {

    var routingService = new RoutingService()
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
            path: '/foo/{ spaces }/bar'
        })
    ;

    suite('get()', function() {

        test('should return object', function() {
            routingService.get('home').should.be.an.instanceOf(Object);
        });

        test('should preserve data', function() {
            routingService.get('home').path.should.equal('/home');
        });

    });

    suite('getAll()', function() {
        var routes = routingService.getAll();
        var routeNames = Object.keys(routes);

        test('should return valid routes', function() {
            routes.should.be.an.Object;
            routeNames.length.should.be.equal(4);
            routeNames[0].should.be.equal('home');
            routeNames[1].should.be.equal('user');
            routeNames[2].should.be.equal('user.service');
            routeNames[3].should.be.equal('spaces');
        });
    });

    suite('generate()', function() {
        test('should generate valid URLs', function() {
            testRouteGeneration(routingService);
        });
    });

    suite('clear()', function() {
        test('should clear the routes', function() {
            routingService
                .clear()
                .getAll()
            .should.be.Object.and.empty;
        });
    });

    suite('placeholder patterns', function() {

        setup(function() {
            routingService
                .add('home', {
                    path: '/home'
                })
                .add('user', {
                    path: '/user/:userId'
                })
                .add('user.service', {
                    path: '/user/:userId/service/:serviceId'
                })
                .add('spaces', {
                    path: '/foo/: spaces /bar'
                })
            ;
        });

        test('should allow to set placeholder pattern', function() {
            var f = routingService.setPlaceholderPattern;
            expect(f).withArgs('Pattern without marker.').to.throwException();
            expect(f).withArgs('symfony').to.not.throwException();
            expect(f).withArgs('{%s}').to.not.throwException();
            expect(f).withArgs('angular').to.not.throwException();
        });

        test('should generate valid URLs', function() {
            testRouteGeneration(routingService);
        });

    });

});