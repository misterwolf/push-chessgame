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
  var anotherUser = {id:'test-another-id',name:'test-another-name'};

  var msgData = {msg: 'test-msg', sent: 0};
  var dataAcceptor =  {userDest: user, userAcceptor: anotherUser, msg: msgData};
  var dataCurrentUser =  {userDest: user, userRequester: anotherUser, msg: msgData};
  var dataAnotherUser =  {userDest: anotherUser, userRequester: user, msg: msgData};

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
        sendOnChannel: jasmine.createSpy(),
        channels: {
          request_chat_channel: {
            trigger: jasmine.createSpy()
          }
        }
      };
      chatChannel.connection = stubConnection;
    });

    describe('has a method init that',function(){
      it('set the logged user',function(){
        chatChannel.init(user, opts);
        expect(chatChannel.currentUser).toBe(user);
      });
    });

    describe('has a method sendReceiveChatMsg that',function(){
      describe('when user dest != current user', function(){
        beforeEach(function(){
          spyOn(chatChannel,'trigger');
          chatChannel.currentUser = user;
          chatChannel.sendReceiveChatMsg(dataAnotherUser);
        });
        it('trigger message to channel and stop propagation',function(){
          chatChannel.sendReceiveChatMsg(dataAnotherUser);
          expect(chatChannel.connection.channels.request_chat_channel.trigger).toHaveBeenCalledWith('msg_channel',
            {
              userDest: dataAnotherUser.userDest,
              userSender: chatChannel.currentUser,
              msg: dataAnotherUser.msg
            }
          );
          expect(dataAnotherUser.msg.sent).toBe(1);
        });
        it('send back the message',function(){
          expect(chatChannel.trigger).toHaveBeenCalled();
        });
      });
      describe('when user dest == current user', function(){
        it('trigger msg_channel',function(){
          spyOn(chatChannel,'trigger');
          chatChannel.currentUser = anotherUser;
          chatChannel.sendReceiveChatMsg(dataAnotherUser);
          expect(chatChannel.trigger).toHaveBeenCalledWith('msg_channel',dataAnotherUser);
        });
      });
    });

    describe('has the method onChatRequested that ',function(){
      it('doesn\'t call trigger when user is not currentUser',function(){
        spyOn(chatChannel,'trigger');
        chatChannel.currentUser = user;
        chatChannel.onChatRequested( dataAnotherUser );
        expect(chatChannel.trigger).not.toHaveBeenCalled();
      });
      it('calls trigger when user is currentUser',function(){
        spyOn(chatChannel,'trigger');
        chatChannel.currentUser = anotherUser;
        chatChannel.onChatRequested(dataAnotherUser);
        expect(chatChannel.trigger).toHaveBeenCalledWith('chat_requested',dataAnotherUser.userRequester);
      });
    });

    describe('has the method chatAccepted that ',function(){
      it('doesn\'t call the trigger with chat_accepted when user isn\'t current ',function(){
        spyOn(chatChannel,'trigger');
        chatChannel.currentUser = user;
        chatChannel.chatAccepted(dataAnotherUser);
        expect(chatChannel.trigger).not.toHaveBeenCalled();
      });
      it('calls the trigger with chat_accepted when user is current ',function(){
        spyOn(chatChannel,'trigger');
        chatChannel.currentUser = anotherUser;
        chatChannel.chatAccepted(dataAnotherUser);
        expect(chatChannel.trigger).toHaveBeenCalledWith('chat_accepted',dataAnotherUser.dataAcceptor);
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
