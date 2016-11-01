//= require lib/namespace
//= require lib/json

/**
 * @namespace ajax
 * @memberof _chess.jlib
 */
(function(ajax, json) {
  'use strict';

  ajax.xhr = function() {
    if (typeof XMLHttpRequest !== 'undefined') {
      return new XMLHttpRequest();
    }
    var versions = [
      'MSXML2.XmlHttp.6.0',
      'MSXML2.XmlHttp.5.0',
      'MSXML2.XmlHttp.4.0',
      'MSXML2.XmlHttp.3.0',
      'MSXML2.XmlHttp.2.0',
      'Microsoft.XmlHttp'
    ];

    var xhr;
    for (var i = 0; i < versions.length; i++) {
      try {
        xhr = new ActiveXObject(versions[i]);
        break;
      } catch (e) {}
    }
    return xhr;
  };

  var _buildQuery = function(data) {
    var query = [];
    for (var key in data) {
      if (data.hasOwnProperty(key)) {
        query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
      }
    }
    return query.join('&');
  };

  /**
   * Sends an ajax request.
   *
   * ``` js
   * ajax.send('http://contacts/submit', {
   *  method: 'POST',
   *  type: form,
   *  data: {
   *          firstName: 'John'
   *        }
   * }, function(err, data){
   *
   * });
   * ```
   *
   * @param  {String}   url                     The url to request
   * @param  {Object}   data                    The request body or query string
   *                                            object
   * @param  {Object}   options={}
   * @param  {String}   options.method='GET'    The request method
   * @param  {Object}   options.xhr=ajax.xhr()  An optional custom XMLHttpRequest
   *                                            object
   * @param  {Object}   options.headers={}      Optional request headers
   *                                            object
   * @param  {Object}   options.async=true      Make an asynchronous request
   * @param  {String}   options.type='text'     Type of content one of 'json', 'form'
   *                                            or 'text'. Depending on this
   *                                            Content-Type header is set and data
   *                                            are transformed accordingly.
   * @param  {Function} callback                Callback on response ready
   * @return {XMLHttpRequest}                   XMLHttpRequest object relative
   *                                            to this request
   *
   * @function
   * @memberof _iub.jlib.ajax
   */
  ajax.send = function(url, data, options, callback) {
    if (typeof options === 'function') {
      callback = options;
      options = {};
    }

    options = options || {};
    callback = callback || function() {};

    var method = (options.method || 'GET').toUpperCase(),
      query = _buildQuery(data),
      isAsync = options.async !== false,
      x = options.xhr || ajax.xhr(),
      headers = options.headers || {};

    if (method === 'GET') {
      url = url + (query.length ? '?' + query : '');
    }

    x.open(method, url, isAsync);

    x.onreadystatechange = function() {
      if (x.readyState === 4) {
        if (x.status === 200 || x.status === 304) {
          var contentType = x.getResponseHeader('Content-Type') || '';
          var isJson = contentType.match(/^application\/json\s*(;|$)/);
          if (isJson) {
            callback(null, json.parse(x.responseText || ''));
          } else {
            callback(null, x.responseText);
          }
        } else {
          callback(x);
        }
      }
    };
    // fix it. IT MUST START ONLY WITH INTERNET EXPLOER VERSION 8 - 7
    // x.onload = function(){
    //   callback(null, json.parse(x.responseText));
    // };

    if (method !== 'GET') {
      if (options.type === 'json') {
        x.setRequestHeader('Content-Type', 'application/json');
        data = json.stringify(data);
      } else if (options.type === 'form') {
        x.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        data = query;
      } else {
        data = '' + data;
      }
    }

    for (var k in headers) {
      if (headers.hasOwnProperty(k)) {
        x.setRequestHeader(k, headers[k]);
      }
    }

    x.send(data);
    return x;
  };
  ajax.fetch = function(url, callback) {
    var fn = 'loadConf';
    window[fn] = ajax.evalJSONP(callback);
    url = url.replace('=loadConf', '=' + fn);
    var scriptTag = document.createElement('script');
    scriptTag.src = url;
    document.getElementsByTagName('HEAD')[0].appendChild(scriptTag);
    scriptTag.onerror = function() {};
  };

  ajax.evalJSONP = function(callback) {
    return function(data) {
      var validJSON = false;
      if (typeof data === 'string') {
        try {
          validJSON = json.parse(data);
        } catch (e) {
          // logger.warn(e);
        }
      } else if (typeof data === 'object') {
        try {
          validJSON = data;
        } catch (e) {
          // logger.warn(e);
        }
      } else {
        validJSON = json.parse(json.stringify(data));
        // logger.warn('response data was not a JSON string');
      }
      if (validJSON) {
        callback(validJSON);
      } else {
        throw ('JSONP call returned invalid or empty JSON');
      }
    };
  };

}(window._chess.lib.ajax = {}, window._chess.lib.json));
