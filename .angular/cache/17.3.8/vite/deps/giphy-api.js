import {
  __commonJS
} from "./chunk-CPNXOV62.js";

// node_modules/giphy-api/util/queryStringify.js
var require_queryStringify = __commonJS({
  "node_modules/giphy-api/util/queryStringify.js"(exports, module) {
    var has = Object.prototype.hasOwnProperty;
    module.exports = function(obj) {
      var pairs = [];
      for (var key in obj) {
        if (has.call(obj, key)) {
          pairs.push(encodeURIComponent(key) + "=" + encodeURIComponent(obj[key]));
        }
      }
      return pairs.length ? "?" + pairs.join("&") : "";
    };
  }
});

// node_modules/giphy-api/util/http_browser.js
var require_http_browser = __commonJS({
  "node_modules/giphy-api/util/http_browser.js"(exports) {
    exports.create = function() {
      return this;
    };
    exports.get = function(options, resolve, reject) {
      var request = options.request;
      var timeout = options.timeout;
      var fmt = options.fmt;
      var timerId = setTimeout(function() {
        reject(new Error("Timeout while fetching asset"));
      }, timeout);
      var xhr = new XMLHttpRequest();
      xhr.withCredentials = false;
      var onFail = function(err) {
        clearTimeout(timerId);
        err = err || new Error("Giphy API request failed!");
        reject(err);
      };
      xhr.addEventListener("error", onFail);
      xhr.addEventListener("abort", onFail);
      xhr.addEventListener("load", function() {
        clearTimeout(timerId);
        var body = xhr.response;
        if (fmt !== "html") {
          body = JSON.parse(body);
        }
        resolve(body);
      });
      var protocol = options.https ? "https" : "http";
      var host = request.host;
      var path = request.path;
      var url = protocol + "://" + host + path;
      xhr.open("GET", url, true);
      xhr.send();
    };
  }
});

// node_modules/giphy-api/index.js
var require_giphy_api = __commonJS({
  "node_modules/giphy-api/index.js"(exports, module) {
    var queryStringify = require_queryStringify();
    var httpService = require_http_browser();
    var API_HOSTNAME = "api.giphy.com";
    var API_BASE_PATH = "/v1/";
    var PUBLIC_BETA_API_KEY = "dc6zaTOxFJmzC";
    var promisesExist = typeof Promise !== "undefined";
    function _handleErr(err, callback) {
      if (callback) {
        return callback(err);
      } else if (promisesExist) {
        return Promise.reject(err);
      } else {
        throw new Error(err);
      }
    }
    var GiphyAPI = function(options) {
      if (typeof options === "string" || typeof options === "undefined" || options === null) {
        this.apiKey = options || PUBLIC_BETA_API_KEY;
        options = {};
      } else if (typeof options === "object") {
        this.apiKey = options.apiKey || PUBLIC_BETA_API_KEY;
      } else {
        throw new Error("Invalid options passed to giphy-api");
      }
      this.https = options.https;
      this.timeout = options.timeout || 3e4;
      this.httpService = httpService.create(this.https);
    };
    GiphyAPI.prototype = {
      /**
      * Search all Giphy gifs by word or phrase
      *
      * @param options Giphy API search options
      *   options.q {String} - search query term or phrase
      *   options.limit {Number} - (optional) number of results to return, maximum 100. Default 25.
      *   options.offset {Number} - (optional) results offset, defaults to 0.
      *   options.rating {String}- limit results to those rated (y,g, pg, pg-13 or r).
      *   options.fmt {String} - (optional) return results in html or json format (useful for viewing responses as GIFs to debug/test)
      * @param callback
      */
      search: function(options, callback) {
        if (!options) {
          return _handleErr("Search phrase cannot be empty.", callback);
        }
        return this._request({
          api: options.api || "gifs",
          endpoint: "search",
          query: typeof options === "string" ? {
            q: options
          } : options
        }, callback);
      },
      /**
      * Search all Giphy gifs for a single Id or an array of Id's
      *
      * @param id {String} - Single Giphy gif string Id or array of string Id's
      * @param callback
      */
      id: function(id, callback) {
        var idIsArr = Array.isArray(id);
        if (!id || idIsArr && id.length === 0) {
          return _handleErr("Id required for id API call", callback);
        }
        if (idIsArr) {
          id = id.join();
        }
        return this._request({
          api: "gifs",
          query: {
            ids: id
          }
        }, callback);
      },
      /**
      * Search for Giphy gifs by phrase with Gify vocabulary
      *
      * @param options Giphy API translate options
      *   options.s {String} - term or phrase to translate into a GIF
      *   options.rating {String} - limit results to those rated (y,g, pg, pg-13 or r).
      *   options.fmt {String} - (optional) return results in html or json format (useful for viewing responses as GIFs to debug/test)
      */
      translate: function(options, callback) {
        if (!options) {
          return _handleErr("Translate phrase cannot be empty.", callback);
        }
        return this._request({
          api: options.api || "gifs",
          endpoint: "translate",
          query: typeof options === "string" ? {
            s: options
          } : options
        }, callback);
      },
      /**
      * Fetch random gif filtered by tag
      *
      * @param options Giphy API random options
      *   options.tag {String} - the GIF tag to limit randomness by
      *   options.rating {String} - limit results to those rated (y,g, pg, pg-13 or r).
      *   options.fmt {Stirng} - (optional) return results in html or json format (useful for viewing responses as GIFs to debug/test)
      */
      random: function(options, callback) {
        var reqOptions = {
          api: (options ? options.api : null) || "gifs",
          endpoint: "random"
        };
        if (typeof options === "string") {
          reqOptions.query = {
            tag: options
          };
        } else if (typeof options === "object") {
          reqOptions.query = options;
        } else if (typeof options === "function") {
          callback = options;
        }
        return this._request(reqOptions, callback);
      },
      /**
      * Fetch trending gifs
      *
      * @param options Giphy API random options
      *   options.limit {Number} - (optional) limits the number of results returned. By default returns 25 results.
      *   options.rating {String} - limit results to those rated (y,g, pg, pg-13 or r).
      *   options.fmt {String} - (optional) return results in html or json format (useful for viewing responses as GIFs to debug/test)
      */
      trending: function(options, callback) {
        var reqOptions = {
          endpoint: "trending"
        };
        reqOptions.api = (options ? options.api : null) || "gifs";
        if (options) {
          delete options.api;
        }
        if (typeof options === "object" && Object.keys(options).length !== 0) {
          reqOptions.query = options;
        } else if (typeof options === "function") {
          callback = options;
        }
        return this._request(reqOptions, callback);
      },
      /**
      * Prepares the HTTP request and query string for the Giphy API
      *
      * @param options
      *   options.endpoint {String} - The API endpoint e.g. search
      *   options.query {String|Object} Query string parameters. If these are left
      *       out then we default to an empty string. If this is passed as a string,
      *       we default to the 'q' query string field used by Giphy.
      */
      _request: function(options, callback) {
        if (!callback && !promisesExist) {
          throw new Error("Callback must be provided if promises are unavailable");
        }
        var endpoint = "";
        if (options.endpoint) {
          endpoint = "/" + options.endpoint;
        }
        var query;
        var self = this;
        if (typeof options.query !== "undefined" && typeof options.query === "object") {
          if (Object.keys(options.query).length === 0) {
            if (callback) {
              return callback(new Error("Options object should not be empty"));
            }
            return Promise.reject(new Error("Options object should not be empty"));
          }
          options.query.api_key = this.apiKey;
          query = queryStringify(options.query);
        } else {
          query = queryStringify({
            api_key: self.apiKey
          });
        }
        var httpOptions = {
          httpService: this.httpService,
          request: {
            host: API_HOSTNAME,
            path: API_BASE_PATH + options.api + endpoint + query
          },
          timeout: this.timeout,
          fmt: options.query && options.query.fmt,
          https: this.https
        };
        var makeRequest = function(resolve2, reject2) {
          httpService.get(httpOptions, resolve2, reject2);
        };
        if (callback) {
          var resolve = function(res) {
            callback(null, res);
          };
          var reject = function(err) {
            callback(err);
          };
          makeRequest(resolve, reject);
        } else {
          if (!promisesExist) {
            throw new Error("Callback must be provided unless Promises are available");
          }
          return new Promise(function(resolve2, reject2) {
            makeRequest(resolve2, reject2);
          });
        }
      }
    };
    module.exports = function(apiKey, options) {
      return new GiphyAPI(apiKey, options);
    };
  }
});
export default require_giphy_api();
//# sourceMappingURL=giphy-api.js.map
