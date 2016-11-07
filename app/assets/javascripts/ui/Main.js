//= require websocket_rails/main
//= require namespace
//= require lib/namespace
//= require lib/ajax
//= require lib/json
//= require lib/dom
//= require socket/namespace
//= require ui/namespace

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
  ui.dom = dom;

  ui.btns = {};

  ui.init = function(user, opts){
    opts = opts || {};

    currentUserId = user.id;

    if (!currentUserId){
      return null;
    }

    opts.callbacks = {
      get_all_clients: ui.addInfoNewClients,
      new_client_connected: ui.addInfoNewClient,
      client_disconnected: ui.removeUser,
      on_open: ui.onOpen,
      // connection_closed: ui.onClose
    };

    ui.btns.connect = dom.id(DIV_ID_CONNECT);
    ui.btns.close = dom.id(DIV_ID_CLOSE);
    // move them in another channel file
    // ui.btns.request_chat = dom.id(DIV_ID_REQUEST_MATCH);
    // ui.btns.request_match = dom.id(DIV_ID_REQUEST_CHAT);

    // TO DO: (note: **** )
    // write a great module that remove event listener,
    // keeps it and reattach again when element is active again
    // if (evt.target.className.match(/enabled/)){

    ui.btns.connect.fn = bindConnect;
    ui.btns.close.fn = bindClose;

    disableBtns();
    enableBtn(ui.btns.connect);

    // dom.addEventListener(ui.btns.connect, 'click', bindConnect);
    // dom.addEventListener(ui.btns.close,   'click', bindClose);
    // move them in another channel file
    // dom.addEventListener(ui.btns.request_chat, 'click', bindRequestChat);
    // dom.addEventListener(ui.btns.request_match, 'click', bindRequestMatch);

    ui.mainChannel.init(user, currentUserId, opts);

  };

  ui.onOpen = function(){
    removeSpinner(ui.btns.connect);
    fillGeneralMessage(MESSAGE_FOR_WELCOME);
    // addInfoUser(currentUserId);
    enableBtns();
    disableBtn(ui.btns.connect,bindConnect);
  };

  // ui.onClose = function(){
  //   fillGeneralMessage(MESSAGE_FOR_GOODBYE);
  //   ui.removeUser(currentUserId);
  //   disableBtns();
  //   enableBtn(ui.btns.connect);
  // };

  ui.addInfoNewClients = function(users){
    users = users || {};
    for (var user in users){
      ui.addInfoNewClient(users[user]);
    }
  };

  ui.addInfoNewClient = function(user){
    // TO DO: try catch!
    user = user || {};
    addInfoUser(user);
  };

  ui.removeUser = function(userId){
    dom.remove( dom.id(userId) );
  };

  function emptyAllClients(){
    dom.id(DIV_ID_CONTAINER_ALL_CLIENTS).innerHTML = '';
  }

  function disableBtn(btn){
    btn.classList.remove('enabled');
    btn.classList.add('disabled');
    dom.removeEventListener(btn, 'click', btn.fn, true);
  }

  function enableBtn(btn){
    btn.classList.add('enabled');
    btn.classList.remove('disabled');
    dom.addEventListener(btn, 'click', btn.fn);
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

  function bindConnect(evt){
    addSpinner(ui.btns.connect);
    ui.mainChannel.start();
  }

  function bindClose(evt){
    fillGeneralMessage(MESSAGE_FOR_GOODBYE);
    addSpinner(ui.btns.close);
    emptyAllClients();
    disableBtns();
    enableBtn(ui.btns.connect);
    ui.mainChannel.closeConnection();
  }
  // these two functions will be moved in another channel file
  // function bindRequestChat(){
  //   ui.mainChannel.requestChat();
  // }
  // function bindRequestMatch(){
  //   ui.mainChannel.requestMatch();
  // }

  // callbacks ----
  var fillGeneralMessage = function(msg){
    dom.id(DIV_ID_GENERAL_MESSAGE_USER).innerHTML = msg;
  };

  var addInfoUser = function(user){
    var elem = dom.createElement('div', user.id);
    elem.innerHTML = '<p>' + user.name + '</p>';
    var target = dom.id(DIV_ID_CONTAINER_ALL_CLIENTS);
    dom.insertElement(elem,target);
  };

})(window._chess.ui.main = {}, window._chess.socket.mainChannel, window._chess.lib.dom);
