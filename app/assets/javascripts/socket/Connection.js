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

  connection.state = '';
  connection.dispatcher = null;
  connection.opened = false;
  connection.channels = [];

  connection.init = function(params, cb){
    params = params || {}; // we can put into also all the channel provided by server.
    channels_specs = params.channels_specs;
    if (!params.url) {
      params.url = 'localhost:3001/websocket';
    }
    if (!channels_specs) { return; }
    if (!connection.dispatcher){
      connection.dispatcher = new WebSocketRails(params.url);
    }
    connection.state = 'connecting';
    subscribeAndBindChannels(channels_specs);
    addMainCallbacks(params.callbacks);
    return this;
  };

  var subscribeAndBindChannels = function(channels_specs){
    for (var channel_specs in channels_specs){
      channel_specs = channels_specs[channel_specs];
      var channel_name = channel_specs.channel_name;
      connection.channels[channel_name] = connection.dispatcher.subscribe(channel_name);

      var events = channel_specs.events;
      var events_length = events_length;
      for (var j = 0; j < events_length; j++ ){
        connection.channels[channel_name].bind(
          events[j].event_name,
          events[j].bind_function.bind(this, channel_name)
        ); // how to test?
      }
    }
  };

  var addMainCallbacks = function(cbs){
    cbs = cbs || {};
    var dispatcher = connection.dispatcher;
    dispatcher.on_open = cbs.on_open || function(){};
    dispatcher.connection_closed = cbs.connection_closed || function(){};
    dispatcher.connection_error = cbs.connection_error || function(){};
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
