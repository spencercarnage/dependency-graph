var Backbone = require('backbone');
var _ = require('underscore');

var EditDepsView = Backbone.View.extend({
  template: _.template($('#edit-deps-template').html()),

  initialize: function () {
    this.render();
  },

  render: function () {
    this.$el.html(this.template(this.model.toJSON()));
  }
});

module.exports = EditDepsView;
