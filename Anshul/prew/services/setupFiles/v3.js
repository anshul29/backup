'use strict';

var createAPIRequest = require('../../lib/apirequest');

function Oauth2(options) {

  var self = this;
  this._options = options || {};

  this.tokeninfo = function(params, callback) {
    var parameters = {
      options: {
        url: 'https://www.googleapis.com/oauth2/v3/tokeninfo',
        method: 'POST'
      },
      params: params,
      requiredParams: [],
      pathParams: [],
      context: self
    };

    return createAPIRequest(parameters, callback);
  };

}

module.exports = Oauth2;