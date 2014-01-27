var Backbone = require('backbone');
var _ = require('underscore');
var GraphItemView = require('./graph-item');

module.exports = Backbone.View.extend({
  tagName: 'ul',
  
  className: 'graph',

  initialize: function () {
    this.render();

    return this;
  },

  graphItemViews: [],

  render: function () {
    var graphItemView = new GraphItemView({
      model: this.model
    });
    
    graphItemView.$el.appendTo(this.$el);

    this.graphItemViews.push(graphItemView);

    return this;
  },

  close: function () {
    if (this.graphItemViews.length) {
      _.each(this.graphItemViews, function (graphItemView) {
        console.log('close', graphItemView.model.get('name'));
        graphItemView.close();
      });
    }

    //this.remove();
  }
});
