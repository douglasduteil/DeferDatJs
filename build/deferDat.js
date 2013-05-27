/*
  Defer Dat Js !
  Simple way to defer.
  A fork of JAL (https://github.com/tail-f-systems/JAL)
  Copyright 2013, Douglas Duteil
*/


(function() {
  (function(w, d) {
    var deferDat;

    deferDat = (function() {
      var always, createMonitor, createTag, currentID, epicFail, fail, happyEnd, head, isCool, load, loadResources, loaded, loaderscript, nextResource, pushing, queue, queuePos, success, ___DEBUG___;

      ___DEBUG___ = false;
      loaderscript = void 0;
      isCool = true;
      queue = [];
      queuePos = currentID = -1;
      pushing = true;
      head = d.getElementsByTagName("head")[0];
      (function() {
        var qs, _i, _ref, _results;

        if (d.getElementById('defer-script') === null) {
          return;
        }
        qs = d.getElementById('defer-script').src.replace(/^[^\?]+\??/, '').split(',');
        return (function() {
          _results = [];
          for (var _i = 0, _ref = qs.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; 0 <= _ref ? _i++ : _i--){ _results.push(_i); }
          return _results;
        }).apply(this).map(function(i) {
          if (qs[i] === "debug") {
            ___DEBUG___ = true;
          } else if (qs[i].indexOf("load=") > -1) {
            loaderscript = qs[i].substring(5);
          }
        });
      })();
      if (loaderscript) {
        (function(s) {
          head.appendChild((function() {
            var a;

            a = d.createElement("script");
            a.setAttribute("type", "text/javascript");
            a.setAttribute("src", s);
            a.setAttribute("async", "true");
            return a;
          })());
        })(loaderscript);
      }
      /*
        GET Serious !
      */

      createTag = function(resource, monitor) {
        var tag, __onError, __onSuccess, _onload;

        if (/.js$|.js\?/i.test(resource)) {
          tag = d.createElement("script");
          tag.setAttribute("type", "text/javascript");
          tag.setAttribute("src", resource);
          tag.setAttribute("async", "true");
          _onload = function(failed) {
            if (tag.readyState && tag.readyState !== "complete" && tag.readyState !== "loaded") {
              return;
            }
            monitor(resource, failed);
            tag.onload = tag.onreadystatechange = null;
            if (tag.addEventListener) {
              tag.removeEventListener("load", _onload);
            }
          };
          __onSuccess = function() {
            _onload(false);
          };
          __onError = function() {
            _onload(true);
          };
          if (tag.addEventListener) {
            tag.addEventListener("load", __onSuccess);
            tag.addEventListener("error", __onError);
          } else {
            tag.onload = tag.onreadystatechange = __onSuccess;
            tag.onerror = __onError;
          }
        }
        return tag;
      };
      loaded = function(res, failed) {
        if (!isCool) {
          return;
        }
        if (!failed) {
          if (res.success !== null) {
            res.success();
          }
          nextResource();
        } else {
          if (res.fail === null) {
            epicFail();
          } else {
            if (typeof res.fail === "function") {
              res.fail(nextResource);
            }
          }
          isCool = false;
        }
      };
      createMonitor = function(res) {
        var anyFail, copy;

        copy = (res && res.files ? [].concat(res.files) : []);
        anyFail = false;
        if (___DEBUG___ && console) {
          console.log("New Monitor !", copy);
        }
        return function(resource, failed) {
          var i, len;

          i = 0;
          len = copy.length;
          while (i < len) {
            if (resource === copy[i]) {
              copy = copy.slice(0, i).concat(copy.slice(i + 1));
              break;
            }
            i++;
          }
          if (failed) {
            anyFail = true;
          }
          if (copy.length === 0) {
            return loaded(res, anyFail);
          }
        };
      };
      loadResources = function(res) {
        var i, len, monitor, tag;

        monitor = createMonitor(res);
        i = 0;
        len = res.files.length;
        while (i < len) {
          tag = createTag(res.files[i], monitor);
          if (tag) {
            head.appendChild(tag);
          }
          i++;
        }
      };
      nextResource = function() {
        var res;

        res = void 0;
        if (queue.length === 0) {
          happyEnd();
        } else {
          res = queue.shift();
          if (___DEBUG___ && console) {
            console.log("Neeext !", res);
          }
          loadResources(res);
        }
      };
      load = function(files) {
        var res;

        if (___DEBUG___ && console) {
          console.log("Will load", files);
        }
        if (files && files.length === 0) {
          return deferDat;
        }
        if (typeof files === "string") {
          files = [files];
        }
        res = {
          files: files,
          success: null,
          fail: null,
          always: null
        };
        if (pushing) {
          queue.push(res);
          currentID = queue.length - 1;
        } else {
          currentID = 0;
          queue.splice(queuePos, 0, res);
          queuePos++;
        }
        if (queue.length === 1) {
          setTimeout(nextResource, 10);
        }
        return deferDat;
      };
      success = function(callback) {
        if (___DEBUG___ && console) {
          console.log("If success :", callback);
        }
        queue[currentID].success = callback;
        return deferDat;
      };
      fail = function(callback) {
        if (___DEBUG___ && console) {
          console.log("If fail :", callback);
        }
        queue[currentID].fail = callback;
        return deferDat;
      };
      always = function(callback) {
        if (___DEBUG___ && console) {
          console.log("Will always do", callback);
        }
        return deferDat;
      };
      happyEnd = function() {
        if (___DEBUG___ && console) {
          return console.log("They all lived happily ever after d:D");
        }
      };
      epicFail = function() {
        if (___DEBUG___ && console) {
          return console.log("Fuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu");
        }
      };
      return {
        load: load,
        success: success,
        fail: fail,
        always: always,
        happyEnd: function(callback) {
          if (___DEBUG___ && console) {
            console.log("Will success finish with", callback);
          }
          happyEnd = callback;
          return deferDat;
        },
        epicFail: function(callback) {
          if (___DEBUG___ && console) {
            console.log("Will fail finish with", callback);
          }
          epicFail = callback;
          return deferDat;
        }
      };
    })();
    w.deferDat = deferDat;
  })(window, document);

}).call(this);
