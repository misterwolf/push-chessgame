//= require lib/eventmanager

(function(mainChannel, connection, lib){
  'use strict';

  var dom = lib.dom;
  var json = lib.json;
  var ajax = lib.ajax;
  var evtManager = lib.evtManager;

  mainChannel.connection = connection;
  mainChannel.user = {};
  mainChannel.callbacks = null;
  mainChannel.currentUserId = null;

  evtManager.set(mainChannel);

  mainChannel.init = function(user, opts){
    opts = opts || {};
    mainChannel.user = user;
  };

  mainChannel.start = function(){

    mainChannel.connection.subscribeChannel('new_client_connected','new_client_info',   mainChannel.newClientConnected);
    mainChannel.connection.subscribeChannel('client_disconnected','remove_client_info', mainChannel.removeClientInfo);

    setTimeout(
      function(){
        ajax.send(
        'play/get_all_clients',
        '',
        {
          method: 'GET',
          type: 'json',
          headers: {
            Authorization: 'Basic aGl0czFfdTpoaXRzMV91cHdk'
          },
          async: true
        },
        function (err, data) {
          if (err) {
            console.log(err);
          } else {
            data = json.parse(data);
            data.users = json.parse(data.users);
            mainChannel.getAllClients(data);
          }
        }
      );}, 200); // why? there is come callback anywhere? BECAUSE THIS IS NOT GOOD!!
    mainChannel.connection.sendOnChannel('new_client_connected',
      {
        event_name: 'new_client_info', // no good: generic
        message:{ user: mainChannel.user }
      }
    );
  };

  mainChannel.subscribeChannel = function(channelName,eventName,onTrigger){
    this.connection.subscribeChannel(channelName,eventName,onTrigger);
  };

  mainChannel.newClientConnected = function(data){
    if (data.user.id != mainChannel.user.id){ // avoid to insert two time current user id
      mainChannel.trigger('new_client_connected', data.user);
    }
  };

  mainChannel.getAllClients = function(data){
    mainChannel.trigger('all_clients_received',data.users);
  };

  mainChannel.removeClientInfo = function(data){
    mainChannel.trigger('client_disconnected',data.user);
  };

  mainChannel.closeConnection = function(cb){
    // here we can introduce the Promise
    // this.connection = null; try also this
    mainChannel.connection.sendOnChannel('client_disconnected',
    {
      event_name: 'remove_client_info',
      message:{ user: mainChannel.user.id }}
    );
    setTimeout(function(){
      mainChannel.connection.disconnect();
      if (cb) {
        cb();
      }
    },200);

  };

  // };

  // window._chess.socket.MainSocket = MainSocket;

})(window._chess.socket.mainChannel = {}, window._chess.socket.connection, window._chess.lib);
