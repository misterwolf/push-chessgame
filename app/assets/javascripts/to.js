MySwitch = function(options) {
    this.options = options;
    this._status = 0;
};

MySwitch.prototype.init = function() {
    this._$el = $(options.element);
    this._$el.data('value-on') ? this._valueOn = this._$el.data('value-on') : this._valueOn = 'ON';
    this._$el.data('value-off') ? this._valueOff = this._$el.data('value-off') : this._valueOff = 'OFF';
    if (!this._$el.text()) this._$el.text(this._valueOff);

    this._$el.on('click', $.proxy(this.toggle, this));
};
MySwitch.prototype.toggle = function() {
    this.toggleStatus();
    this.setText();
    this.runToggleFunction();
};

MySwitch.prototype.runToggleFunction = function() {
    if (typeof this.options.onToggle === 'function')
        this.options.onToggle.call(this, this._status);
};

MySwitch.prototype.toggleStatus = function() {
    this._status = this._status === 0 ? 1 : 0;
};

MySwitch.prototype.setText = function() {
    this.getEl.text(this._status ? this._valueOn : this._valueOff);
};

MySwitch.prototype.getEl = function() {
    return this._$el;
};

// TEST
describe('MySwitch', function() {

    it('toggle()', function() {
        var mySwitch = new MySwitch();

        spyOn(mySwitch, 'toggleStatus');
        spyOn(mySwitch, 'setText');
        spyOn(mySwitch, 'runToggleFunction');

        mySwith.toggle();

        expect(mySwitch.toggleStatus).toHaveBeenCalled();
        expect(mySwitch.setText).toHaveBeenCalled();
        expect(mySwitch.runToggleFunction).toHaveBeenCalled();
    });

    describe('runToggleFunction()', function() {
        it('callback provided', function() {
          var func = jasmine.createSpy('func');
          var mySwitch = new MySwitch({
              onToggle: func
            });
          var status = 1;

          mySwitch._status = status;
          mySwitch.runToggleFunction();

          expect(func).toHaveBeenCalledWith(status);
        });

        it('no callback', function() {
          var mySwitch = new MySwitch();

          try {
            mySwitch.runToggleFunction();
            expect(true).toBe(true);
          } catch (e) {
            expect(true).toBe(false);
          }
        });
      });

    it('toggleStatus()', function() {
        var mySwitch = new MySwitch();

        mySwitch._status = 1;
        mySwitch.toggleStatus();

        expect(mySwitch._status).toBe(0);
      });

    describe('setText()', function() {

      var valueOn = 'on';
      var valueOff = 'off';
      var mySwitch;
      var $el;

      beforeEach(function() {
        mySwitch = new MySwitch();

        $el = {
            text: function() {}
          };

        spyOn($el, 'text');
        spyOn(mySwitch, 'getEl').and.returnValue($el);
      });

      it('status 0', function() {
        mySwitch._status = 0;
        mySwitch.setText();
        expect($el.text).toBe(valueOff);
      });

      it('status 1', function() {
        mySwitch._status = 1;
        mySwitch.setText();
        expect($el.text).toBe(valueOn);
      });
    });
  });
