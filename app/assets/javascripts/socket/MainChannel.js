//= require websocket_rails/main
//= require namespace
//= require socket/namespace
//= require socket/Connection
//= require lib/dom

(function(mainChannel, connection, dom){
  'use strict';
  // var Mainsocket = function(){

  mainChannel.connection = null;
  mainChannel.currentUserId = null;

  mainChannel.init = function(opts){
    // opts = opts || {};
    var callbacks = opts.callbacks;
    mainChannel.currentUserId = opts.currentUserId;

    mainChannel.channels_specs = {
      new_client_connected: {
        channelName: 'new_client_connected',
        events:{
          new_client_info: {
            event_name: 'new_client_info',
            bindFunction: function(data){
              mainChannel.newClientConnected(data,callbacks.new_client_connected);
            }
          }
        }
      },
      get_all_clients: {
        channelName: 'get_all_clients',
        events:{
          all_clients_info: {
            event_name: 'all_clients_info',
            bindFunction: function(data){
              mainChannel.getAllClients(data,callbacks.get_all_clients);
            }
          }
        }
      },
      client_disconnected: {
        channelName: 'client_disconnected',
        events:{
          remove_client_info: {
            event_name: 'remove_client_info',
            bindFunction: function(data){
              mainChannel.removeClientInfo(data,callbacks.client_disconnected);
            }
          }
        }
      }
    };

    opts.channels_specs = mainChannel.channels_specs;

    this.connection = connection.init(opts,null);
  };

  mainChannel.newClientConnected = function(data,cb){
    cb(data.user);
  };

  mainChannel.getAllClients = function(data,cb){
    cb(data.users);
  };

  mainChannel.removeClientInfo = function(data,cb){
    cb(data.user);
  };

  mainChannel.start = function(){
    this.connection.start({on_open: function(){
        console.log('before send');
        mainChannel.connection.sendOnChannel('new_client_connected', {event_name: 'new_client_info', message:{ user: {id:mainChannel.currentUserId, name: 'Andrea'}}});
      }
    });
  };

  mainChannel.closeConnection = function(){
    // this.connection = null; try also this
    this.connection.disconnect();
  };

  // };

  // window._chess.socket.MainSocket = MainSocket;

})(window._chess.socket.mainChannel = {}, window._chess.socket.connection, window._chess.lib.dom);
