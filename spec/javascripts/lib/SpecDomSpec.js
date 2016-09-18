//= require lib/dom.js

(function(dom){
  jasmine.getFixtures().fixturesPath = 'spec/javascripts/fixtures/';

  describe('dom', function(){

    beforeEach(function(){
      loadFixtures('lib/dom.html');
    });

    describe('id', function(){
      it('Should return the same of getElementById function', function(){
        expect(dom.id('container')).toEqual(document.getElementById('container'));
      });
    });

    describe('elementsByClass', function(){
      it('return an array', function(){
        expect(Object.prototype.toString.call( dom.elementsByClass('one_element'))).toBe('[object Array]');
      });
      it('return empty array if no elements exist', function(){
        expect(dom.elementsByClass('no-element').length).toBe(0);
      });
      it('return right element', function(){
        expect(dom.elementsByClass('one_element')[0]).toEqual($('.one_element')[0]);
      });
      it('return the same number of elements', function(){
        expect(dom.elementsByClass('more_elements').length).toEqual(document.getElementsByClassName('more_elements').length);
      });
    });

  });
})(window._chess.lib.dom);
