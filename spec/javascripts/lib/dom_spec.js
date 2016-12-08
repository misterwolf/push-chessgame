//= require lib/dom.js

(function(dom){

  describe('the lib Interface', function(){
    describe('has the class dom that', function(){

      beforeEach(function(){
        loadFixtures('lib/dom.html');
      });

      describe('has method id() that', function(){
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
          expect(dom.remove(elem_id + '_nulling')).toBe(undefined);
        });
      });

      describe('has method add and removePreventDefault that ',function(){ // has sense?
        var elem = null;
        beforeEach(function(){
          elem = dom.id('btn');
          dom.addPreventDefault(elem);
        });
        it('preventDefault an element',function(done){
          var event = document.createEvent('HTMLEvents');
          event.initEvent('click', true, true);
          event.preventDefault = jasmine.createSpy();
          elem.dispatchEvent(event);
          setTimeout(function(){
            expect(event.preventDefault).toHaveBeenCalled();
            done();
          },200);
        });
        it('and remove prevention',function(){
          dom.removePreventDefault(elem);
          var event = document.createEvent('HTMLEvents');
          event.initEvent('click', true, true);
          event.preventDefault = jasmine.createSpy();
          elem.dispatchEvent(event);
          expect(event.preventDefault).not.toHaveBeenCalled();
        });
      });

      describe('createElement()',function(){
        var elem = null;
        var tag = 'div';
        var testClass = 'test-class';
        var id = 'test-id';

        it('define the tag',function(){
          elem = dom.createElement(tag);
          expect(elem.tagName).toBe(tag.toUpperCase());
        });
        it('add class to html tag if specified',function(){
          elem = dom.createElement(tag, null, testClass);
          expect(elem.className).toBe(testClass);
        });
        it('add id to html tag if specified',function(){
          elem = dom.createElement(tag, id);
          expect(elem.id).toBe(id);
        });
        it('add class and id to html tag if both are specified',function(){
          elem = dom.createElement(tag, id, testClass);
          expect(elem.className).toBe(testClass);
          expect(elem.id).toBe(id);
        });
      });

      describe('addEventListener', function(){
        it('event is triggered', function(done){
          var elem = dom.id('btn');

          dom.addEventListener(elem, 'click', function(evt){
            expect(evt.target).toBe(elem);
            done();
          });
          // move event creator on helper
          var event = document.createEvent('HTMLEvents');
          event.initEvent('click', true, true);
          elem.dispatchEvent(event);
          // $(elem).click();
        });
      });
    });
  });
})(window._chess.lib.dom);
