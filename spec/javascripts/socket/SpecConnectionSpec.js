//= require socket/Connection.js

(function(connection){
  var channel_example = 'new_client_connected';

  describe('socket.connection', function() {
    afterAll(function(){
      connection = null;
    });
    var userId = 'test-id';
    var opts = {
      callbacks: {
        on_open: function(){ return;},
        connection_closed: function(){return;},
        connection_error:  function(){return;}
      },
      state: 'init',
      url: 'localhost:3001/websocket',
      channels: [channel_example]
    };
    describe('init()',function(){

      describe('options processing', function(){
        beforeEach(function(){
          connection.init(opts);
        });
        it('url',function(){
          expect(connection.dispatcher.url).toBe(opts.url);
        });
        xit('channels',function(){
          expect(connection.channels).toBe(opts.channels);
        });
        it('has on_open',function(){
          expect(connection.dispatcher.on_open).toBe(opts.callbacks.on_open);
        });
        it('has connection_closed callback',function(){
          expect(connection.dispatcher.connection_closed).toBe(opts.callbacks.connection_closed);
        });
        it('has connection_error callback',function(){
          expect(connection.dispatcher.connection_error).toBe(opts.callbacks.connection_error);
        });
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

  });

})(window._chess.socket.connection );
