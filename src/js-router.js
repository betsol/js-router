(function(root) {
    'use strict';

    function RoutingService()
    {
        var routes = {};

        var preDefinedPlaceholderPatterns = {
            symfony: '{%s}',
            angular: ':%s'
        };

        var placeholderPattern = preDefinedPlaceholderPatterns.symfony;

        /**
         * Returns route by it's name.
         * @param {string} routeName
         * @returns {Object|null}
         */
        function getRouteByName(routeName) {
            return (routes[routeName] ? routes[routeName] : null);
        }

        /**
         * Validates route definition.
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
         * Normalizes route definition.
         * @param {Object} route
         */
        function normalizeRoute(route) {
            route.parameters = extractParametersFromRoutePath(route.path);
        }

        /**
         * Extracts parameters from specified path based on placeholder pattern.
         * @param {string} path
         * @returns {Array.string|Array}
         */
        function extractParametersFromRoutePath(path) {
            var parameters = [];
            var regExp = getRegExpForPathParsing();
            // Find and no-replace trick to parse the string.
            path.replace(regExp, function() {
                parameters.push(arguments[1].trim());
            });
            return parameters;
        }

        /**
         * Represents parameter's value as a string to be used in URL.
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

        /**
         * Returns placeholder pattern with replacement.
         * @param {string} replacement
         * @returns {string}
         */
        function buildPlaceholderPattern(replacement) {
            // Adding optional spaces around parameter name.
            return placeholderPattern.replace('%s', '\\s*' + replacement + '\\s*');
        }

        /**
         * Generates RegExp for path parsing based on placeholder pattern.
         * @returns {RegExp}
         */
        function getRegExpForPathParsing() {
            var pattern = buildPlaceholderPattern('(.+?)') + '(/|$)';
            return new RegExp(pattern, 'g');
        }

        /**
         * Generates RegExp for specified parameter based on placeholder pattern.
         * @param {string} parameterName
         * @returns {RegExp}
         */
        function getRegExpForUrlGeneration(parameterName) {
            var pattern = buildPlaceholderPattern(parameterName);
            return new RegExp(pattern, 'g');
        }

        // Public interface.
        return {

            /**
             * Sets placeholder pattern.
             * @param {string} newValue
             */
            setPlaceholderPattern: function(newValue) {
                if (null === newValue.match(/%s/)) {
                    if ('undefined' != typeof preDefinedPlaceholderPatterns[newValue]) {
                        placeholderPattern = preDefinedPlaceholderPatterns[newValue];
                    } else {
                        throw new Error('Your placeholder pattern must contain a "%s" part or be one of pre-defined ones.');
                    }
                } else {
                    placeholderPattern = newValue;
                }
                // Maintaining chainability.
                return this;
            },

            /**
             * Clears all routes.
             */
            clear: function() {
                routes = {};
                // Maintaining chainability.
                return this;
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
            add: function(routeName, route) {
                validateRoute(route);
                normalizeRoute(route);
                routes[routeName] = route;
                // Maintaining chainability.
                return this;
            },

            /**
             * Returns route by it's ID.
             *
             * @param {string} routeName
             * @returns {Object|null}
             */
            get: function(routeName) {
                return getRouteByName(routeName);
            },

            /**
             * Returns all routes.
             *
             * @returns {Object}
             */
            getAll: function() {
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

                if (!route) {
                    throw new Error('Route with name: "' + routeName + '" is not registered with the routing service.');
                }

                if (route.parameters.length > 0 && typeof inputParameters == 'undefined') {
                    throw new ReferenceError('Missing input parameters.');
                }

                var path = route.path;

                // Iterating over route parameters
                // and replacing them with input values.
                for (var i in route.parameters) {
                    var parameterName = route.parameters[i];

                    if (typeof inputParameters[parameterName] == 'undefined') {
                        throw new ReferenceError('Missing input parameter: "' + parameterName + '" for route: "' + routeName + '".');
                    }

                    path = path.replace(
                        getRegExpForUrlGeneration(parameterName),
                        castParameterToString(inputParameters[parameterName])
                    );
                }

                return path;
            }
        };
    }

    var exported = false;

    // AngularJS.
    if ('undefined' !== typeof angular && angular.module) {
        angular.module('ngRoutingService', ['ng'])
            .service('routingService', RoutingService)
        ;
        exported = true;
    }

    // CommonJS.
    if ('undefined' !== typeof module && module.exports) {
        module.exports = RoutingService;
        exported = true;
    }

    // AMD.
    if ('undefined' !== typeof define && define.amd) {
        define([], RoutingService);
        exported = true;
    }

    // Falling back to global constructor.
    if (!exported) {
        root.RoutingService = RoutingService;
    }

})(this);