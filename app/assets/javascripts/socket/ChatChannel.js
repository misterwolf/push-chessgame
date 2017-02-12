//= require lib/eventmanager

(function(chatChannel, connection, lib){
  'use strict';

  var dom = lib.dom;
  var json = lib.json;
  var ajax = lib.ajax;

  chatChannel.connection = connection;
  chatChannel.user = {};

  var evtManager = lib.evtManager;
  evtManager.set(chatChannel);

  chatChannel.init = function(user, opts){
    opts = opts || {};
    chatChannel.currentUser = user;
  };

  chatChannel.start = function(){
    var user = chatChannel.user;
    // THIS APPROACH MUST! CHANGE, OTHER WISE ALL USERS WILL RECEIVE THE REQUEST
    chatChannel.connection.subscribeChannel('request_chat_channel', 'chat_requested', chatChannel.onChatRequested);
    chatChannel.connection.subscribeChannel('request_chat_channel', 'chat_refused',   chatChannel.chatRefused);
    chatChannel.connection.subscribeChannel('request_chat_channel', 'chat_accepted',  chatChannel.chatAccepted);
    chatChannel.connection.subscribeChannel('request_chat_channel', 'msg_channel',  chatChannel.sendReceiveChatMsg); // in future a private channel!
  };

  // ALL METHODS HERE ARE INTENDED AS ONE FOR RECEIVE THE OTHER ONE FOR SENDING.
  // TWO METHODS ARE BOTH, sendChatMsg AND startChat.

  // SEND ----------------
  chatChannel.requestChat = function(userDest){ // THIS TRIGGER IS FIRED FROM MAIN.JS
    chatChannel.connection.channels.request_chat_channel.trigger('chat_requested',{userDest: userDest , userRequester: chatChannel.currentUser });
  };
  chatChannel.refuseChat = function(userDest){
    chatChannel.connection.channels.request_chat_channel.trigger('chat_refused',  {userDest: userDest , userRefuser: chatChannel.currentUser });
  };
  chatChannel.acceptChat = function(userDest){
    chatChannel.connection.channels.request_chat_channel.trigger('chat_accepted', {userDest: userDest , userAcceptor: chatChannel.currentUser });
  };
  // ------------------------

  // RECEIVE ----------------
  chatChannel.onChatRequested = function(data){
    if (data.userDest.id === chatChannel.currentUser.id){ // avoid to insert two time current user id
      chatChannel.trigger('chat_requested',data.userRequester);
    }
  };
  chatChannel.chatAccepted = function(data){
    if (data.userDest.id === chatChannel.currentUser.id){ // avoid to insert two time current user id
      chatChannel.trigger('chat_accepted',data.userAcceptor);
    }
  };
  chatChannel.chatRefused = function(data){
    chatChannel.trigger('chat_refused',data);
  };
  // ------------------------

  // BOTH ----------------
  chatChannel.sendReceiveChatMsg = function(data){
    if (data.userDest.id !== chatChannel.currentUser.id && data.msg.sent === 0){ // avoid to insert two time current user id
      data.msg.sent = 1;
      chatChannel.connection.channels.request_chat_channel.trigger('msg_channel', {userDest: data.userDest , userSender: chatChannel.currentUser, msg: data.msg }); // send
    } else {
      chatChannel.trigger('msg_channel', data); // receive
    }
  };
  // ------------------------

})(window._chess.socket.chatChannel = {}, window._chess.socket.connection, window._chess.lib );
