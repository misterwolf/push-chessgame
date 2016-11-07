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

  var channel_example = 'channel_example';
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
      callbacks: {
        on_open: jasmine.createSpy(),
        connection_closed: jasmine.createSpy(),
        connection_error: jasmine.createSpy()
      },
      url: url,
      // channel_name,
      //    event_name:
      //      name:
      //      function:
      channels_specs: {
        new_client_connected: {
          channelName: channel_example,
          events:{
            new_client_info: {
              event_name: 'test_event',
              bindFunction: function(data){
                mainChannel.newClientConnected(data,callbacks.new_client_connected);
              }
            }
          }
        }
      }
    };
  };

  describe('socket.connection', function() {
    beforeEach(function(){
      stub();
    });
    describe('start', function(){
      beforeEach(function(){
        connection.init(opts);
        connection.start();
      });
      afterEach(function(){
        connection.dispatcher = null;
      });
      xit('shouldn\'t reinitialize dispatcher if already present',function(){
        expect(connection.dispatcher).toBe(fakeDispatcher);
      });
      it('has on_open',function(){
        expect(connection.dispatcher.on_open).toBe(opts.callbacks.on_open);
      });
      it('run if callbacks are missing',function(){
        opts.callbacks = null;
        expect(connection.init(opts)).toBe(connection);
      });
      it('has connection_closed callback',function(){
        expect(connection.dispatcher.connection_closed).toBe(opts.callbacks.connection_closed);
      });
      // it('has connection_error callback',function(){
      //   expect(connection.dispatcher.connection_error).toBe(opts.callbacks.connection_error);
      // });
      describe('passed channel', function(){
        it('is subscribed', function(){
          expect(connection.channels[channel_example]).toBeDefined();
        });
        xit('event is binded', function(){
          // TO DO
          expect(connection.channels[channel_example].event.bind_fuction).isBinded();
        });
      });
    });

    describe('init()',function(){
      describe('url',function(){
        it('set default string',function(){
          opts.url = null;
          connection.init(opts);
          expect(connection.url).toBe(url);
        });
      });
    });

    describe('sendOnChannel()', function(){
      it('is called with options',function(done){
        var optsForSend = {event_name:'test-event', message: 'a message'};
        var fakeSendMsg = jasmine.createSpy();
        connection.channels[channel_example] = {trigger: fakeSendMsg};
        connection.sendOnChannel(channel_example,optsForSend);
        setTimeout(function(){
          expect(connection.channels[channel_example].trigger).toHaveBeenCalledWith('test-event','a message');
          done();
        }, 200);
      });
    });

    xdescribe('bindChannels()', function(){
      it('is called with options',function(){

      });
    });

  });

})(window._chess.socket.connection);
