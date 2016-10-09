//= require socket/Main.js

(function(main){
  var messageContainer = '#general-message-user';
  var allClientsContainer = '#all-clients';
  var welcomeMessage = 'Welcome!';
  var goodbyeMessage = 'Goodbye!';

  describe('Main',function(){

    var mockConnection = {
      dispatcher: function(){},
      init: jasmine.createSpy()
    };

    connection = mockConnection;
    var opts = {};

    beforeEach(function(){
      loadFixtures('connection/elements.html');

      opts = {
        currentUserId: 'test-id'
      };
    });

    describe('init()',function(){

      it('stop if user id is not defined',function(){
        opts.currentUserId = null;
        main.init(opts);
        expect(main.state).toBe(null);
      });

      it('use a default welcome message',function(){
        main.init(opts);
        expect(main.welcomeMessage).toBe(welcomeMessage);
      });

      it('initialize a connection object',function(){
        main.init(opts);
        expect(connection.init).toHaveBeenCalled();
      });

    });

    describe('onOpen()',function(){

      beforeEach(function(){
        main.init(opts);
      });

      it('write welcome message',function(){
        main.onOpen();
        expect($(messageContainer).text()).toBe(welcomeMessage);
      });

      it('execute callback',function(){
        var cb = jasmine.createSpy();
        main.onOpen(cb);
        expect(cb).toHaveBeenCalled();
      });

      xit('add user info on all clients div',function(){
        var el = $('#test-id');
        main.onOpen();
        expect($(allClientsContainer).children()).toContain(el);
      });

    });

    describe('onClose()',function(){
      var el = $('#test-id');
      beforeEach(function(){
        main.init(opts);
        $(allClientsContainer).append(el);
      });

      it('write goodbye message',function(){
        main.onClose();
        expect($(messageContainer).text()).toBe(goodbyeMessage);
      });

      it('remove user info on all clients div',function(){
        main.onClose();
        $(allClientsContainer).append(el);
        expect($(allClientsContainer).children()).not.toContain(el);
      });

    });

  });
})(window._chess.socket.main);
