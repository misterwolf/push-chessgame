//= require websocket_rails/main
//= require namespace
//= require lib/namespace
//= require lib/ajax
//= require lib/json
//= require lib/eventmanager
//= require lib/dom
//= require socket/namespace
//= require ui/namespace

(function(main, modal, socket, lib){
  'use strict';

  var DIV_ID_CONNECT = 'connect-btn';
  var MODAL = 'myModal';
  var DIV_ID_CLOSE = 'close-btn';
  var DIV_ID_REQUEST_MATCH = 'request-match-btn';
  var DIV_ID_REQUEST_CHAT = 'request-chat-btn';

  var DIV_ID_GENERAL_MESSAGE_USER = 'general-message-user';
  var MESSAGE_FOR_WELCOME = 'Welcome!';
  var MESSAGE_FOR_GOODBYE = 'Goodbye!';
  var DIV_ID_CONTAINER_ALL_CLIENTS = 'all-clients';

  main.currentUser = null;

  var dom = lib.dom;
  var evtManager = lib.evtManager;

  main.mainChannel = socket.mainChannel;
  main.chatChannel = socket.chatChannel;
  main.connection = socket.connection;

  main.btns = {};

  // COMMON HTML
  main.init = function(user, opts){
    opts = opts || {};

    main.currentUser = user;

    if (!main.currentUser){
      return null;
    }

    main.btns.connect = dom.id(DIV_ID_CONNECT);
    main.btns.close = dom.id(DIV_ID_CLOSE);

    // buttons = dom.createElement('div', null, 'buttons');

    evtManager.set(main);    // establish connection with emit manager
    main.on('all_clients_received',main.addInfoNewClients);
    main.on('new_client_connected',main.addInfoNewClient);
    main.on('client_disconnected', main.removeUser);
    main.on('on_open',main.setInitialState);

    disableBtns();
    enableBtn(main.btns.connect);
    dom.addEventListener(main.btns.connect, 'click', bindConnect);
    dom.addEventListener(main.btns.close,   'click', setCloseState);
  };

  main.setInitialState = function(){
    removeSpinner(main.btns.connect);
    fillGeneralMessage(MESSAGE_FOR_WELCOME);
    enableBtns();
    disableBtn(main.btns.connect);
  };

  main.addInfoNewClients = function(users){
    users = users || {};
    for (var user in users){
      main.addInfoNewClient(users[user]);
    }
  };

  main.addInfoNewClient = function(user){
    user = user || {};
    addInfoUser(user);
  };

  main.removeUser = function(userId){
    dom.remove( dom.id('user-container-' + userId) );
  };

  // private methods
  var addInfoUser = function(user){
    var target = dom.id(DIV_ID_CONTAINER_ALL_CLIENTS);
    var id = user.id;
    var userId = user.id;
    var userName = (main.currentUser.id != user.id ? user.name : 'you');
    var buildButtons = (main.currentUser.id != user.id ? true : false);
    // sigle container
    var elem = '<div id="user-container-' + userId + '">' +
                '<div class="user-info">' + userName + '</div>';
    if (buildButtons) {
      // buttons container
      elem += '<div class="buttons">' +
                '<div id="request-match-to-' + userId + '" class="btn request-match">' +
                    'request match' +
                '</div>' +
               '<div id="request-chat-to-' + userId + '" class="btn request-chat">' +
                   'request chat' +
               '</div>' +
              '</div>';
    }
    elem += '</div>';
    // insert into general users container
    target.insertAdjacentHTML( 'beforeend', elem );
    // dom.insertInnerHTML(elem,target);
    var requestBtn = dom.id('request-chat-to-' + user.id );
    if (requestBtn){
      dom.addEventListener(requestBtn, 'click', socket.chatChannel.requestChat.bind(main,user));
    }
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
    for (var btn in main.btns){
      disableBtn(main.btns[btn]);
    }
  }
  function enableBtns(){
    for (var btn in main.btns){
      enableBtn(main.btns[btn]);
    }
  }

  function bindConnect(evt){
    addSpinner(main.btns.connect);
    // in this way modules are indipendents:
    main.connection.start();
    main.mainChannel.start();
    main.chatChannel.start();
  }

  function setCloseState(evt){
    fillGeneralMessage(MESSAGE_FOR_GOODBYE);
    addSpinner(main.btns.close);
    emptyAllClients();
    disableBtns();
    enableBtn(main.btns.connect);
    main.mainChannel.closeConnection();
  }

  function closeModal(){
    main.trigger('modal-closed'); // TO DO
    modal.classList.add('disabled');
    modal.classList.remove('enabled');
  }

})(window._chess.ui.main = {}, window._chess.ui.modal, window._chess.socket, window._chess.lib);
