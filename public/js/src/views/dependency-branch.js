var Backbone = require('backbone');
var _ = require('underscore');
var LeafView= require('./dependency-leaf');
var DepModel = require('../models/dependency');

module.exports = Backbone.View.extend({
  tagName: 'ul',
  
  className: 'dependency-branch',

  initialize: function (options) {
    options = options || {};

    if (typeof options.leavesCollection !== 'undefined') {
      this.leavesCollection = options.leavesCollection;
    }

    this.render();

    return this;
  },

  leafViews: [],

  leavesCollection: null,

  render: function () {
    if (!_.isNull(this.leavesCollection)) {
      _.each(this.leavesCollection.models, function (leafModel) {
        console.log(leafModel.attributes);
        var leafView = new LeafView({
          model: leafModel
        });
        
        leafView.$el.appendTo(this.$el);

        this.leafViews.push(leafView);
      }, this);
    }

    return this;
  },

  close: function () {
    if (this.leafViews.length) {
      _.each(this.leafViews, function (leafView) {
        console.log('close', leafView.model.get('name'));
        leafView.close();
      });
    }

    //this.remove();
  }
});
