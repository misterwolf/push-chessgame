//= require socket/Initializer.js

(function(initializer){
  describe('Socket', function() {
    describe('Initializer', function() {
      describe('init function ', function() {
        it('to be defined', function() {
          initializer.init();
          expect(initializer.dispatcher).toBeDefined();
        });
      });
    });
  });
})(window._chess.socket.initializer);
