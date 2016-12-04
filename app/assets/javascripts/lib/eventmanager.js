(function(evtManager){

  evtManager.set = function(object) {

    var events = {};
    object.on = function(evtName, callback) {
      if (!events[evtName])
      {
        events[evtName] = [];
      }
      events[evtName].push(callback);
    };

    object.trigger = function(evtName, evtObj) {
      events[evtName].forEach(function(callback) {
        setTimeout(function(){callback(evtObj);},1);
      });
    };

    object.remove = function(evtName) {
      delete events[evtName];
    };
    return object;
  };

})(window._chess.lib.evtManager = {});
