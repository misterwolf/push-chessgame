//= require websocket_rails/main
//= require ui/namespace
//= require socket/MainChannel
//= require lib/dom

(function(ui, mainChannel, dom){
  'use strict';

  var DIV_ID_CONNECT = 'connect-btn';
  var DIV_ID_CLOSE = 'close-btn';
  var DIV_ID_REQUEST_MATCH = 'request-match-btn';
  var DIV_ID_REQUEST_CHAT = 'request-chat-btn';

  var DIV_ID_GENERAL_MESSAGE_USER = 'general-message-user';
  var MESSAGE_FOR_WELCOME = 'Welcome!';
  var MESSAGE_FOR_GOODBYE = 'Goodbye!';
  var DIV_ID_CONTAINER_ALL_CLIENTS = 'all-clients';

  var currentUserId = null;

  ui.mainChannel = mainChannel;

  // ui.close
  ui.btns = {
    connect: null,
    // close: null
    // request_match: null,
    // request_chat: null
  };

  ui.init = function(opts){
    opts = opts || {};

    currentUserId = opts.currentUserId;

    if (!currentUserId){
      return null;
    }

    opts.callbacks = {
      get_all_clients: ui.addInfoNewClients,
      new_client_connected: ui.addInfoNewClient,
      client_disconnected: ui.removeItem,
      on_open: ui.onOpen,
      connection_closed: ui.onClose
    };

    ui.btns.connect = dom.id(DIV_ID_CONNECT);
    ui.btns.close = dom.id(DIV_ID_CLOSE);
    // move them in another channel file
    // ui.btns.request_chat = dom.id(DIV_ID_REQUEST_MATCH);
    // ui.btns.request_match = dom.id(DIV_ID_REQUEST_CHAT);

    disableBtns();

    dom.addEventListener(ui.btns.connect, 'click', bindConnect);
    dom.addEventListener(ui.btns.close, 'click', bindClose);
    // move them in another channel file
    // dom.addEventListener(ui.btns.request_chat, 'click', bindRequestChat);
    // dom.addEventListener(ui.btns.request_match, 'click', bindRequestMatch);

    ui.mainChannel.init(opts);

  };

  ui.onOpen = function(){
    removeSpinner(ui.btns.connect);
    fillGeneralMessage(MESSAGE_FOR_WELCOME);
    // addInfoUser(currentUserId);
    enableBtns();
    disableBtn(ui.btns.connect);
  };

  ui.onClose = function(){
    fillGeneralMessage(MESSAGE_FOR_GOODBYE);
    ui.removeItem(currentUserId);
    disableBtns();
    enableBtn(ui.btns.connect);
  };

  ui.addInfoNewClients = function(users){
    users = users || {};
    for (var user in users){
      ui.addInfoNewClient(users[user]);
    }
  };

  ui.addInfoNewClient = function(user){
    // TO DO: try catch!
    user = user || {};
    addInfoUser(user.id);
  };

  ui.removeItem = function(userId){
    dom.remove( dom.id(userId) );
  };

  function disableBtn(btn){
    btn.classList.remove('enabled');
    btn.classList.add('disabled');
  }

  function enableBtn(btn){
    btn.classList.add('enabled');
    btn.classList.remove('disabled');
  }

  function addSpinner(btn){
    btn.classList.add('spinner');
  }

  function removeSpinner(btn){
    btn.classList.remove('spinner');
  }

  function disableBtns(){
    for (var btn in ui.btns){
      disableBtn(ui.btns[btn]);
    }
  }

  function enableBtns(){
    for (var btn in ui.btns){
      enableBtn(ui.btns[btn]);
    }
  }

  function bindConnect(){
    addSpinner(ui.btns.connect);
    ui.mainChannel.start();
  }
  function bindClose(){
    addSpinner(ui.btns.close);
    ui.mainChannel.closeConnection();
  }
  // these two functions will be moved in another channel file
  function bindRequestChat(){
    ui.mainChannel.requestChat();
  }
  function bindRequestMatch(){
    ui.mainChannel.requestMatch();
  }

  // callbacks ----
  var fillGeneralMessage = function(msg){
    dom.id(DIV_ID_GENERAL_MESSAGE_USER).innerHTML = msg;
  };

  var addInfoUser = function(userId){
    var elem = dom.createElement('div', userId);
    elem.innerHTML = '<p>' + userId + '</p>';
    var target = dom.id(DIV_ID_CONTAINER_ALL_CLIENTS);
    dom.insertElement(elem,target);
  };

})(window._chess.ui.main = {}, window._chess.socket.mainChannel, window._chess.lib.dom);
