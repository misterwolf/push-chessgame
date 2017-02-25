//= require websocket_rails/main
//= require namespace
//= require lib/namespace
//= require lib/ajax
//= require lib/json
//= require lib/dom
//= require socket/namespace
//= require socket/ChatChannel.js

(function(chatChannel){
  'use strict';

  var opts = {};
  var connection = null;
  var user = {id:'test-id',name:'test-name'};
  var anotherUser = {id:'test-another-id',name:'test-name'};
  var dataAcceptor =  {userDest: user, userAcceptor: anotherUser};
  var dataCurrentUser =  {userDest: user, userRequester: anotherUser};
  var dataAnotherUser =  {userDest: anotherUser, userRequester: user};
  var channel_name = 'channel_name',
    channel_event = 'event_example',
    onTrigger = jasmine.createSpy();

  describe('the ChatChannel module',function(){

    beforeEach(function(){
      var stubConnection = {
        dispatcher: function(){},
        init: function() {return this;},
        subscribeChannel: jasmine.createSpy(),
        start: jasmine.createSpy(),
        subscribe: jasmine.createSpy(),
        disconnect: jasmine.createSpy(),
        sendOnChannel: jasmine.createSpy()
      };
      chatChannel.connection = stubConnection;
    });

    describe('has a method init that',function(){
      it('set the logged user',function(){
        chatChannel.init(user, opts);
        expect(chatChannel.currentUser).toBe(user);
      });
    });

    describe('has the method onChatRequested that ',function(){
      it('doesn\'t call trigger when user is not currentUser',function(){
        spyOn(chatChannel,'trigger');
        chatChannel.onChatRequested( dataAnotherUser );
        expect(chatChannel.trigger).not.toHaveBeenCalled();
      });
      it('calls trigger when user is currentUser',function(){
        spyOn(chatChannel,'trigger');
        chatChannel.onChatRequested(dataCurrentUser);
        expect(chatChannel.trigger).toHaveBeenCalledWith('chat_requested',anotherUser);
      });
    });

    describe('has the method chatAccepted that ',function(){
      it('doesn\'t notifies with chat_accepted',function(){
        spyOn(chatChannel,'trigger');
        chatChannel.chatAccepted(dataAnotherUser);
        expect(chatChannel.trigger).not.toHaveBeenCalled();
      });
      it('notifies with chat_accepted',function(){
        spyOn(chatChannel,'trigger');
        chatChannel.chatAccepted(dataAcceptor);
        expect(chatChannel.trigger).toHaveBeenCalledWith('chat_accepted',anotherUser);
      });
    });

    describe('has the method chatRefused that ',function(){
      it('notify with chat_refused',function(){
        spyOn(chatChannel,'trigger');
        chatChannel.chatRefused({});
        expect(chatChannel.trigger).toHaveBeenCalledWith('chat_refused',{});
      });
    });

  });

})(window._chess.socket.chatChannel);
