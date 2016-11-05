//= require websocket_rails/main
//= require namespace
//= require socket/namespace
//= require socket/Connection
//= require lib/dom
//= require lib/ajax

(function(mainChannel, connection, lib){
  'use strict';
  // var Mainsocket = function(){
  var dom = lib.dom;
  var json = lib.json;
  var ajax = lib.ajax;

  mainChannel.connection = connection;
  mainChannel.user = {};
  mainChannel.callbacks = null;
  mainChannel.currentUserId = null;
  mainChannel.init = function(user, currentUserId, opts){
    // opts = opts || {};
    mainChannel.currentUserId = currentUserId;
    mainChannel.callbacks = opts.callbacks;
    mainChannel.user = user;

    mainChannel.channels_specs = {
      new_client_connected: {
        channelName: 'new_client_connected',
        events:{
          new_client_info: {
            event_name: 'new_client_info',
            bindFunction: function(data){
              mainChannel.newClientConnected(data,mainChannel.callbacks.new_client_connected);
            }
          }
        }
      },
      // get_all_clients: {
      //   channelName: 'get_all_clients',
      //   events:{
      //     all_clients_info: {
      //       event_name: 'all_clients_info',
      //       bindFunction: function(data){
      //         mainChannel.getAllClients(data,callbacks.get_all_clients);
      //       }
      //     }
      //   }
      // },
      client_disconnected: {
        channelName: 'client_disconnected',
        events:{
          remove_client_info: {
            event_name: 'remove_client_info',
            bindFunction: function(data){
              mainChannel.removeClientInfo(data,mainChannel.callbacks.client_disconnected);
            }
          }
        }
      }
    };

    opts.channels_specs = mainChannel.channels_specs;

    this.connection.init(opts,null);
  };

  mainChannel.newClientConnected = function(data,cb){
    if (data.user.id != mainChannel.currentUserId){ // for avoiding of insert two time current user id
      cb(data.user);
    }
  };

  mainChannel.getAllClients = function(data,cb){
    cb(data.users);
  };

  mainChannel.removeClientInfo = function(data,cb){
    cb(data.user);
  };

  mainChannel.start = function(){
    this.connection.start();
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
            mainChannel.getAllClients(data,mainChannel.callbacks.get_all_clients);
          }
        }
      );} , 200); // why? there is come callback anywhere?
    mainChannel.connection.sendOnChannel('new_client_connected',
    {
      event_name: 'new_client_info', // no good: generic
      message:{ user: mainChannel.user }}
    );
  };

  mainChannel.closeConnection = function(cb){
    // this.connection = null; try also this
    mainChannel.connection.sendOnChannel('client_disconnected',
    {
      event_name: 'remove_client_info',
      message:{ user: mainChannel.user.id }}
    );
    setTimeout(function(){
      mainChannel.connection.disconnect();
    },200);
    if (cb)
    {
      cb();
    }

  };

  // };

  // window._chess.socket.MainSocket = MainSocket;

})(window._chess.socket.mainChannel = {}, window._chess.socket.connection, window._chess.lib);
