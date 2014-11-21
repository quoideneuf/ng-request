Angular $http as request
=================================

Angular service that wraps $http to look like [request](https://github.com/request/request). Covers basic GET and POST requests but not all request's options are supported.

Adapted from: https://github.com/iriscouch/browser-request


## Usage

Add index.js to your project.

```javascript
angular.module('myModule').controller('myController', function(ngRequest) {

  ngRequest.get('http://example.com', function(err, response, body) {
    console.log(body);
  });
});
```

