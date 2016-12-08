(function(evtManager){

  evtManager.set = function(object) {

    evtManager.events = evtManager.events || {};
    object.on = function(evtName, callback) {
      if (!evtManager.events[evtName])
      {
        evtManager.events[evtName] = [];
      }
      evtManager.events[evtName].push(callback);
    };

    object.trigger = function(evtName, evtObj) {
      if (evtManager.events[evtName]){
        evtManager.events[evtName].forEach(function(callback) {
          setTimeout(function(){callback(evtObj);},1);
        });
      }
    };

    object.remove = function(evtName) {
      delete evtManager.events[evtName];
    };
    return object;
  };

})(window._chess.lib.evtManager = {});
