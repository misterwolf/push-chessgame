//= require namespace
//= require socket/namespace
//= require websocket_rails/main

(function(initializer){
  'use strict';

  initializer.dispatcher = null;

  initializer.init = function(/* params.url != ''*/){
    // TO DO: pass generic url to wWebSOcketRails(url).
    this.dispatcher = new WebSocketRails('localhost:3015/websocket');
  };

})(window._chess.socket.initializer = {});
