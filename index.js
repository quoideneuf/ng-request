// Adapted from: https://github.com/iriscouch/browser-request

(function() {

  var module = angular.module('ngRequest', []);

  module.factory('ngRequest', ['$http', function($http) {

    function request(options, callback) {

      if(!options)
        throw new Error('No options given')

      if(typeof callback != 'function' && callback.hasOwnProperty('form')) {
        options.form = callback.form;
        callback = arguments[2];
      }
        

      if(typeof callback !== 'function')
        throw new Error('Bad callback given: ' + callback)

      var options_onResponse = options.onResponse; // Save this for later.

      if(typeof options === 'string')
        options = {url: options, method: 'GET'};
      else
        options = JSON.parse(JSON.stringify(options)); // Use a duplicate for mutating.
      options.onResponse = options_onResponse // And put it back.

      if (options.verbose) request.log = getLogger();
      if(options.uri) {
        options.url = options.uri;
        delete options.uri;
      }

      if(!options.url || options.url === "")
        throw new Error("options.uri is a required argument");
      if(typeof options.url != "string")
        throw new Error("options.uri must be a string");
      var unsupported_options = ['proxy', '_redirectsFollowed', 'maxRedirects', 'followRedirect']
      for (var i = 0; i < unsupported_options.length; i++)
        if(options[ unsupported_options[i] ])
          throw new Error("options." + unsupported_options[i] + " is not supported")

      options.callback = callback;
      options.method = options.method || 'GET';
      options.headers = options.headers || {};
      options.body = options.body || null;
      options.timeout = options.timeout || 3600;
      

      if(options.json) {
        options.headers.accept = options.headers.accept || 'application/json'
        if(options.method !== 'GET')
          options.headers['content-type'] = 'application/json'
        if(typeof options.json !== 'boolean')
          options.body = JSON.stringify(options.json)
        else if(typeof options.body !== 'string')
          options.body = JSON.stringify(options.body)
      } else {
        // Disable Angular's deserialization
        options.transformResponse = function(data, headersGetter) {
          return data;
        };
      }

      if(options.body && options.form)
        throw new Error('request has payload and form data')

      // Post Data
      if(options.body){
        options.data = angular.fromJson(options.body);
      }

      //URL encoded forms
      if(options.form){
        options.headers['content-type'] = 'application/x-www-form-urlencoded';
        options.params = options.form
      }

      console.dir(options);

      $http(options).success(function(data, status, headers, config) {

        var statusObj = {
          status: status,
          statusCode: status
        };

        var err;
        options.callback(err, statusObj, data);
      }).error(function(data, status, headers, config) {
        var err = new Error(status);

        var statusObj = {
          status: status,
          statusCode: status
        };

        if (statusObj.statusCode) 
          err = undefined;

        options.callback(err, statusObj, data);
      });
    }


    var shortcuts = [ 'get', 'put', 'post', 'head' ];
    shortcuts.forEach(function(shortcut) {
      var method = shortcut.toUpperCase();
      var func = shortcut.toLowerCase();
      request[func] = function(opts) {
        if(typeof opts === 'string')
          opts = {'method':method, 'url':opts};
        else {
          opts = JSON.parse(JSON.stringify(opts));
          opts.method = method;
        }
        var args = [opts].concat(Array.prototype.slice.apply(arguments, [1]));
        return request.apply(this, args);
      }
    });


    function noop() {}

    function getLogger() {
      var logger = {}
      , levels = ['trace', 'debug', 'info', 'warn', 'error']
      , level, i

      for(i = 0; i < levels.length; i++) {
        level = levels[i]
        logger[level] = noop
        if(typeof console !== 'undefined' && console && console[level])
          logger[level] = formatted(console, level)
      }
      return logger
    }

    function formatted(obj, method) {
      return formatted_logger
      function formatted_logger(str, context) {
        if(typeof context === 'object')
          str += ' ' + JSON.stringify(context)
        return obj[method].call(obj, str)
      }
    }

    return request;
  }]);

})();
