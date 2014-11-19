describe("ngRequest", function() {

  var ngRequest, $httpBackend;

  beforeEach(angular.mock.module("ngRequest"));

  beforeEach(inject(function($injector) {
    $httpBackend = $injector.get("$httpBackend");

    ngRequest = $injector.get("ngRequest");

    $httpBackend.whenGET("/foo").respond({ok: true});

  }));

 afterEach(function() {
   $httpBackend.verifyNoOutstandingExpectation();
   $httpBackend.verifyNoOutstandingRequest();
 });


  it("should implement method GET", function() {
    ngRequest({
      uri: '/foo',
      method: 'GET',
    }, function(err, response, body) {
      expect(response.status).toEqual(200);
      expect(body).toEqual({ok: true});
    });

    $httpBackend.expectGET('/foo');
    $httpBackend.flush();
 
  });


  describe("shortcuts", function() {
    it("should implement request.get", function() {

      ngRequest.get('/foo', function(err, response, body) {
        expect(response.status).toEqual(200);
        expect(body).toEqual({ok: true});
      });

      $httpBackend.expectGET('/foo');
      $httpBackend.flush();
    });
  });

});
