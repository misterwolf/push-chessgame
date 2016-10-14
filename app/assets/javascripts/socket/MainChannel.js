//= require websocket_rails/main
//= require namespace
//= require socket/namespace
//= require socket/Connection
//= require lib/dom

(function(mainChannel, dom){

  // var Mainsocket = function(){

  // DEFAULT VALUES.
  var DIV_ID_GENERAL_MESSAGE_USER = 'general-message-user';
  var MESSAGE_FOR_WELCOME = 'Welcome!';
  var MESSAGE_FOR_GOODBYE = 'Goodbye!';
  var DIV_ID_CONTAINER_ALL_CLIENTS = 'all-clients';

  // var CHANNELS = [
  //   'new_client_connected',
  //   'get_all_clients',
  //   'client_disconnected
  // ];

  mainChannel.channels = {};

  var currentUserId = null;

  mainChannel.connection = null;

  mainChannel.init = function(opts){
    opts = opts || {};
    currentUserId = opts.currentUserId;

    if (!currentUserId){
      return null;
    }
    mainChannel.channels = {
      channels_specs: {
        new_client_connected: {
          channelName: 'new_client_connected',
          events:{
            eventName: 'new_client_info',
            bindFuction: addInfoNewClient
          }
        },
        get_all_clients: {
          channelName: 'get_all_clients',
          events:{
            eventName: 'all_clients_info',
            bindFuction: fecthAllClients
          }
        }
      }
    };
    this.connection = window._chess.socket.connection.init(mainChannel.channels,null);

  };

  var fecthAllClients = function(users){
    users = users || {};
    for (var user in users){
      addInfoNewClient(users[user]);
    }
  };

  var addInfoNewClient = function(user){
    // TO DO: try catch!
    user = user || {};
    addInfoUser(user.id);
  };

  // callbacks ----
  var fillGeneralMessage = function(msg){
    dom.id(DIV_ID_GENERAL_MESSAGE_USER).innerHTML = msg;
  };

  var addInfoUser = function(userId){
    var elem = dom.createElement('div', userId);
    var target = dom.id(DIV_ID_CONTAINER_ALL_CLIENTS);
    dom.insertElement(elem,target);
  };

  var removeItem = function(){
    dom.remove( dom.id(currentUserId) );
  };

  mainChannel.onOpen = function(){
    fillGeneralMessage(MESSAGE_FOR_WELCOME);
    addInfoUser(currentUserId);
  };

  mainChannel.onClose = function(){
    fillGeneralMessage(MESSAGE_FOR_GOODBYE);
    removeItem();
  };

  // };

  // window._chess.socket.MainSocket = MainSocket;

})(window._chess.socket.mainChannel = {}, window._chess.lib.dom);
