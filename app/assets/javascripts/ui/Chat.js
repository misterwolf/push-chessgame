//= require websocket_rails/main
//= require namespace
//= require lib/namespace
//= require lib/ajax
//= require lib/json
//= require lib/eventmanager
//= require lib/dom
//= require socket/namespace
//= require ui/namespace
//= require ui/Modal

(function(chat, ui, socket, lib){
  'use strict';
  var ALL_CHAT_WINDOWS = 'chat-windows';
  var dom = lib.dom;

  chat.init = function(){
    var evtManager = lib.evtManager;
    evtManager.set(chat);    // establish connection with emit manager
    // FROM CHAT CHANNEL
    chat.on('chat_requested',chat.showModalForRequestChat);
    chat.on('chat_accepted', chat.chatAccepted);
    chat.on('chat_refused',  chat.chatRefused);
    chat.on('msg_channel',  chat.printMsg);
    chat.on('own_msg_channel',  chat.printOwnMsg);

    chat.modal = ui.modal;
    chat.chatChannel = socket.chatChannel;
  };

  // SEND in ----------------
  chat.acceptChat = function(data){
    chat.chatChannel.acceptChat(data);
    chat.startChat(data); // userDest and userAcceptor.
    chat.modal.hide();
  };
  chat.refuseChat = function(data){
    chat.chatChannel.refuseChat(data);
    chat.modal.hide();
  };
  // ------------------------

  // RECEIVE in ----------------
  chat.chatRefused = function(userRejecter){
    var htmlString =
                  '<div id="modal-description">' + userRejecter.name + ' has refused your chat!' + '</div>' +
                  '<div id="chat_accepted-nok" class="btn"> ok </div>';
    dom.insertInnerHTML(htmlString, chat.modal.modalElem() );
    dom.addEventListener(dom.id('chat_accepted-nok'), 'click', chat.modal.hide);
    chat.modal.show();
  };
  chat.chatAccepted = function(userAcceptor){
    var htmlString =
                  '<div id="modal-description">' + userAcceptor.name + ' has accepted your chat!' + '</div>' +
                  '<div id="chat_accepted-ok" class="btn"> start chat</div>';
    dom.insertInnerHTML(htmlString, chat.modal.modalElem() );
    dom.addEventListener(dom.id('chat_accepted-ok'), 'click', function(e){
      chat.modal.hide();
      chat.startChat(userAcceptor);
    });
    chat.modal.show();
  };
  // ------------------------

  // BOTH -------------------

  chat.printOwnMsg = function(data){
    var htmlString =
        '<div class="msg right message-to-user-' + data.userDest.id + '">' +
          data.msg.text +
        '</div>';
    var target = dom.id('chat-content-with-' + data.userDest.id);
    target.insertAdjacentHTML( 'beforeend', htmlString );
  };

  chat.printMsg = function(data){
    var htmlString =
        '<div class="msg left message-from-user-' + data.userSender.id + '">' +
          data.msg.text +
        '</div>';
    var target = dom.id('chat-content-with-' + data.userSender.id);
    target.insertAdjacentHTML( 'beforeend', htmlString );
  };

  chat.sendChatMsg = function(user){
    var chatMsg = dom.id('chat-message-for-' + user.id);
    var msg = chatMsg.value;
    var data = {
      userDest: user,
      msg: {
        sent: 0,
        text: msg
      }
    };
    chat.chatChannel.sendReceiveChatMsg(data);
    dom.id('chat-message-for-' + user.id).value = '';
  };
  // ------------------------

  chat.startChat = function(user){
    var htmlString =
        '<div class="window-chat" id="chat-container-with-' + user.id + '">' +
         '<div class="chat-name">' + user.name + '</div>' +
         '<div class="chat-content" id="chat-content-with-' + user.id + '"></div>' +
          '<div class="ui-button">' +
            '<input id="chat-message-for-' + user.id + '" class="chat-text-field" />' +
            '<span id="send-msg-to-' + user.id + '"> send </span>' +
          '</div>' +
        '</div>';
    dom.insertInnerHTML(htmlString, dom.id(ALL_CHAT_WINDOWS));
    dom.addEventListener(dom.id('send-msg-to-' + user.id), 'click', function(){chat.sendChatMsg(user);});
  };

  chat.showModalForRequestChat = function(userRequester){
    if (!userRequester){
      return;
    }
    // PASS THESE STRINGS TO MODAL CLASS.
    var htmlString =
    '<div id="modal-description">' + userRequester.name + ' wants chat with you, please choose:' + '</div>' +
    '<div id="accept-chat-from-' + userRequester.id + '" class="btn accept-chat"> Accept chat!</div>' +
    '<div id="refuse-chat-from-' + userRequester.id + '" class="btn refuse-chat"> Refuse chat!</div>';
    // move this and other html constructor to another file with static string    // ------
    dom.insertInnerHTML( htmlString, chat.modal.modalElem());
    dom.addEventListener(dom.id('accept-chat-from-' + userRequester.id), 'click', function(e){chat.acceptChat(userRequester);});
    dom.addEventListener(dom.id('refuse-chat-from-' + userRequester.id), 'click', function(e){chat.refuseChat(userRequester);});
    chat.modal.show();
  };

})(window._chess.ui.chat = {}, window._chess.ui, window._chess.socket, window._chess.lib);
