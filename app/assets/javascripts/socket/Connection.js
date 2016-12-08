//= require lib/eventmanager
//= require lib/dom

(function(connection, lib){
  'use strict';

  var dom = lib.dom;
  var evtManager = lib.evtManager;

  connection.url = 'localhost:3000/websocket';
  connection.dispatcher = null;
  connection.opened = false;
  connection.channels = [];
  connection.callbacks = null;

  evtManager.set(connection);

  connection.init = function(params){
    params = params || {}; // we can put into also all the channel provided by server.
    if (params.url) {
      connection.url = params.url;
    }
  };

  connection.start = function(cb){
    if (!connection.dispatcher){
      connection.dispatcher = new WebSocketRails(connection.url);
      connection.addCallback('on_open',onOpen);
      connection.addCallback('connection_closed',connectionClosed);
      connection.addCallback('connection_error',connectionError);
    }
  };

  connection.addCallback = function(name,cb){
    connection.dispatcher[name] = cb;
  };

  function onOpen(){
    connection.trigger('on_open');
  }
  function connectionClosed(){
    connection.trigger('connection_closed');
  }
  function connectionError(){
    connection.trigger('connection_error');
  }

  connection.subscribeChannel = function(channelName,eventName,onTrigger){
    // waitForState('connected', function(){
      connection.channels[channelName] = connection.dispatcher.subscribe(channelName);
      connection.channels[channelName].bind(eventName,onTrigger);
    // });

  };

  connection.sendOnChannel = function(channel, params){
    params = params || {};
    // setTimeout( function() { // why? there is come callback anywhere?
    waitForState('connected', function(){
        connection.channels[channel].trigger(params.event_name, params.message);
      }
    );

  };

  var waitForState = function( state, cb){
    var interval = setInterval(function(){
      if (connection.dispatcher.state === state){
        if (cb) {
          cb();
        }
        clearInterval(interval);
      }
    }, 100);
  };

  connection.disconnect = function(data){
    connection.dispatcher.disconnect();
    connection.dispatcher = null;
  };

  connection.unsubscribeChannel = function(channel){
    connection.channels[channel].destroy();
  };

  connection.receive = function(){
    // TO DO:
  };

})(window._chess.socket.connection = {}, window._chess.lib);
