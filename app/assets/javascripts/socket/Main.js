//= require websocket_rails/main
//= require namespace
//= require socket/namespace
//= require socket/Connection
//= require lib/dom

(function(main){

  var MainInterface = function(){

    var currentUserId = null;
    this.state = null;
    var DIV_ID_WELCOME_USER = 'welcome_user';
    var DIV_ID_GOODBYE_USER = 'goodbye_user';
    var CONTAINER_ALL_CLIENTS = 'all_clients';

    var MESSAGE_FOR_WELCOME = 'Welcome user! :)';
    var MESSAGE_FOR_GOODBYE = 'Goodbye user! :)';

    var CHANNELS = [
      'new_client_connected',
      'get_all_clients'
    ];

    main.init = function(opts){
      opts = opts || {};

      currentUserId = opts.currentUserId;
      if (currentUserId === null){
        return;
      }

      this.state = 'initialized';
    };

    main.onOpen = function(opts){

    };

    main.onClose = function(){

    };

    main.init();

  };

  window._chess.socket.main = MainInterface;

})(window._chess.socket.main = {});
