//= require socket/Main.js

jasmine.getFixtures().fixturesPath = 'spec/javascripts/fixtures/';

(function(dom){

  var opts = {
    currentUserId: 'test-id'
  };

  var stubConnection = {
    dispatcher: function(){}
  };

  describe('Main',function(){

    describe('init()',function(){
      it('stop if user id is not defined',function(){
        // opts.currentUserId = null;
        var main = new _chess.socket.main(opts);
        expect(main.state).toBe(null);
      });
    });

  });
})(window._chess.lib.dom);
