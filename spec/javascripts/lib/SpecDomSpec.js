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

    describe('remove',function(){
      var elem_id = 'element_to_remove';
      it('return no elements after deleting',function(){
        var elem = dom.id(elem_id);
        expect(dom.remove(elem)).toBe(0);
      });
      it('does not fail if param is wrong',function(){
        console.log(dom.remove(elem_id + '_nulling'));
        expect(dom.remove(elem_id + '_nulling')).toBe(undefined);
      });
    });

    describe('createElement',function(){
      var elem = null;
      var tag = 'div';
      it('tag is div',function(){
        elem = dom.createElement(tag);
        expect(elem.tagName).toBe(tag.toUpperCase());
      });
      describe('with class name',function(){
        var testClass = 'test-class';
        beforeEach(function(){
          elem = dom.createElement(tag, null, testClass);
        });
        it('element has class',function(){
          expect(elem.className).toBe(testClass);
        });
      });
      describe('with id',function(){
        var id = 'id-class';
        beforeEach(function(){
          elem = dom.createElement(tag, id);
        });
        it('element has class',function(){
          expect(elem.id).toBe(id);
        });
      });

      describe('with both',function(){
        var id = 'id-class';
        var testClass = 'test-class';
        beforeEach(function(){
          elem = dom.createElement(tag, id, testClass);
        });
        it('element has id and class',function(){
          expect(elem.className).toBe(testClass);
          expect(elem.id).toBe(id);
        });
      });
    });

  });
})(window._chess.lib.dom);
