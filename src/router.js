(function(root) {
    'use strict';

    function RoutingService()
    {
        var routes = {};

        /**
         * @param {string} routeName
         * @returns {Object|null}
         */
        function getRouteByName(routeName) {
            return (routes[routeName] ? routes[routeName] : null);
        }

        /**
         * @param {Object} route
         */
        function validateRoute(route) {
            if (typeof route != 'object') {
                throw new TypeError('Route must be an object.');
            }

            if (typeof route.path == 'undefined') {
                throw new ReferenceError('Path is required for route.');
            }
        }

        /**
         * @param {Object} route
         */
        function normalizeRoute(route) {
            route.parameters = extractParametersFromRoutePath(route.path);
        }

        /**
         * @param {string} path
         * @returns {Array.string}
         */
        function extractParametersFromRoutePath(path) {
            var pathParsingRegExp = /\{(.+?)\}/g;
            var parameters = [];
            path.replace(pathParsingRegExp, function() {
                parameters.push(arguments[1].trim());
            });
            return parameters;
        }

        /**
         * @param parameter
         * @returns {string}
         */
        function castParameterToString(parameter) {
            switch (typeof parameter) {
                case 'boolean':
                    return (parameter ? '1' : '0');
                default:
                    if (parameter === null) {
                        return '';
                    } else {
                        var result = (new String(parameter)).trim();
                        if (result !== '') {
                            result = encodeURIComponent(result);
                        }
                        return result;
                    }
            }
        }

        // Public interface.
        return {
            /**
             * Clears all routes.
             */
            clearRoutes: function() {
                routes = {};
            },

            /**
             * Adds route.
             * This method supports chaining.
             *
             * @example:
             * router
             *     ->addRoute('my-route')
             *     ->addRoute('my-second-route')
             * ;
             *
             * @param {string} routeName
             * @param {Object} route
             * @returns {Object}
             */
            addRoute: function(routeName, route) {
                validateRoute(route);
                normalizeRoute(route);
                routes[routeName] = route;
                return this;
            },

            /**
             * Returns route by it's ID.
             *
             * @param {string} routeName
             * @returns {Object|null}
             */
            getRoute: function(routeName) {
                return getRouteByName(routeName);
            },

            /**
             * Returns all routes.
             *
             * @returns {Object}
             */
            getRoutes: function() {
                return routes;
            },

            /**
             * Returns URL for a route specified by it's ID.
             *
             * @param {string} routeName
             * @param {Object} inputParameters
             * @returns {string}
             */
            generate: function(routeName, inputParameters) {

                var route = getRouteByName(routeName);

                if (route.parameters.length > 0 && typeof inputParameters == 'undefined') {
                    throw new ReferenceError('Missing input parameters.');
                }

                var path = route.path;

                // Iterating over route parameters
                // and replacing them with input values.
                for (var i in route.parameters) {

                    var parameter = route.parameters[i];

                    if (typeof inputParameters[parameter] == 'undefined') {
                        throw new ReferenceError('Missing input parameter: "' + parameter + '" for route: "' + routeName + '".');
                    }

                    path = path.replace(
                        new RegExp('{\\s*' + parameter + '\\s*}', 'g'),
                        castParameterToString(inputParameters[parameter])
                    );
                }

                return path;
            }
        };
    }

    if (module && module.exports) {
        // CommonJS.
        module.exports = RoutingService;
    } else if (define && define.amd) {
        // AMD.
        define([], RoutingService);
    } else  {
        // Falling back to global constructor.
        root.RoutingService = RoutingService;
    }

})(this);