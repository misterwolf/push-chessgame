var EvtMgr = function() {
  var events = {};
  this.on = function(evtName, callback) {
    if (!events[evtName])
    {
      events[evtName] = [];
    }
    events[evtName].push(callback);
  };

  this.trigger = function(evtName, evtObj) {
    events[evtName].forEach(function(callback) {
      callback(evtObj);
    });
  };

  this.remove = function(evtName) {
    delete events[evtName];
  };

};
