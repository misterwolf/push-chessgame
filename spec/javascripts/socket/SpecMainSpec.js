//= require socket/Main.js

(function(main){
  var messageContainer = '#general-message-user';
  var allClientsContainer = '#all-clients';
  var welcomeMessage = 'Welcome!';
  var goodbyeMessage = 'Goodbye!';

  var stubConnection = {
    dispatcher: function(){}
  };

  describe('Main',function(){

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

    });

    describe('onOpen()',function(){

      beforeEach(function(){
        main.init(opts);
        main.onOpen();
      });

      it('write welcome message',function(){
        expect($(messageContainer).text()).toBe(welcomeMessage);
      });

      xit('add user info on all clients div',function(){
        var el = $('#test-id');
        expect($(allClientsContainer).children()).toContain(el);
      });

    });

    describe('onClose()',function(){

      beforeEach(function(){
        main.init(opts);
        var el = $('#test-id');
        $(allClientsContainer).append(el);
        main.onClose();
      });

      it('write goodbye message',function(){
        expect($(messageContainer).text()).toBe(goodbyeMessage);
      });

      xit('add user info on all clients div',function(){
        expect($(allClientsContainer).children()[0]).not.toContain(el);
      });

    });

  });
})(window._chess.socket.main);
