//= require websocket_rails/main
//= require namespace
//= require lib/namespace
//= require lib/ajax
//= require lib/json
//= require lib/eventmanager
//= require lib/dom
//= require socket/namespace
//= require ui/namespace

(function(ui, mainChannel, lib){
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

  var dom = lib.dom;
  var evtManager = lib.evtManager;

  ui.mainChannel = mainChannel;
  ui.btns = {};

  ui.init = function(user, opts){
    opts = opts || {};

    currentUserId = user.id;

    if (!currentUserId){
      return null;
    }

    ui.btns.connect = dom.id(DIV_ID_CONNECT);
    ui.btns.close = dom.id(DIV_ID_CLOSE);

    disableBtns();
    enableBtn(ui.btns.connect);

    dom.addEventListener(ui.btns.connect, 'click', bindConnect);
    dom.addEventListener(ui.btns.close,   'click', setCloseState);

    // move them in another channel file
    // dom.addEventListener(ui.btns.request_chat, 'click', bindRequestChat);
    // dom.addEventListener(ui.btns.request_match, 'click', bindRequestMatch);
    // ui.btns.request_chat = dom.id(DIV_ID_REQUEST_MATCH);
    // ui.btns.request_match = dom.id(DIV_ID_REQUEST_CHAT);

    // establish connection with emit manager
    evtManager.set(ui);
    ui.on('all_clients_received',ui.addInfoNewClients);
    ui.on('new_client_connected',ui.addInfoNewClient);
    ui.on('client_disconnected', ui.removeUser);
    ui.on('on_open',ui.setInitialState);
  };

  // ui.registerPromise = function(promise, success, error){
  //   promise.then(
  //     function fullFilled(data){
  //       success(data);
  //     },
  //     function rejected(data){
  //       error();
  //     }
  //   );
  // };

  ui.setInitialState = function(){
    removeSpinner(ui.btns.connect);
    fillGeneralMessage(MESSAGE_FOR_WELCOME);
    enableBtns();
    disableBtn(ui.btns.connect);
  };

  ui.addInfoNewClients = function(users){
    users = users || {};
    for (var user in users){
      ui.addInfoNewClient(users[user]);
    }
  };

  ui.addInfoNewClient = function(user){
    user = user || {};
    addInfoUser(user);
  };

  ui.removeUser = function(userId){
    dom.remove( dom.id(userId) );
  };

  // private methods
  var addInfoUser = function(user){
    var elem = dom.createElement('div', user.id);
    elem.innerHTML = user.name;
    var target = dom.id(DIV_ID_CONTAINER_ALL_CLIENTS);
    dom.insertElement(elem,target);
  };

  var fillGeneralMessage = function(msg){
    dom.id(DIV_ID_GENERAL_MESSAGE_USER).innerHTML = msg;
  };
  function emptyAllClients(){
    dom.id(DIV_ID_CONTAINER_ALL_CLIENTS).innerHTML = '';
  }

  function disableBtn(btn){
    btn.classList.remove('enabled');
    btn.classList.remove('state-on');
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

  function bindConnect(evt){
    addSpinner(ui.btns.connect);
    ui.mainChannel.start();
  }

  function setCloseState(evt){
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

})(window._chess.ui.main = {}, window._chess.socket.mainChannel, window._chess.lib);
