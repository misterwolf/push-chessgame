//= require socket/MainChannel.js

(function(mainChannel){
  'use strict';

  var opts = {};
  var connection = null;
  var user = {id:'test-id',name:'test-name'};
  var anotherUser = {id:'test-another-id',name:'test-name'};
  var channel_name = 'channel_name',
    channel_event = 'event_example',
    onTrigger = jasmine.createSpy();

  describe('the MainChannel module',function(){

    beforeEach(function(){
      var stubConnection = {
        dispatcher: function(){},
        init: function() {return this;},
        subscribeChannel: jasmine.createSpy(),
        start: jasmine.createSpy(),
        subscribe: jasmine.createSpy(),
        disconnect: jasmine.createSpy(),
        sendOnChannel: jasmine.createSpy()
      };
      mainChannel.connection = stubConnection;
    });

    describe('has a method init that',function(){
      it('set the logged user',function(){
        mainChannel.init(user, opts);
        expect(mainChannel.user).toBe(user);
      });
    });

    describe('has the method subscribeChannel that', function(){
      it('subscribes a channel',function(){
        mainChannel.subscribeChannel(channel_name, channel_event, onTrigger);
        expect(mainChannel.connection.subscribeChannel).toHaveBeenCalledWith(channel_name, channel_event, onTrigger);
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
      beforeEach(function(){
        mainChannel.init(user, opts);
        mainChannel.start();
      });

      it('should notify that user is connected',function(){
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
        setTimeout(function(){
          var request = jasmine.Ajax.requests.mostRecent();
          expect(request.url).toBe('play/get_all_clients');
          jasmine.Ajax.uninstall();
          done();
        },201);
      });

      it('subscribe internal channels',function(){
        expect(mainChannel.connection.subscribeChannel.calls.count()).toBe(2);
      });

    });

    describe('has the method newClientConnected that ',function(){ // next step, introduce promise
      it('should call evtManager.trigger if user isn\'t current user',function(){
        var data = {user: anotherUser};
        spyOn(mainChannel,'trigger');
        mainChannel.init(user, opts);
        mainChannel.newClientConnected(data);
        expect(mainChannel.trigger).toHaveBeenCalled();
      });
    });

    describe('has the method removeClientInfo that ',function(){ // next step, introduce promise
      it('should call evtManager.trigger',function(){
        var data = {user: user};
        spyOn(mainChannel,'trigger');
        mainChannel.removeClientInfo(data);
        expect(mainChannel.trigger).toHaveBeenCalled();
      });
    });
  });

})(window._chess.socket.mainChannel);
