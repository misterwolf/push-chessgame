//= require websocket_rails/main
//= require namespace
//= require lib/namespace
//= require lib/ajax
//= require lib/json
//= require lib/dom
//= require socket/namespace
//= require ui/Chat.js

(function(chat, dom){
  'use strict';
  chat.modal = {
    init: jasmine.createSpy(),
    show: jasmine.createSpy(),
    hide: jasmine.createSpy(),
    build: jasmine.createSpy(),
    modalElem:  function(){
      return dom.id('myModal');
    }
  };

  chat.chatChannel = {
    sendChatMsg: jasmine.createSpy(),
    refuseChat: jasmine.createSpy()
  };

  var userTest = {name:'test', id:'id-test'};

  describe('The Chat Interface ',function(){

    beforeEach(function(){
      loadFixtures('ui/elements.html');
    });

    describe('has a method init() that', function(){
      xit('handles specific events for chat',function(){
        chat.on('chat_requested',chat.showModalForRequestChat);
        chat.on('chat_accepted',chatAccepted);
        chat.on('chat_refused',chatRefused);
      });
    });

    describe('has a method acceptChat() that', function(){
      xit('hide modal comunicate with chat channel',function(){
      });
    });

    describe('has a method refuseChat() that', function(){
      it('hide modal and comunicate with chat channel',function(){
        chat.refuseChat({data: {}});
        expect(chat.modal.hide).toHaveBeenCalled();
        expect(chat.chatChannel.refuseChat).toHaveBeenCalledWith({data: {}});
      });
    });

    describe('has a method chatRefused() that', function(){
      it('show modal with proper message',function(){
        chat.chatRefused(userTest);
        expect($('#modal-description').text() == 'test has refused your chat!').toBe(true);
      });
      it('hide modal if user click ok',function(done){
        chat.chatRefused(userTest);
        $('#chat_accepted-nok').click();
        setTimeout(function(){
          expect(chat.modal.hide).toHaveBeenCalled();
          done();
        }, 200);
      });
    });

    describe('has a method chatAccepted() that', function(){
      it('show modal with proper message',function(){
        chat.chatAccepted(userTest);
        expect($('#modal-description').text() == 'test has accepted your chat!').toBe(true);
      });
      it('hide modal and start chat if user click ok',function(done){
        spyOn(chat,'startChat');
        chat.chatAccepted(userTest);
        $('#chat_accepted-ok').click();
        setTimeout(function(){
          expect(chat.modal.hide).toHaveBeenCalled();
          expect(chat.startChat).toHaveBeenCalled();
          done();
        }, 200);
      });
    });
    describe('has a method startChat() that', function(){
      it('shows chat window',function(){
        chat.startChat(userTest);
        expect($('#chat-container-with-' + userTest.id)).toBeDefined();
      });
      it('binds send message',function(done){
        spyOn(chat, 'sendChatMsg');
        chat.startChat(userTest);
        $('#send-msg-to-' + userTest.id).click();
        setTimeout(function(){
          expect(chat.sendChatMsg).toHaveBeenCalled();
          done();
        }, 200);
      });
    });
    describe('has a method sendMsg() that', function(){
      it('comunicate with chat channel',function(){

      });
    });
    describe('has a method showModalForRequestChat() that', function(){
      var userRequester = {
        id:'test',
        name:'test-name'
      };
      it('show modal with proper message',function(){
        chat.showModalForRequestChat(userRequester);
        expect($('#modal-description').text() == userRequester.name + ' wants chat with you, please choose:').toBe(true);
      });
      describe('build button for refuseChat that',function(){
        it('call refuseChat and hide modal when clicked', function(done){
          var btnId = '#refuse-chat-from-' + userRequester.id;
          spyOn(chat, 'refuseChat');
          chat.showModalForRequestChat(userRequester);
          $(btnId).click();
          setTimeout(function(){
            expect(chat.modal.show).toHaveBeenCalled();
            expect(chat.refuseChat).toHaveBeenCalledWith(userRequester);
            done();
          }, 200);
        });
      });
      describe('build button for acceptChat that',function(){
        it('call acceptChat and hide modal when clicked', function(done){
          var btnId = '#accept-chat-from-' + userRequester.id;
          spyOn(chat, 'acceptChat');
          chat.showModalForRequestChat(userRequester);
          $(btnId).click();
          setTimeout(function(){
            expect(chat.modal.show).toHaveBeenCalled();
            expect(chat.acceptChat).toHaveBeenCalledWith(userRequester);
            done();
          }, 200);
        });
      });
    });
  });

})(window._chess.ui.chat, window._chess.lib.dom);
