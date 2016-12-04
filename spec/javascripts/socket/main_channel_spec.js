//= require socket/MainChannel.js

(function(mainChannel){
  'use strict';

  var opts = {};
  var connection = null;
  var user = {id:'test-id',name:'test-name'};
  var anotherUser = {id:'test-another-id',name:'test-name'};
  var channelTest = {name: 'test-channel', eventName: 'test-event', cb: jasmine.createSpy()};

  describe('the MainChannel module',function(){

    beforeEach(function(){
      var stubConnection = {
        dispatcher: function(){},
        init: function() {return this;},
        start: jasmine.createSpy(),
        subscribe: jasmine.createSpy(),
        disconnect: jasmine.createSpy(),
        sendOnChannel: jasmine.createSpy()
      };

      // opts = {
      //   callbacks: {
      //     new_client_connected: jasmine.createSpy(),
      //     get_all_clients: jasmine.createSpy(),
      //     client_disconnected: jasmine.createSpy()
      //   }
      // };
      mainChannel.connection = stubConnection;

    });

    describe('has a method init that',function(){
      it('initialize a connection object',function(){
        mainChannel.init(user, opts);
        expect(mainChannel.connection).toBeDefined();
      });
      it('set the logged user',function(){
        mainChannel.init(user, opts);
        expect(mainChannel.user).toBe(user);
      });
    });

    // NEW VERSION
    describe('has the method subscribeChannel that', function(){
      it('subscribes a channel',function(){
        mainChannel.subscribeChannel(channelTest);
        expect(mainChannel.connection.subscribe).toHaveBeenCalled();
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
          },201); // no good
      });
    });

    describe('start()',function(){

      it('should call connection.start',function(){
        mainChannel.init(user, opts);
        mainChannel.start();
        expect(mainChannel.connection.start).toHaveBeenCalled();
      });

      it('should notify that user is connected',function(){
        mainChannel.init(user, opts);
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
        mainChannel.init(user, opts);
        mainChannel.start();
        setTimeout(function(){
          var request = jasmine.Ajax.requests.mostRecent();
          expect(request.url).toBe('play/get_all_clients');
          jasmine.Ajax.uninstall();
          done();
        },201);
      });

    });

    describe('has the method newClientConnected that ',function(){ // next step, introduce promise
      it('should call callback if user isn\'t current user',function(){
        var data = {user: anotherUser};
        var cb = jasmine.createSpy();
        mainChannel.init(user, opts);
        mainChannel.newClientConnected(data,cb);
        expect(cb).toHaveBeenCalledWith(data.user);
      });
    });

    describe('has the method removeClientInfo that ',function(){ // next step, introduce promise
      it('should call callback',function(){
        var data = {user: user};
        var cb = jasmine.createSpy();
        mainChannel.removeClientInfo(data,cb);
        expect(cb).toHaveBeenCalledWith(data.user);
      });
    });
  });

})(window._chess.socket.mainChannel);
