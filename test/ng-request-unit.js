describe("ngRequest", function() {

  var ngRequest, $httpBackend;

  beforeEach(angular.mock.module("ngRequest"));

  beforeEach(inject(function($injector) {
    $httpBackend = $injector.get("$httpBackend");

    ngRequest = $injector.get("ngRequest");


    $httpBackend.whenGET("/foo").respond(JSON.stringify({foo: true}));
    $httpBackend.whenGET("/foo?bar=wtf").respond(JSON.stringify({foo: true, bar: true}));


  }));

 afterEach(function() {
   $httpBackend.verifyNoOutstandingExpectation();
   $httpBackend.verifyNoOutstandingRequest();
 });


  describe('GET requests', function() {
    it("should implement method GET", function() {
      ngRequest({
        uri: '/foo',
        method: 'GET',
      }, function(err, response, body) {
        expect(response.status).toEqual(200);
        expect(body).toEqual(JSON.stringify({foo: true}));
      });

      $httpBackend.expectGET('/foo');
      $httpBackend.flush();

    });


    it("should implement GET with parameters", function() {
      ngRequest({
        uri: '/foo?bar=wtf',
      }, function(err, response, body) {
        expect(response.status).toEqual(200);
        expect(body).toEqual(JSON.stringify({foo: true, bar: true}));
      });

      $httpBackend.expectGET('/foo?bar=wtf');
      $httpBackend.flush();

    });

    it("should implement request.get shortcut", function() {
      ngRequest.get('/foo', function(err, response, body) {
        expect(response.status).toEqual(200);
        expect(body).toEqual(JSON.stringify({foo: true}));
      });

      $httpBackend.expectGET('/foo');
      $httpBackend.flush();
    });
      
  }); // /GET


  describe('POST requests', function() {
    it("should implement method POST", function() {
      var barx;
      var bar = {
        name: 'sycamore',
        bartender: 'marco'
      };
      ngRequest.post({
        url: '/bars', 
        json: bar
      }, function(err, response, body) {
        expect(response.status).toEqual(201);
        expect(body.uri).toEqual('/bars/1');
      });

      $httpBackend.expectPOST('/bars', bar).respond(201, {uri: '/bars/1'});
      $httpBackend.flush();      
    });
  });

});
