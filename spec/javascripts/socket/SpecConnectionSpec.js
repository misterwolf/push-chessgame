//= require socket/Connection.js

// take a look at this for new idea or inspiration...
// https://github.com/websocket-rails/websocket-rails/blob/master/spec/javascripts/websocket_rails/event_spec.coffee

(function(connection){
  describe('Socket', function() {
    var stub = {
      url: 'localhost:3001/websocket'
    };

    describe('Connection', function() {

      describe('init function ', function() {
        beforeAll(function(){
          connection.init(stub);
        });
        it('have a connection url', function() {
          expect(connection.dispatcher.url).toBe(stub.url);
        });

        describe('dispatcher', function(){
          it('to be defined', function() {
            expect(connection.dispatcher).toBeDefined();
          });

          it('the state should \'connecting\'', function() {
            expect(connection.dispatcher.state).toBe('connecting');
          });
          describe('callback', function(){
            it('on_open should be called', function(done) {
              spyOn(connection.dispatcher, 'on_open');
              setTimeout(function(){expect(connection.dispatcher.on_open).toHaveBeenCalled();done();}, 150);
            });

            it('connection_closed should be called', function(/*done*/) {
              connection.dispatcher.disconnect();
              spyOn(connection.dispatcher, 'connection_closed');
              // setTimeout(function(){
              expect(connection.dispatcher.state).toBe('disconnected');
              expect(connection.dispatcher.connection_closed).toHaveBeenCalled();
              // done();}, 3010);
            });

          });
        });
      });

    });
  });
})(window._chess.socket.connection);
