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

  mainChannel.promiseForNewClientConnected = null;
  mainChannel.promiseForCloseConnection = null;

  mainChannel.init = function(user, opts){
    opts = opts || {};
    // mainChannel.callbacks = opts.callbacks;
    mainChannel.user = user;

    // REDUCE THESE OPTIONS IN SIMPLEST HASHES!
    // mainChannel.channels_specs = {
    //   new_client_connected: {
    //     channelName: 'new_client_connected',
    //     events:{
    //       new_client_info: {
    //         event_name: 'new_client_info',
    //         bindFunction: function(data){
    //           mainChannel.newClientConnected(data,mainChannel.callbacks.new_client_connected);
    //         }
    //       }
    //     }
    //   },
    //   client_disconnected: {
    //     channelName: 'client_disconnected',
    //     events:{
    //       remove_client_info: {
    //         event_name: 'remove_client_info',
    //         bindFunction: function(data){
    //           mainChannel.removeClientInfo(data,mainChannel.callbacks.client_disconnected);
    //         }
    //       }
    //     }
    //   }
    // };
    //
    // opts.channels_specs = mainChannel.channels_specs;

    this.connection.init(opts,null);
  };

  mainChannel.subscribeChannel = function(channelSpec){
    this.connection.subscribe(channelSpec);
  };

  mainChannel.newClientConnected = function(data,cb){
    if (data.user.id != mainChannel.user.id){ // avoid to insert two time current user id
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
            mainChannel.getAllClients(data);
          }
        }
      );} , 200); // why? there is come callback anywhere? BECAUSE THIS IS NOT GOOD!!
    mainChannel.connection.sendOnChannel('new_client_connected',
      {
        event_name: 'new_client_info', // no good: generic
        message:{ user: mainChannel.user }}
    );
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
