//= require websocket_rails/main
//= require namespace
//= require socket/namespace
//= require lib/dom

(function(connection, dom){
  'use strict';

  // TO DO:
  // 1 IN FUTURE DELETE THE WELCOME AND GOOD BYE MESSAGES
  // 2 MOVE ALL THE HTML REFERENCES FROM THIS FILE IN ANOTHER SEPARATE ONE.
  // 2.1 LIKE: CONSTANTS AND DOM.ID|CLASSES!
  // 2.2 IT COULD BE A GOOD IDEA AND THIS IMPLIES TO STUB OBJECTS IN TEST SUITE!
  // 2.3 naturally, it's better that elements id must be variables.
  connection.DIV_ID_WELCOME_USER = 'welcome_user';
  connection.DIV_ID_GOODBYE_USER = 'goodbye_user';
  connection.CONTAINER_ALL_CLIENTS = 'all_clients';

  connection.MESSAGE_FOR_WELCOME = 'Welcome user! :)';
  connection.MESSAGE_FOR_GOODBYE = 'Goodbye user! :)';
  // ----
  var userId = null;

  connection.dispatcher = null;
  connection.opened = false;
  connection.channel_new_client_connected = null;
  connection.channel_get_all_clients = null;

  connection.init = function(params){
    params = params || {};
    userId = params.user_id;
    if (userId) {return;}
    if (typeof params.url !== 'string' && params.url === '') { return;}
    this.dispatcher = new WebSocketRails(params.url);
    var channel = this.dispatcher.subscribe('new_client_connected');

    connection.dispatcher.on_open = onOpen;
    connection.dispatcher.connection_closed = onClose;
    connection.dispatcher.connection_error = onError;

    connection.channel_new_client_connected = connection.dispatcher.subscribe('new_client_connected');
    connection.channel_get_all_clients = connection.dispatcher.subscribe('get_all_clients');

    connection.channel_new_client_connected.bind('new_client_connected', function(data) {
      console.log('channel event received: ' + data);
    });

    connection.channel_get_all_clients.bind('get_all_clients', function(data) {
      console.log('channel event received: ' + data);
    });

  };

  connection.disconnect = function(data){
    connection.dispatcher.connection_closed();
  };

  var onOpen = function(data){
    dom.id(connection.DIV_ID_WELCOME_USER).innerHTML = connection.MESSAGE_FOR_WELCOME;
    var elem = dom.createElement('div',userId);
    var target = dom.id('all_clients');
    dom.insertElement(elem,target);
  };

  var onClose = function(){
    var elem = dom.id(connection.DIV_ID_GOODBYE_USER);
    elem.innerHTML = connection.MESSAGE_FOR_GOODBYE;
    var elemToRemove = dom.id(userId);
    dom.remove(elemToRemove);
  };

  var onError = function(data){
    console.log('on error' + data);
  };

  connection.send = function(params){
    params = params || {};
    // TO DO:
  };

  connection.receive = function(){
    // TO DO:
  };

})(window._chess.socket.connection = {}, window._chess.lib.dom);
