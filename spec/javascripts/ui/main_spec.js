//= require websocket_rails/main
//= require namespace
//= require lib/namespace
//= require lib/ajax
//= require lib/json
//= require lib/dom
//= require socket/namespace
//= require ui/Main.js

(function(main, mainChannel, connection, dom){
  'use strict';

  var messageContainer = '#general-message-user';
  var allClientsContainer = '#all-clients';
  var welcomeMessage = 'Welcome!';
  var goodbyeMessage = 'Goodbye!';
  var channel_name = 'channel_example';
  var userId = 'test-id';
  var testName = 'test-name';
  var anotherUserId = 'test-another-id';
  var exampleUser = {id:userId,name:testName};
  var exampleAnotherUser = {id:anotherUserId,name:testName};
  var dataTest = {test:'true'};
  var suf_for_user = 'user-container-';

  var stubConnection = {
    init: jasmine.createSpy(),
    disconnect: jasmine.createSpy()
  };

  var stubMainChannel = {
    init:   jasmine.createSpy(),
    start:  jasmine.createSpy(),
    closeConnection:  jasmine.createSpy(),
    chatAccepted:     jasmine.createSpy(),
    chatRefused:      jasmine.createSpy()
  };

  var stubChatChannel = {
    init: jasmine.createSpy(),
    start: jasmine.createSpy(),
    requestChat: jasmine.createSpy(),
    onChatRequested: jasmine.createSpy(),
  };

  var stubDom = {
    addPreventDefault: jasmine.createSpy()
  };

  var user = {
    id: userId
  };

  var opts = {
  };

  // main.dom = stubDom; // stubbing all
  main.mainChannel = stubMainChannel; // stubbing all
  main.chatChannel = stubChatChannel; // stubbing all

  var event = document.createEvent('HTMLEvents');
  event.initEvent('click', true, true);

  describe('The MainUiInterface ',function(){

    describe('has a method init() that', function(){
      var btns = main.btns;

      beforeEach(function(){
        loadFixtures('ui/elements.html');
      });

      it('stops it self if user-id is not defined',function(){
        expect(main.init(null)).toBe(null);
      });

      it('enables connect btn', function(){ // ? disableAllBtns will be called before loadFixtures, right?
        // spyOn(dom,'addPreventDefault');
        main.init(user, opts);
        expect(main.btns.connect).toHaveClass('enabled');
      });

      it('disables close btn', function(){ // ? disableAllBtns will be called before loadFixtures, right?
        // spyOn(dom,'addPreventDefault');
        main.init(user, opts);
        for (var btn in main.btns){
          expect(main.btns.close).toHaveClass('disabled');
        }
      });
      describe('bind the button connect that', function(){
        beforeEach(function(){
          loadFixtures('ui/elements.html');
          main.init(user, opts);
          btns.connect.dispatchEvent(event);
        });
        it('if clicked adds a spinner and calls start mainChannel initilization',function(){
          expect(btns.connect.getAttribute('class')).toContain('spinner');
          expect(main.mainChannel.start).toHaveBeenCalled();
        });
      });
      describe('bind the button close that', function(){
        beforeEach(function(){
          loadFixtures('ui/elements.html');
          main.init(user, opts);
          dom.addEventListener(btns.close, 'click', btns.close.fn);
          btns.close.dispatchEvent(event);
        });
        it('if clicked adds a spinner and calls close mainChannel connection',function(){
          expect(btns.close.getAttribute('class')).toContain('spinner');
          expect(main.mainChannel.closeConnection).toHaveBeenCalled();
        });
      });
    });

    describe('has a method setInitialState() that',function(){

      beforeEach(function(){
        loadFixtures('ui/elements.html');
        main.init(user, opts);
      });

      it('write the welcome message and add user info in the page',function(){
        main.setInitialState();
        expect($(messageContainer).text()).toBe(welcomeMessage);
      });
      it('disable connect and enable close',function(){
        main.setInitialState();
        expect(main.btns.connect.getAttribute('class')).toContain('disabled');
        expect(main.btns.close.getAttribute('class')).toContain('enabled');
      });

    });

    describe('has a method addInfoNewClient() that',function(){
      var el = null;
      beforeEach(function(){
        loadFixtures('ui/elements.html');
        main.init(opts);
        el = $(allClientsContainer);
      });
      it('writes new user info in the proper div',function(){
        main.addInfoNewClient(exampleUser); // i think data will be sent in this way.
        var userDiv = $('#' + suf_for_user + exampleUser.id);
        expect(userDiv[0]).toBeDefined();
        expect(userDiv.parent()[0]).toBe(el[0]);
      });

      it('should add chat and request match buttons',function(){
        main.addInfoNewClient(exampleUser); // i think data will be sent in this way.
        var userDiv = $('#' + suf_for_user + exampleUser.id + ' .buttons');
        var buttons = userDiv.children();
        expect($(buttons[1]).hasClass('request-chat')).toBe(true);
        expect($(buttons[0]).hasClass('request-match')).toBe(true);
      });

      it('should not add chat and request match buttons if user is current',function(){
        main.addInfoNewClient(exampleAnotherUser); // i think data will be sent in this way.
        var userDiv = $('#' + suf_for_user + exampleUser.id + ' .buttons');
        var buttons = userDiv.children();
        expect($(buttons[1]).hasClass('request-chat')).not.toBe(true);
        expect($(buttons[0]).hasClass('request-match')).not.toBe(true);
      });

    });

    describe('has a method addInfoNewClients() that',function(){
      beforeEach(function(){
        loadFixtures('ui/elements.html');
        main.init(opts);
      });
      it('writes all connected users in the proper div',function(){
        // this test is not good: you have to test if addInfoNewClient is called as much as data.user's length
        var el = $(allClientsContainer);
        var id1 = anotherUserId;
        var id2 = anotherUserId + 1;

        main.addInfoNewClients({1: {id: id1},2: {id: id2}}); // i think data will be sent in this way.

        var userDiv1 = $('#' + suf_for_user + id1);
        var userDiv2 = $('#' + suf_for_user + id2);
        expect(userDiv1[0]).toBeDefined();
        expect(userDiv2[0]).toBeDefined();
      });
    });

    describe('has a method removeUser() that',function(){
      beforeEach(function(){
        loadFixtures('ui/elements.html');
        main.init(opts);
      });
      it('removes client from proper div',function(){
        var el = $(allClientsContainer);
        el.append('<div id="' + suf_for_user + anotherUserId + '"></div>');
        main.removeUser(anotherUserId); // i think data will be sent in this way.
        var userDiv = $('#' + anotherUserId);
        expect(userDiv[0]).not.toBeDefined();
      });
    });

  });

})(window._chess.ui.main, _chess.socket.mainChannel, _chess.socket.connection, window._chess.lib.dom);
