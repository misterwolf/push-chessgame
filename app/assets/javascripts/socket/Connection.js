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

  connection.state = '';
  var channels = null;
  connection.dispatcher = null;
  connection.opened = false;
  connection.channels = [];

  connection.init = function(params, cb){
    params = params || {}; // we can put into also all the channel provided by server.
    channels = params.channels;
    if (typeof params.url !== 'string' && params.url === '') { return; }
    if (!channels) { return; }
    connection.dispatcher = new WebSocketRails(params.url);
    connection.state = 'connecting';
    subscribeAndBindChannels();
    addCallbacks(params.callbacks);
  };

  var subscribeAndBindChannels = function(){
    for (var i = 0; i < channels.length; i++){
      var channel = channels[i];
      connection.channels[channel] = connection.dispatcher.subscribe(channel);
      connection.channels[channel].bind(channel, cbBindChannel.bind(this, channel));
    }
  };

  var cbBindChannel = function(channel,data){
    console.log(channel + ' event received: ' + data);
  };

  var addCallbacks = function(cbs){
    var dispatcher = connection.dispatcher;
    dispatcher.on_open = cbs.on_open;
    dispatcher.connection_closed = cbs.connection_closed;
    dispatcher.connection_error = cbs.connection_error;
  };

  connection.sendOnChannel = function(channel, params){
    params = params || {};
    connection.channels[channel].trigger(params.event_name, params.message);
  };

  connection.disconnect = function(data){
    connection.dispatcher.connection_closed();
  };

  connection.unsubscribeChannel = function(channel){
    connection.channels[channel].destroy();
  };

  connection.receive = function(){
    // TO DO:
  };

})(window._chess.socket.connection = {}, window._chess.lib.dom);
