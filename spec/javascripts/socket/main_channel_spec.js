//= require socket/MainChannel.js

(function(mainChannel){
  'use strict';

  var opts = {};
  var connection = null;
  var data = {param1: 1};

  describe('MainChannel',function(){

    beforeEach(function(){
      var stubConnection = {
        dispatcher: function(){},
        init: function() {return this;},
        start: jasmine.createSpy(),
        sendOnChannel: jasmine.createSpy()
      };

      window._chess.socket.connection = stubConnection;

      opts = {
        currentUserId: 'test-id',
        callbacks: {
          new_client_connected: jasmine.createSpy(),
          get_all_clients: jasmine.createSpy(),
          client_disconnected: jasmine.createSpy()
        }
      };

    });

    describe('init()',function(){

      it('initialize a connection object',function(){
        mainChannel.init(opts);
        expect(mainChannel.connection).toBeDefined();
      });

    });

    describe('start()',function(){

      it('should call connection.start',function(){
        mainChannel.init(opts);
        mainChannel.start();
        expect(window._chess.socket.connection.start).toHaveBeenCalled();
      });

    });
    describe('channel',function(){
      // these are hard to test:
      // test if callback is called with data
      // test is internal callback is called ( cb(data) )
      var channels_specs = null;
      beforeEach(function(){
        mainChannel.init(opts);
        channels_specs = mainChannel.channels_specs;
      });

      describe('newClientConnected()',function(){
        describe('event new_client_info', function(){
          it('should be called with options',function(){
            spyOn(mainChannel, 'newClientConnected');
            channels_specs.new_client_connected.events.new_client_info.bindFunction(data);
            expect(mainChannel.newClientConnected).toHaveBeenCalledWith(data,opts.callbacks.new_client_connected);
          });
          it('should call callback',function(){
            channels_specs.new_client_connected.events.new_client_info.bindFunction(data);
            expect(opts.callbacks.new_client_connected).toHaveBeenCalledWith(data);
          });

          it('should send message to channel',function(){
            channels_specs.new_client_connected.events.new_client_info.bindFunction(data);
            expect(mainChannel.connection.sendOnChannel).toHaveBeenCalledWith('new_client_connected', {user: opts.currentUserId});
          });
        });
      });

      describe('getAllClients()',function(){
        it('should be called with options',function(){
          spyOn(mainChannel, 'getAllClients');
          channels_specs.get_all_clients.events.all_clients_info.bindFunction(data);
          expect(mainChannel.getAllClients).toHaveBeenCalledWith(data,opts.callbacks.get_all_clients);
        });
        it('should call callback',function(){
          channels_specs.get_all_clients.events.all_clients_info.bindFunction(data);
          expect(opts.callbacks.get_all_clients).toHaveBeenCalledWith(data);
        });
      });

      describe('removeClientInfo()',function(){
        it('should be called with options',function(){
          spyOn(mainChannel, 'removeClientInfo');
          channels_specs.client_disconnected.events.remove_client_info.bindFunction(data);
          expect(mainChannel.removeClientInfo).toHaveBeenCalledWith(data,opts.callbacks.client_disconnected);
        });
        it('should call callback',function(){
          channels_specs.client_disconnected.events.remove_client_info.bindFunction(data);
          expect(opts.callbacks.client_disconnected).toHaveBeenCalledWith(data);
        });
      });

      xdescribe('requestChat()', function(){          // a request to /socket?private_chat
        it('should do a request', function(){
        });
      });
    });

    // });
  });
})(window._chess.socket.mainChannel);
