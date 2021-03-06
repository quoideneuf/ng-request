describe('ngRequest', function() {

  var ngRequest, $httpBackend;

  beforeEach(angular.mock.module('ngRequest'));

  beforeEach(inject(function($injector) {
    $httpBackend = $injector.get('$httpBackend');

    ngRequest = $injector.get('ngRequest');


    $httpBackend.whenGET('/foo').respond(JSON.stringify({foo: true}));
    $httpBackend.whenGET('/foo?bar=wtf').respond(JSON.stringify({foo: true, bar: true}));

  }));

 afterEach(function() {
   $httpBackend.verifyNoOutstandingExpectation();
   $httpBackend.verifyNoOutstandingRequest();
 });


  describe('GET requests', function() {
    it('should implement method GET', function() {
      ngRequest({
        uri: '/foo',
        method: 'GET',
      }, function(err, response, body) {
        expect(response.statusCode).toEqual(200);
        expect(body).toEqual(JSON.stringify({foo: true}));
      });

      $httpBackend.expectGET('/foo');
      $httpBackend.flush();

    });


    it('should implement GET with parameters', function() {
      ngRequest({
        uri: '/foo?bar=wtf',
      }, function(err, response, body) {
        expect(response.statusCode).toEqual(200);
        expect(body).toEqual(JSON.stringify({foo: true, bar: true}));
      });

      $httpBackend.expectGET('/foo?bar=wtf');
      $httpBackend.flush();

    });

    it('should implement request.get shortcut', function() {
      ngRequest.get('/foo', function(err, response, body) {
        expect(response.statusCode).toEqual(200);
        expect(body).toEqual(JSON.stringify({foo: true}));
      });

      $httpBackend.expectGET('/foo');
      $httpBackend.flush();
    });
      
  }); // /GET


  describe('POST requests', function() {
    it('should implement method POST', function() {
      var bar = {
        name: 'sycamore',
        bartender: 'marco'
      };
      ngRequest.post({
        url: '/bars', 
        json: bar
      }, function(err, response, body) {
        expect(response.statusCode).toEqual(201);
        expect(body.uri).toEqual('/bars/1');
      });

      $httpBackend.expectPOST('/bars', bar).respond(201, JSON.stringify({uri: '/bars/1'}));
      $httpBackend.flush();      
    });

    it('should not return an error as long as it gets a statusCode', function() {
      var data = {}
      ngRequest.post({
        url: '/fail',
        json: data
      }, function(err, response, body) {
        expect(typeof(err)).toEqual('undefined');
        expect(response.statusCode).toEqual(412);
      });

      $httpBackend.expectPOST('/fail', data).respond(412, JSON.stringify({code: "SESSION GONE"}));
      $httpBackend.flush();
    });

  });


  describe('Url-encoded forms', function() {
    it('should support form data as the second argument', function() {
      var form = {
        form: {
          foo: 'bar',
        }
      };

      ngRequest.post('/bars', form, function(err, response, body) {
        expect(response.statusCode).toEqual(201);
        expect(body.uri).toEqual('/bars/1');
      });

      $httpBackend.expectPOST('/bars?foo=bar').respond(201, {uri: '/bars/1'});
      $httpBackend.flush();
    });
    
    // todo: other variations for calling post with form data
  });
      


  describe('Headers', function() {
    it('sends headers', function() {
      
      ngRequest.get({
        url: '/foo',
        headers: {
          one: 1,
          two: 2,
        }
      }, function(err, response, body) {
        expect(response.status).toEqual(200);
        expect(body).toEqual(JSON.stringify({foo: true}));
      });

      $httpBackend.expectGET('/foo', function(headers) {
        if(headers['one'] != 1)
          return false;

        if(headers['two'] != 2) 
          return false;

        return true;

      });

      $httpBackend.flush();
    });
  });
});
