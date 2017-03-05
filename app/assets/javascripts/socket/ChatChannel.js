//= require lib/eventmanager

(function(chatChannel, connection, lib){
  'use strict';

  var dom = lib.dom;
  var json = lib.json;
  var ajax = lib.ajax;

  chatChannel.connection = connection;
  chatChannel.user = {};
  chatChannel.activeChats = [];

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
  };

  // ALL METHODS HERE ARE INTENDED AS ONE FOR RECEIVE THE OTHER ONE FOR SENDING.
  // TWO METHODS ARE BOTH, sendChatMsg AND startChat.
  chatChannel.getActiveChat = function(id){
    return chatChannel.activeChats[id];
  };
  // SEND ----------------
  chatChannel.requestChat = function(userDest){ // THIS TRIGGER IS FIRED FROM MAIN.JS
    if (chatChannel.activeChats[userDest.id]){
      throw 'You already started a chat with ' + userDest.name;
    } else {
      var msgChatChannel = 'msg_chat_channel_' + userDest.id + '_' + chatChannel.currentUser.id;
      chatChannel.activeChats[userDest.id] = {channelName: msgChatChannel, completed: false, pending: true};
      chatChannel.connection.channels.request_chat_channel.trigger('chat_requested',{userDest: userDest , userRequester: chatChannel.currentUser });
    }
  };
  chatChannel.refuseChat = function(userDest){
    chatChannel.connection.channels.request_chat_channel.trigger('chat_refused',  {userDest: userDest , userRefuser: chatChannel.currentUser });
  };
  chatChannel.acceptChat = function(userDest){
    var msgChatChannel = 'msg_chat_channel_' + userDest.id + '_' + chatChannel.currentUser.id;
    chatChannel.activeChats[userDest.id] = {channelName: msgChatChannel, pending: false, completed: true};
    chatChannel.connection.channels.request_chat_channel.trigger('chat_accepted', {userDest: userDest , userAcceptor: chatChannel.currentUser, chatChannelName: msgChatChannel});
    chatChannel.connection.subscribeChannel(
      msgChatChannel,
      'msg_channel',
      chatChannel.sendReceiveChatMsg
    );

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
      chatChannel.activeChats[data.userAcceptor.id] = {channelName: data.chatChannelName, pending: false, completed: true};
      chatChannel.trigger('chat_accepted',data.userAcceptor); // acceptor == requester
      chatChannel.connection.subscribeChannel(
        data.chatChannelName,
        'msg_channel',
        chatChannel.sendReceiveChatMsg
      );
    }
  };
  chatChannel.chatRefused = function(data){
    chatChannel.trigger('chat_refused',data);
  };
  // ------------------------

  // BOTH ----------------
  chatChannel.sendReceiveChatMsg = function(data){
    if (data.userDest.id !== chatChannel.currentUser.id && data.msg.sent === 0){ // avoid to insert two time current user id
      // SEND
      data.msg.sent = 1;
      var dataToSend = {
        userDest: data.userDest,
        userSender: chatChannel.currentUser,
        msg: data.msg
      };
      chatChannel.connection.channels[chatChannel.activeChats[data.userDest.id].channelName].trigger('msg_channel', dataToSend);
      chatChannel.trigger('own_msg_channel', dataToSend);
    } else if (data.userDest.id === chatChannel.currentUser.id) {
      // RECEIVE
      chatChannel.trigger('msg_channel', data);
    }
  };
  // ------------------------

})(window._chess.socket.chatChannel = {}, window._chess.socket.connection, window._chess.lib );
