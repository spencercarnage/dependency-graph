var Backbone = require('backbone');
var _ = require('underscore');
var GraphView = require('./graph');
var GraphModel = require('../models/graph');

var AppView = Backbone.View.extend({
  el: '#app',

  initialize: function () {
    this.render();
  },

  render: function () {
    this.$el.html('');
  },

});

module.exports = AppView;
