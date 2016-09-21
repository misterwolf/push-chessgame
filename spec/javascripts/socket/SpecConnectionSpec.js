//= require socket/Connection.js

jasmine.getFixtures().fixturesPath = 'spec/javascripts/fixtures/';

(function(connection, dom){

  describe('Socket', function() {
    var user_id = 'test-id';
    var stub = {
      url: 'localhost:3001/websocket',
      user_id: user_id
    };

    describe('Connection', function() {

      describe('init function ', function() {
        beforeAll(function(){
          connection.init(stub);
        });
        it('have a connection url', function() {
          expect(connection.dispatcher.url).toBe(stub.url);
        });
        // USELESS
        // describe('dispatcher', function(){
        //   it('to be defined', function() {
        //     expect(connection.dispatcher).toBeDefined();
        //   });
        //
        //   it('the state should \'connecting\'', function() {
        //     expect(connection.dispatcher.state).toBe('connecting');
        //   });
        //   describe('callback', function(){
        //     it('on_open should be called', function(done) {
        //       // it's the right way to test callbacks?
        //       spyOn(connection.dispatcher, 'on_open');
        //       setTimeout(function(){expect(connection.dispatcher.on_open).toHaveBeenCalled(); done();}, 200);
        //     });
        //     it('connection_closed should be called', function(done) {
        //       // it's the right way to test callbacks?
        //       spyOn(connection.dispatcher, 'connection_closed');
        //       connection.disconnect();
        //       setTimeout(function(){
        //         expect(connection.dispatcher.connection_closed).nottoHaveBeenCalled();
        //         done();
        //       }, 200);
        //     });
        //   });
        // });
        describe('callbacks', function(){

          beforeEach(function(){
            loadFixtures('connection/elements.html');
          });

          describe('onOpen', function(){
            it('welcome message is set', function(done) {
              setTimeout(function(){
                // TO DO: toContain is more generic: a day i will decide to insert into 'welcome_user' div some other elements.
                // it's better move html checks in Connection in another class.
                expect( $('#welcome_user').html() ).toContain('Welcome user! :)');
                done();
              }, 300);
            });
            it('client is added to dom',function(done){
              setTimeout(function(){
                expect( $('#all_clients').children().length ).toBe(1);
                done();
              }, 200);
            });
          });
          describe('onClose', function(){
            it('goodbye message is set', function(done) {
              connection.disconnect();
              setTimeout(function(){
                expect( $('#goodbye_user').html() ).toContain('Goodbye user! :)');
                done();
              }, 200);
            });
            it('all clients container emptied', function() {
              var prevLength = $('#all_clients').children().length;
              connection.disconnect();
              setTimeout(function(){
                expect($('#all_clients').children().length).toBe(prevLength - 1);
              });
            });
          });
          // describe('onReceiveMessage', function(){
          //   it('remove element from all users', function() {
          //   });
          // });
        });

      });

    });
  });
})(window._chess.socket.connection, window._chess.lib.dom );
