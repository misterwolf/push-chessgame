//= require socket/Connection.js

(function(connection){
  var channel_example = 'channel_example';
  var usedId = 'test-id';
  var opts = null;

  var stub = function(){
    opts = {
      callbacks: {
        on_open: function(){ return;},
        connection_closed: function(){return;},
        connection_error:  function(){return;}
      },
      state: 'init',
      url: 'localhost:3001/websocket',
      // channel_name,
      //    event_name:
      //      name:
      //      function:
      channels_specs: {
        channel_example: {
          channel_name: channel_example,
          events:{
            event_name: '',
            bind_fuction: jasmine.createSpy()
          }
        }
      }

    };
  };

  describe('socket.connection', function() {
    beforeEach(function(){
      stub();
    });

    describe('init()',function(){
      describe('url',function(){

        it('url',function(){
          connection.init(opts);
          expect(connection.dispatcher.url).toBe(opts.url);
        });
        it('set default string',function(){
          opts.url = null;
          connection.init(opts);
          expect(connection.dispatcher.url).toBe(opts.url);
        });
      });

      describe('in options processing', function(){

        beforeEach(function(){
        });
        it('callbacks are missing ',function(){
          opts.callbacks = null;
          expect(connection.init(opts)).toBe(connection);
        });
        it('has on_open',function(){
          connection.init(opts);
          expect(connection.dispatcher.on_open).toBe(opts.callbacks.on_open);
        });
        it('has connection_closed callback',function(){
          connection.init(opts);
          expect(connection.dispatcher.connection_closed).toBe(opts.callbacks.connection_closed);
        });
        it('has connection_error callback',function(){
          connection.init(opts);
          expect(connection.dispatcher.connection_error).toBe(opts.callbacks.connection_error);
        });
        describe('passed channel', function(){
          it('is subscribed', function(){
            connection.init(opts);
            expect(connection.channels[channel_example]).toBeDefined();
          });
          xit('is binded', function(){ // ?
            var optsForSend = {};
            connection.init(opts);
            expect(connection.channels[channel_example].bind.call(this)).toBeDefined();
          });
        });
      });

      it('shouldn\'t reinitialize dispatcher if already present',function(){
        var fakeDispatcher = {
          subscribe: function(){ return {
              bind: jasmine.createSpy()
            };
          }
        };
        connection.dispatcher = fakeDispatcher;
        connection.init(opts);
        expect(connection.dispatcher).toBe(fakeDispatcher);
      });

    });

    describe('sendOnChannel()', function(){
      it('is called with options',function(){
        var optsForSend = {event_name:'test-event', message: 'a message'};
        var fakeSendMsg = jasmine.createSpy();
        connection.channels[channel_example] = {trigger: fakeSendMsg};
        connection.sendOnChannel(channel_example,optsForSend);
        expect(connection.channels[channel_example].trigger).toHaveBeenCalledWith('test-event','a message');
      });
    });

    describe('bindChannels()', function(){
      it('is called with options',function(){

      });
    });

  });

})(window._chess.socket.connection );
