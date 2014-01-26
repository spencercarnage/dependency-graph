var Backbone = require('backbone');
var _ = require('lodash');
var GraphItemView = require('./graph-item');

module.exports = Backbone.View.extend({
  tagName: 'ul',

  initialize: function () {
    this.render();

    var graphItemView = new GraphItemView({
      model: this.model
    }).$el.appendTo(this.$el);
  },

  render: function () {
  },
});
