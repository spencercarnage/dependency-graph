var Backbone = require('backbone');
var _ = require('lodash');

var GraphView = Backbone.View.extend({
  el: '#graph',

  initialize: function () {
    this.render();
  },

  render: function () {
    console.log('rendered!');
  }
});

module.exports = GraphView;
