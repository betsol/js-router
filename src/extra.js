function generate()
{
    /** ... */

    // Adding extra parameters.
    var extraParameters = {};
    var addExtraParameters = false;
    for (var parameter in inputParameters) {
        if (-1 === route.parameters.indexOf(parameter)) {
            extraParameters[parameter] = inputParameters[parameter];
            addExtraParameters = true;
        }
    }
    if (addExtraParameters) {
        path = addParametersToUrl(path, extraParameters);
    }
}

/**
 * Adds query parameters to URL.
 * @param {string} url
 * @param {Object} parameters
 * @returns {string}
 */
function addParametersToUrl(url, parameters) {

    // 1. Handling existing parameters.

    var urlParts = explodeUrl(url);

    var initialParameters = parseQueryString(urlParts.query);

    parameters = mergeObjects(initialParameters, parameters);

    // 2. Generating result URL.

    var queryString = generateQueryString(parameters);

    // Adding base URL.
    var result = urlParts.baseUrl;

    // Adding query string.
    if (queryString) {
        result += '?' + queryString;
    }

    // Adding hash.
    if (urlParts.hash) {
        result += '#' + urlParts.hash;
    }

    return result;
}

/**
 * Returns merged objects.
 * @param {Object} object1
 * @param {Object} object2
 * @returns {Object}
 */
function mergeObjects(object1, object2) {
    var result = {};

    var key;
    for (key in object1) {
        if (object1.hasOwnProperty(key)) {
            result[key] = object1[key];
        }
    }
    for (key in object2) {
        if (object2.hasOwnProperty(key)) {
            result[key] = object2[key];
        }
    }

    return result;
}

/**
 * Parses query-string and returns list of parameters.
 * @param {string} queryString
 * @returns {Object}
 */
function parseQueryString(queryString) {
    var parameters = {};

    queryString = queryString.trim();
    if ('' === queryString) {
        return {};
    }

    var parts = queryString.split('&');
    for (var i in parts) {
        var part = parts[i].trim();

        if ('' === part) {
            continue;
        }

        var parts2 = part.split('=');

        var key = parts2[0].trim();
        if ('' === key) {
            continue;
        }

        var value = '';
        if (typeof (parts2[1]) != 'undefined') {
            value = parts2[1];
        }

        parameters[key] = value;
    }

    return parameters;
}

/**
 * Extracts different parts from URL.
 * @param {string} url
 * @returns {{baseUrl: string, query: string, hash: string}}
 */
function explodeUrl(url) {
    var hash = '';
    var queryString = '';
    var baseUrl = '';

    var parts = url.split('#', 2);
    url = parts[0];

    if (parts[1]) {
        hash = parts[1];
    }

    parts = url.split('?', 2);
    baseUrl = parts[0];

    if (parts[1]) {
        queryString = parts[1];
    }

    return {
        baseUrl: baseUrl,
        query: queryString,
        hash: hash
    };
}

/**
 * Generates query string from parameters.
 * @param {Object} parameters
 * @returns {string}
 */
function generateQueryString(parameters) {
    var parts = [];
    for (var key in parameters) {
        var value = castParameterToString(parameters[key]);
        if (value !== '') {
            parts.push(key + '=' + value);
        } else {
            parts.push(key);
        }
    }
    return parts.join('&');
}