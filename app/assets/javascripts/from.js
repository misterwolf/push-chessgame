MySwitch = function(options) {

  this.options = options;
  this._$el = $(options.element);
  this._status = 0;
  this._$el.data('value-on') ? this._valueOn = this._$el.data('value-on') : this._valueOn = 'ON';
  this._$el.data('value-off') ? this._valueOff = this._$el.data('value-off') : this._valueOff = 'OFF';
  if (!this._$el.text()) {this._$el.text(this._valueOff);}

  this._$el.on('click', $.proxy(this.toggle, this));
};

MySwitch.prototype.toggle = function(el) {

  this._status ? (this._$el.text(this._valueOff), this._status = 0) : (this._status = 1, this._$el.text(this._valueOn));

  if (typeof this.options.onToggle === 'function')
      {this.options.onToggle.call(this, this._status);}
};

MySwitch.prototype.getStatus = function(el) {
  return this._status;
};


// testClass

describe('My switch', function() {

  var options, element, myToggle;

  beforeEach(function() {

    element = document.createElement('div');

    element.innerHTML = '<span data-value-off="AM" data-value-on="PM"></span>';

    $('body')[0].appendChild(element);

    function onToggleCallback() {}

    options = {

        element: $(element).find('span')[0],
        onToggle: onToggleCallback
      };

    myToggle = new MySwitch(options);
  });

  afterEach(function() {

      $('body > div')[0].remove();
    });

  it('Should set ON/OFF as default values', function() {

      $('body > div')[0].remove();

      element = document.createElement('div');

      element.innerHTML = '<span></span>';

      $('body')[0].appendChild(element);

      options = {

          element: $(element).find('span')[0],
          onToggle: function(status) {}
        };

      myToggle = new MySwitch(options);
      $(element).removeAttr('data-value-on').removeAttr('data-value-off');

      expect($(element).text()).toMatch('OFF');

      myToggle.toggle();

      expect($(element).text()).toMatch('ON');

    });

  it('Should have AM as off value', function() {

      expect($(element).text()).toMatch('AM');

    });

  it('Should have PM as on value', function() {

      expect($(element).text()).toMatch('AM');

    });

  it('Should toggle AM->PM->AM', function() {

      myToggle.toggle();
      expect($(element).text()).toMatch('PM');
      myToggle.toggle();

      expect($(element).text()).toMatch('AM');
    });

  it('Should call onToggle callback', function() {

      spyOn(options, 'onToggle');

      myToggle.toggle();

      expect(options.onToggle).toHaveBeenCalled();

    });

});
