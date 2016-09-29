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

  connection.init = function(params, cb){
    params = params || {}; // we can put into also all the channel provided by server.
    channels = params.channels || '';
    if (typeof params.url !== 'string' && params.url === '') { return; }
    if (!channels) { return; }
    connection.dispatcher = new WebSocketRails(params.url);
    connection.state = 'connecting';
    connection.subscribeAndBindChannels();
    connection.addCallbacks(params.callbacks);

  };

  connection.subscribeAndBindChannels = function(){
    for (var i = 0; i < channels.length; i++){
      var channel = channels[i];
      connection.channels[channel] = connection.dispatcher.subscribe(channel);
      connection.channels[channel].bind(channel, cbBindChannel.bind(this, channel));
    }
  };

  var cbBindChannel = function(channel,data){
    console.log(channel + ' event received: ' + data);
  };

  connection.addCallbacks = function(cbs){
    var dispatcher = connection.dispatcher;
    dispatcher.on_open = cbs.on_open;
    dispatcher.connection_closed = cbs.on_close;
    dispatcher.connection_error = cbs.on_error;
  };

  connection.disconnect = function(data){
    connection.dispatcher.connection_closed();
  };

  // connection.on_open = function(data){
  //   connection.state = 'opened';
  //
  //   var successConnection = function(opts){ // MOVE THIS FUNCTION IN ANOTHER CLASS
  //     opts = opts || {};
  //     dom.id(connection.DIV_ID_WELCOME_USER).innerHTML = connection.MESSAGE_FOR_WELCOME;
  //     var elem = dom.createElement('div',userId);
  //     var target = dom.id('all_clients');
  //     dom.insertElement(elem,target);
  //   };
  //   successConnection();
  // };
  //
  // connection.on_close = function(){
  //   connection.state = 'closed';
  //
  //   var elem = dom.id(connection.DIV_ID_GOODBYE_USER);
  //   elem.innerHTML = connection.MESSAGE_FOR_GOODBYE;
  //   var elemToRemove = dom.id(userId);
  //   dom.remove(elemToRemove);
  // };

  connection.on_error = function(data){
    console.log('on error' + data);
  };

  connection.send = function(params){
    params = params || {};
    // channel.trigger('event_name', params);
    // TO DO:
  };
  connection.unsubscribeChannel = function(channel){
    connection.channels[channel].destroy();
  };

  connection.receive = function(){
    // TO DO:
  };

})(window._chess.socket.connection = {}, window._chess.lib.dom);
