//= require socket/Connection.js

jasmine.getFixtures().fixturesPath = 'spec/javascripts/fixtures/';

(function(connection, dom){
  var channel_example = 'new_client_connected';

  describe('socket.connection', function() {
    var userId = 'test-id';
    var stub = {
      callbacks: [],
      state: 'init',
      url: 'localhost:3001/websocket',
      userId: userId,
      channels: [channel_example],
      on_open: function(){ return;},
      on_close: function(){return;},

    };
    describe('init()',function(){
      it('shouldn\'t start without userId', function(){
        stub.userId = null;
        connection.init(stub);
        expect(connection.state).toBe('error');
      });
      it('should process', function(){
        stub.userId = userId;
        spyOn(connection,'subscribeAndBindChannels');
        spyOn(connection,'addCallbacks');
        connection.init(stub);
        expect(connection.dispatcher.url).toBe(stub.url);
        expect(connection.dispatcher).not.toBe(null);
        expect(connection.subscribeAndBindChannels).toHaveBeenCalled();
        expect(connection.addCallbacks).toHaveBeenCalled();
      });
    });

    describe('callbacks', function(){

      it('onOpen()', function(){
        var cb = function(){
        };
        stub.callbacks.on_open = cb;
        connection.init(stub);
        expect(connection.dispatcher.on_open).toBe(cb);

      });

      it('onClose()', function(){
        var cb = function(){};
        stub.callbacks.on_close = cb;
        connection.init(stub);
        expect(connection.dispatcher.connection_closed).toBe(cb);
      });

    });
    describe('unsubscribe()',function(){
    });

  });

})(window._chess.socket.connection, window._chess.lib.dom );
