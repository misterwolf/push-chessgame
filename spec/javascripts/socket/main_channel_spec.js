//= require socket/MainChannel.js

(function(chess){
  var messageContainer = '#general-message-user';
  var allClientsContainer = '#all-clients';
  var welcomeMessage = 'Welcome!';
  var goodbyeMessage = 'Goodbye!';
  var channel_name = 'channel_example';
  var userId = 'test-id';
  var anotherUserId = 'test-another-id';
  var opts = {};
  var connection = null;
  var mainChannel = null;

  describe('MainChannel',function(){

    beforeEach(function(){
      var stubConnection = {
        dispatcher: function(){},
        init: jasmine.createSpy()
      };
      window._chess.socket.connection = stubConnection;
      mainChannel = _chess.socket.mainChannel;
      loadFixtures('connection/contents.html');
      loadFixtures('connection/elements.html');

      opts = {
        currentUserId: userId
      };
    });

    describe('init()',function(){

      it('stop if user id is not defined',function(){
        expect(mainChannel.init({userId: null})).toBe(null);
      });

      it('initialize a connection object',function(){
        mainChannel.init(opts);
        expect(window._chess.socket.connection.init).toHaveBeenCalled();
      });

    });

    describe('onOpen()',function(){

      beforeEach(function(){
        mainChannel.init(opts);
      });

      it('write welcome message',function(){
        mainChannel.onOpen();
        expect($(messageContainer).text()).toBe(welcomeMessage);
      });

      it('add user info on all clients div',function(){
        mainChannel.onOpen();
        expect($('#' + userId).length).toBe(1);
      });

    });

    describe('onClose()',function(){
      var el = $('#test-id');
      beforeEach(function(){
        mainChannel.init(opts);
        $(allClientsContainer).append(el);
      });

      it('write goodbye message',function(){
        mainChannel.onClose();
        expect($(messageContainer).text()).toBe(goodbyeMessage);
      });

      it('remove user info on all clients div',function(){
        $(allClientsContainer).append(el);
        mainChannel.onClose();
        expect($('#' + userId).length).toBe(0);
      });

    });

    // describe('bind trigger', function(){

    describe('channel event',function(){
      describe('new_client_info()',function(){
        it('write in proper position',function(){
          var el = $(allClientsContainer);
          mainChannel.channels.channels_specs.new_client_connected.events.bindFuction({id:anotherUserId}); // i think data will be sent in this way.
          var userDiv = $('#' + anotherUserId);
          expect(userDiv[0]).toBeDefined();
          expect(userDiv.parent()[0]).toBe(el[0]);
        });
      });
      describe('all_clients_info()',function(){
        it('write all connected users',function(){
          var el = $(allClientsContainer);
          var id1 = anotherUserId;
          var id2 = anotherUserId + 1;
          mainChannel.channels.channels_specs.get_all_clients.events.bindFuction({1: {id: id1},2: {id: id2}}); // i think data will be sent in this way.
          var userDiv1 = $('#' + id1);
          var userDiv2 = $('#' + id2);
          expect(userDiv1[0]).toBeDefined();
          expect(userDiv2[0]).toBeDefined();
        });
      });
    });
    // });
  });
})(window._chess.socket.mainChannel);
