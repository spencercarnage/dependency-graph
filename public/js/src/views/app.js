var Backbone = require('backbone');
var _ = require('underscore');
var DepTreeView = require('./dependency-branch');
var DepModel = require('../models/dependency');

var AppView = Backbone.View.extend({
  el: '#app',

  initialize: function () {
    this.render();
  },

  render: function () {
  }
});

module.exports = AppView;
