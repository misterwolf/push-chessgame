//= require socket/MainChannel.js

(function(mainChannel){
  'use strict';

  var opts = {};
  var connection = null;
  var data = {user: 1};
  var user = {id:'test-id',name:'test-name'};
  var currentUserId = 'my-test-id';

  describe('the MainChannel module',function(){

    beforeEach(function(){
      var stubConnection = {
        dispatcher: function(){},
        init: function() {return this;},
        start: jasmine.createSpy(),
        disconnect: jasmine.createSpy(),
        sendOnChannel: jasmine.createSpy()
      };

      opts = {
        callbacks: {
          new_client_connected: jasmine.createSpy(),
          get_all_clients: jasmine.createSpy(),
          client_disconnected: jasmine.createSpy()
        }
      };
      mainChannel.connection = stubConnection;

    });

    describe('has a method init that',function(){

      it('initialize a connection object',function(){
        mainChannel.init(user, currentUserId, opts);
        expect(mainChannel.connection).toBeDefined();
      });

    });

    describe('has a method closeConnection that',function(){

      it('advice server that current client is gone and call callback',function(done){
        var cb = jasmine.createSpy();
        mainChannel.closeConnection(cb);
        setTimeout(
          function(){
            expect(mainChannel.connection.disconnect).toHaveBeenCalled();
            expect(mainChannel.connection.sendOnChannel).toHaveBeenCalledWith(
              'client_disconnected',
              {
                event_name: 'remove_client_info',
                message: {
                  user: mainChannel.user.id
                }
              }
            );
            expect(cb).toHaveBeenCalled();
            done();
          },201);
      });
    });

    describe('start()',function(){

      it('should call connection.start',function(){
        mainChannel.init(user, currentUserId, opts);
        mainChannel.start();
        expect(mainChannel.connection.start).toHaveBeenCalled();
      });

      it('should notify that user is connected',function(){
        mainChannel.init(user, currentUserId, opts);
        mainChannel.start();
        expect(mainChannel.connection.sendOnChannel).toHaveBeenCalledWith(
          'new_client_connected',
          {
            event_name: 'new_client_info',
            message: {
              user: mainChannel.user
            }
          }
        );
      });

      it('should send request for get all clients',function(done){
        jasmine.Ajax.install();
        mainChannel.init(user, currentUserId, opts);
        mainChannel.start();
        setTimeout(function(){
          var request = jasmine.Ajax.requests.mostRecent();
          expect(request.url).toBe('play/get_all_clients');
          jasmine.Ajax.uninstall();
          done();
        },201);
      });

    });
    describe('has channels where ',function(){
      // these are hard to test:
      // test if callback is called with data
      // test is internal callback is called ( cb(data) )
      var channels_specs = null;
      beforeEach(function(){
        mainChannel.init(user, currentUserId, opts);
        channels_specs = mainChannel.channels_specs;
      });

      describe('the newClientConnected() has the ',function(){
        describe('event new_client_info that', function(){
          it('should be called with options',function(){
            spyOn(mainChannel, 'newClientConnected');
            channels_specs.new_client_connected.events.new_client_info.bindFunction(data);
            expect(mainChannel.newClientConnected).toHaveBeenCalledWith(data,opts.callbacks.new_client_connected);
          });
          it('should call callback',function(){
            channels_specs.new_client_connected.events.new_client_info.bindFunction(data);
            expect(opts.callbacks.new_client_connected).toHaveBeenCalledWith(data.user);
          });
        });
      });

      // describe('getAllClients()',function(){
      //   it('should be called with options',function(){
      //     spyOn(mainChannel, 'getAllClients');
      //     channels_specs.get_all_clients.events.all_clients_info.bindFunction(data);
      //     expect(mainChannel.getAllClients).toHaveBeenCalledWith(data,opts.callbacks.get_all_clients);
      //   });
      //   it('should call callback',function(){
      //     channels_specs.get_all_clients.events.all_clients_info.bindFunction(data);
      //     expect(opts.callbacks.get_all_clients).toHaveBeenCalledWith(data);
      //   });
      // });

      describe('removeClientInfo()',function(){
        it('should be called with options',function(){
          spyOn(mainChannel, 'removeClientInfo');
          channels_specs.client_disconnected.events.remove_client_info.bindFunction(data);
          expect(mainChannel.removeClientInfo).toHaveBeenCalledWith(data,opts.callbacks.client_disconnected);
        });
        it('should call callback',function(){
          channels_specs.client_disconnected.events.remove_client_info.bindFunction(data);
          expect(opts.callbacks.client_disconnected).toHaveBeenCalledWith(data.user);
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
