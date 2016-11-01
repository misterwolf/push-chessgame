//= require lib/ajax

(function(ajax){
  'use strict';

  var url = 'http://example.com';

  describe('the lib Interface', function(){
    describe('has the class ajax that', function(){

      beforeEach(function() {
        jasmine.Ajax.install();
      });

      afterEach(function() {
        jasmine.Ajax.uninstall();
      });

      describe('has a method send that', function(){

        it('Sets the right query string with get', function() {
          ajax.send(url, { a: 1 });
          var request = jasmine.Ajax.requests.mostRecent();
          expect(request.url).toBe(url + '?a=1');
        });

        it('Allows to set up headers', function() {
          ajax.send(url, {}, {
            headers: {
              'X-Header': 'Ok'
            }
          });
          var request = jasmine.Ajax.requests.mostRecent();
          expect(request.requestHeaders['X-Header']).toBe('Ok');
        });

        it('Serialize body with type=form', function() {
          ajax.send(url, { a: 1 }, { method: 'post', type: 'form' });
          var request = jasmine.Ajax.requests.mostRecent();
          expect(request.params).toBe('a=1');
        });

        it('Sets up the right Content-Type with type=form', function() {
          ajax.send(url, { a: 1 }, { method: 'post', type: 'form' });
          var request = jasmine.Ajax.requests.mostRecent();
          expect(request.requestHeaders['Content-Type']).toBe('application/x-www-form-urlencoded');
        });

        it('Serialize body with type=json', function() {
          ajax.send(url, { a: 1 }, { method: 'post', type: 'json' });
          var request = jasmine.Ajax.requests.mostRecent();
          expect(request.params).toBe('{"a":1}');
        });

        it('Sets up the right Content-Type with type=json', function() {
          ajax.send(url, { a: 1 }, { method: 'post', type: 'json' });
          var request = jasmine.Ajax.requests.mostRecent();
          expect(request.requestHeaders['Content-Type']).toBe('application/json');
        });
      });
    });
  });
}(_chess.lib.ajax, _chess.lib.json));
