//= require websocket_rails/main
//= require namespace
//= require lib/namespace
//= require lib/ajax
//= require lib/json
//= require lib/dom
//= require socket/namespace
//= require socket/Connection.js

(function(connection){
  'use strict';
  var channel_name = 'channel_name',
    channel_event = 'event_example',
    onTrigger = jasmine.createSpy();

  var opts = null;
  var url = 'localhost:3000/websocket';
  var fakeDispatcher = {
    subscribe: function(){ return {
        bind: jasmine.createSpy()
      };
    }
  };

  var WebSocketRails = fakeDispatcher;

  var stub = function(){
    opts = {
      url: url,
    };
  };

  describe('the class socket.connection', function() {
    beforeEach(function(){
      stub();
    });

    // INTRODUCE PROMISE IN OPEN AND DISCONNECT
    // describe('has the method registerPromise that', function(){
    //   it('call specified promise with cb', function(done){
    //     ui.cb = function(data){
    //       expect(data).toBe(dataTest);
    //       done();
    //     };
    //     spyOn(ui, 'cb').and.callThrough();
    //     var fakePromise = new Promise(function(resolve, reject){
    //       setTimeout(function(){
    //         resolve(dataTest);
    //       }, 100);
    //     });
    //
    //     ui.registerPromise(fakePromise, ui.cb, function(){});
    //
    //   });
    // });

    describe('has method init() that',function(){
      it('sets default url when opts.url is missing',function(){
        connection.init({});
        expect(connection.url).toBe(url);
      });
      it('sets the passed default url',function(){
        var test_url = {url: 'test-url'};
        connection.init(test_url);
        expect(connection.url).toBe(test_url.url);
      });
    });

    describe('has a method start that', function(){
      beforeEach(function(){
        connection.init(opts);
        connection.start();
      });
      afterEach(function(){
        connection.dispatcher = null;
      });
      it('initialize a dispatcher',function(){
        expect(connection.dispatcher).toBeDefined();
      });
      it('add callbacks a dispatcher',function(){
        expect(connection.dispatcher.on_open).toBeDefined();
        expect(connection.dispatcher.connection_closed).toBeDefined();
        expect(connection.dispatcher.connection_error).toBeDefined();
      });
    });

    describe('has method sendOnChannel() that', function(){
      beforeEach(function(){
        var optsForSend = {event_name:'test-event', message: 'a message'};
        var fakeSendMsg = jasmine.createSpy();
        connection.channels[channel_name] = {trigger: fakeSendMsg};
        connection.sendOnChannel(channel_name,optsForSend);
      });
      it('is called with options when state is connected',function(done){
        connection.dispatcher = {state: 'connected'};
        setTimeout(function(){
          expect(connection.channels[channel_name].trigger).toHaveBeenCalledWith('test-event','a message');
          done();
        }, 200);
      });
      it('should\'t called with options when state is not euqal to connected',function(done){
        connection.dispatcher = {state: 'another_state'};
        setTimeout(function(){
          expect(connection.channels[channel_name].trigger).not.toHaveBeenCalled();
          done();
        }, 200);
      });
    });

    describe('has method addCallback() that',function(){
      it('bind callback', function(){
        var name = 'test', cb = jasmine.createSpy();
        connection.addCallback(name, cb);
        expect(connection.dispatcher[name]).toBe(cb);
      });
    });

    describe('has method subscribeChannel() that',function(){
      it('binds specified channel event with passed arguments', function(done){
        connection.dispatcher = fakeDispatcher;
        connection.dispatcher.state = 'connected';
        connection.subscribeChannel(channel_name, channel_event, onTrigger);
        setTimeout(function(){
          expect(connection.channels[channel_name].bind).toHaveBeenCalledWith(channel_event, onTrigger);
          done();
        }, 200);
      });
    });

  });

})(window._chess.socket.connection);
