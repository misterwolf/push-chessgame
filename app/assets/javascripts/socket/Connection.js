//= require websocket_rails/main
//= require namespace
//= require socket/namespace

(function(connection){
  'use strict';

  connection.dispatcher = null;
  connection.opened = false;

  connection.init = function(params, cb){
    params = params || {};
    if (typeof params.url !== 'string' && params.url === '') { return;}
    this.dispatcher = new WebSocketRails(params.url);
    var channel = this.dispatcher.subscribe('new_client_connected');

    // var channel = dispatcher.subscribe('new_client_connected');
    connection.dispatcher.on_open = onOpen;
    connection.dispatcher.connection_closed = onClose;
    connection.dispatcher.connection_error = onError;

    channel.bind('new_client_connected', function(data) {
      console.log('channel event received: ' + data);
    });

    if (cb){
      cb();
    }
  };

  var onOpen = function(data){
    // TO DO: do we have to alert user for init connection?
  };

  var onClose = function(){
    // TO DO:
     console.log('HELLO')
  };

  var onError = function(data){
    console.log('on error' + data);
  };

  connection.send = function(){
    // TO DO:
  };

  connection.receive = function(){
    // TO DO:
  };

})(window._chess.socket.connection = {});
