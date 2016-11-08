//= require websocket_rails/main
//= require namespace
//= require lib/namespace
//= require lib/ajax
//= require lib/json
//= require lib/dom
//= require socket/namespace
//= require ui/Main.js

(function(ui, /**/ mainChannel, connection, /**/dom){
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

  var stubConnection = {
    init: jasmine.createSpy(),
    disconnect: jasmine.createSpy()
  };

  var stubMainChannel = {
    ciaoc: jasmine.createSpy(),
    init: jasmine.createSpy(),
    start: jasmine.createSpy(),
    closeConnection: jasmine.createSpy(),
    connection: stubConnection
  };

  var stubDom = {
    addPreventDefault: jasmine.createSpy()
  };

  var user = {
    id: userId
  };

  var opts = {
  };

  // ui.dom = stubDom; // stubbing all
  ui.mainChannel = stubMainChannel; // stubbing all

  var event = document.createEvent('HTMLEvents');
  event.initEvent('click', true, true);

  describe('The UiInterface ',function(){

    describe('has a method init() that', function(){
      var btns = ui.btns;

      beforeEach(function(){
        loadFixtures('ui/elements.html');
      });

      it('stops it self if user-id is not defined',function(){
        expect(ui.init({})).toBe(null);
      });

      it('enables connect btn', function(){ // ? disableAllBtns will be called before loadFixtures, right?
        spyOn(dom,'addPreventDefault');
        ui.init(user, opts);
        expect(ui.btns.connect).toHaveClass('enabled');
      });

      it('disables close btn', function(){ // ? disableAllBtns will be called before loadFixtures, right?
        spyOn(dom,'addPreventDefault');
        ui.init(user, opts);
        for (var btn in ui.btns){
          expect(ui.btns.close).toHaveClass('disabled');
        }
      });
      describe('binds the buttons', function(){
        var btns = ui.btns;
        describe('and if button connect is clicked', function(){
          beforeEach(function(){
            loadFixtures('ui/elements.html');
            ui.init(user, opts);
            btns.connect.dispatchEvent(event);
          });
          it('adds a spinner and calls start mainChannel initilization',function(){
            expect(btns.connect.getAttribute('class')).toContain('spinner');
            expect(ui.mainChannel.start).toHaveBeenCalled();
          });
        });
        describe('and if button close is clicked', function(){
          beforeEach(function(){
            loadFixtures('ui/elements.html');
            ui.init(user, opts);
            dom.addEventListener(btns.close, 'click', btns.close.fn);
            btns.close.dispatchEvent(event);
          });
          it('adds a spinner and calls close mainChannel connection',function(){
            expect(btns.close.getAttribute('class')).toContain('spinner');
            expect(ui.mainChannel.closeConnection).toHaveBeenCalled();
          });
        });
      });

      // move these two in another channel file
      xdescribe('and if button request chat is clicked', function(){
        it('add spinner class',function(){

        });
        it('remove spinner class on complete',function(){

        });
      });
      xdescribe('and if button request match is clicked', function(){
        it('add spinner class',function(){

        });
        it('remove spinner class on complete',function(){

        });
      });
    });

    describe('has a method onOpen() that',function(){

      beforeEach(function(){
        loadFixtures('ui/elements.html');
        ui.init(user, opts);
      });

      it('write the welcome message and add user info in the page',function(){
        ui.onOpen();
        expect($(messageContainer).text()).toBe(welcomeMessage);
      });
      it('disable connect and enable close',function(){
        ui.onOpen();
        expect(ui.btns.connect.getAttribute('class')).toContain('disabled');
        expect(ui.btns.close.getAttribute('class')).toContain('enabled');
        // this will be moved on another file in /socket => chessChannel!
        // expect(ui.btns.request_chat.getAttribute('class')).toContain('enabled');
        // expect(ui.btns.request_match.getAttribute('class')).toContain('enabled');
      });

    });

    // describe('has a method onClose() that',function(){
    //   beforeEach(function(){
    //     loadFixtures('ui/elements.html');
    //     ui.init(user, opts);
    //   });
    //
    //   it('write the goodbye message and remove user info on all clients div',function(){
    //     var el = $('#test-id');
    //     $(allClientsContainer).append('<div id="' + userId + '"></div>');
    //     ui.onClose();
    //     expect($(messageContainer).text()).toBe(goodbyeMessage);
    //     expect($('#' + userId).length).toBe(0);
    //   });
    //
    //   it('enable connect and disable close buttons',function(){
    //     ui.onClose();
    //     expect(ui.btns.connect.getAttribute('class')).toContain('enabled');
    //     expect(ui.btns.close.getAttribute('class')).toContain('disabled');
    //     // this will be moved on another file in /socket => chessChannel!
    //     // expect(ui.btns.request_chat.getAttribute('class')).toContain('disabled');
    //     // expect(ui.btns.request_match.getAttribute('class')).toContain('disabled');
    //   });
    //
    // });

    describe('has a method addInfoNewClient() that',function(){
      beforeEach(function(){
        loadFixtures('ui/elements.html');
        ui.init(opts);
      });
      it('writes new user info in the proper div',function(){
        var el = $(allClientsContainer);
        ui.addInfoNewClient(exampleUser); // i think data will be sent in this way.
        var userDiv = $('#' + exampleUser.id);
        expect(userDiv[0]).toBeDefined();
        expect(userDiv.parent()[0]).toBe(el[0]);
      });
    });

    describe('has a method addInfoNewClients() that',function(){
      beforeEach(function(){
        loadFixtures('ui/elements.html');
        ui.init(opts);
      });
      it('writes all connected users in the proper div',function(){
        var el = $(allClientsContainer);
        var id1 = anotherUserId;
        var id2 = anotherUserId + 1;

        ui.addInfoNewClients({1: {id: id1},2: {id: id2}}); // i think data will be sent in this way.

        var userDiv1 = $('#' + id1);
        var userDiv2 = $('#' + id2);
        expect(userDiv1[0]).toBeDefined();
        expect(userDiv2[0]).toBeDefined();
      });
    });

    describe('has a method removeUser() that',function(){
      beforeEach(function(){
        loadFixtures('ui/elements.html');
        ui.init(opts);
      });
      it('removes client from proper div',function(){
        var el = $(allClientsContainer);
        el.append('<div id="' + anotherUserId + '"></div>');
        ui.removeUser(anotherUserId); // i think data will be sent in this way.
        var userDiv = $('#' + anotherUserId);
        expect(userDiv[0]).not.toBeDefined();
      });
    });

  });

})(window._chess.ui.main, /**/ _chess.socket.mainChannel, _chess.socket.connection,/**/ window._chess.lib.dom);
