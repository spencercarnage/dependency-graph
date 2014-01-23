var Backbone = require('backbone');
var _ = require('lodash');

var GraphModel = Backbone.Model.extend({
  url: '/api/dependencies',
  initialize: function () {
    console.log('init');
  }
});

module.exports = GraphModel;
