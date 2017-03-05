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
  var dataAcceptor =      {userDest: user, userAcceptor: anotherUser, msg: msgData};
  var dataCurrentUser =   {userDest: user, userRequester: anotherUser, msg: msgData};
  var dataAnotherUser =   {userDest: anotherUser, userRequester: user, msg: msgData};

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

    describe('has a method getActiveChats() that',function(){
      xit('return active chat', function(){
      });
    });

    describe('has a method requestChat() that',function(){
      it('notifies to request_chat_channel and disables current button', function(){
        chatChannel.currentUser = user;
        chatChannel.requestChat(anotherUser);
        expect(chatChannel.connection.channels.request_chat_channel.trigger).toHaveBeenCalledWith('chat_requested',
          {
            userDest: dataAnotherUser.userDest,
            userRequester: chatChannel.currentUser
          }
        );
      });
      it('throws an error if chat already exist', function(){
        chatChannel.activeChats[anotherUser.id] = {};
        expect( function(){chatChannel.requestChat(anotherUser);} ).toThrow('You already started a chat with test-another-name');
      });
    });

    describe('has a method acceptChat() that',function(){
      it('triggers a message to the request_chat_channel and subscribe personal users channel',function(){
        chatChannel.currentUser = user;
        chatChannel.acceptChat(anotherUser);
        expect(chatChannel.connection.channels.request_chat_channel.trigger).toHaveBeenCalledWith('chat_accepted',
          {
            userDest: dataAnotherUser.userDest,
            userAcceptor: chatChannel.currentUser,
            chatChannelName: 'msg_chat_channel_' + dataAnotherUser.userDest.id + '_' + chatChannel.currentUser.id
          }
        );
      });
    });

    describe('has a method sendReceiveChatMsg that',function(){
      describe('when user dest != current user', function(){
        beforeEach(function(){
          spyOn(chatChannel,'trigger');
          chatChannel.currentUser = user;
          chatChannel.activeChats[dataAnotherUser.userDest.id] = 'example_chat';
          chatChannel.connection.channels[chatChannel.activeChats[dataAnotherUser.userDest.id]] = {trigger: jasmine.createSpy()};
          chatChannel.sendReceiveChatMsg(dataAnotherUser);
        });
        it('trigger message to channel and stop propagation',function(){
          expect(chatChannel.connection.channels[chatChannel.activeChats[dataAnotherUser.userDest.id]].trigger).toHaveBeenCalledWith('msg_channel',
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
        chatChannel.currentUser = user;
        chatChannel.chatAccepted(dataAcceptor);
        expect(chatChannel.trigger).toHaveBeenCalledWith('chat_accepted',dataAcceptor.userAcceptor);
      });
      it('creates a channel specific for both user',function(){
        chatChannel.currentUser = user;
        dataAcceptor.chatChannelName = 'msg_chat_channel_' + dataAcceptor.userDest.id + '_' + dataAcceptor.userAcceptor.id;
        chatChannel.chatAccepted(dataAcceptor);

        expect(chatChannel.connection.subscribeChannel).toHaveBeenCalledWith(
          'msg_chat_channel_' + dataAcceptor.userDest.id + '_' + dataAcceptor.userAcceptor.id,
          'msg_channel',
          chatChannel.sendReceiveChatMsg
        );
        delete dataAcceptor.chatChannelName;
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
