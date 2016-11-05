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
  var channels_specs = null;
  connection.url = 'localhost:3000/websocket';
  connection.dispatcher = null;
  connection.opened = false;
  connection.channels = [];
  connection.callbacks = null;

  connection.init = function(params, cb){
    params = params || {}; // we can put into also all the channel provided by server.
    channels_specs = params.channels_specs;
    if (params.url) {
      connection.url = params.url;
    }
    if (!channels_specs) { return; }
    connection.callbacks = params.callbacks;
    return this;
  };

  connection.start = function(cb){
    if (!connection.dispatcher){
      connection.dispatcher = new WebSocketRails(connection.url);
      subscribeAndBindChannels(channels_specs);
      addMainCallbacks(connection.callbacks.on_open,connection.callbacks.connection_closed,null);
    }
  };

  var subscribeAndBindChannels = function(channels_specs){
    for (var channel_specs in channels_specs){
      channel_specs = channels_specs[channel_specs];
      var channel_name = channel_specs.channelName; // remove this
      connection.channels[channel_name] = connection.dispatcher.subscribe(channel_name);
      var events = channel_specs.events;

      for (var event in events){
        connection.channels[channel_name].bind(
          events[event].event_name,
          events[event].bindFunction
        ); // how to test?
      }
    }
  };

  var addMainCallbacks = function(on_open,connection_closed,connection_error){
    var dispatcher = connection.dispatcher;
    connection.dispatcher.on_open = on_open;
    connection.dispatcher.connection_closed = connection_closed ;
    connection.dispatcher.connection_error = connection_error ;
  };

  connection.sendOnChannel = function(channel, params){
    params = params || {};
    setTimeout( // why? there is come callback anywhere?
      function(){
        connection.channels[channel].trigger(params.event_name, params.message);
      },
    150);
  };

  connection.disconnect = function(data){
    connection.dispatcher.disconnect();
    connection.dispatcher = null;
    // connection.dispatcher.close();
  };

  connection.unsubscribeChannel = function(channel){
    connection.channels[channel].destroy();
  };

  connection.receive = function(){
    // TO DO:
  };

})(window._chess.socket.connection = {}, window._chess.lib.dom);
