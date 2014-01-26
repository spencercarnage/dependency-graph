var Backbone = require('backbone');
var _ = require('lodash');
var renderDepMixin = require('../mixins/render-dependencies');
var GraphModel = require('../models/graph');

var GraphItemView = Backbone.View.extend({
  tagName: 'li',

  template: _.template("<li id=<%= name%>-<%= cid%>><%= name %> <%= version %></li>"),

  dependenciesViews: [],

  initialize: function () {
    this.render();

    var deps = this.model.get('depsCollection');

    if (typeof deps !== 'undefined') {
      if (!this.hasChildUL()) {
        this.$el.append('<ul>');
      }

      _.each(deps.models, function (depModel, i) {
        var graphItemView = new GraphItemView({
          model: new GraphModel(depModel.toJSON())
        }).$el.appendTo(this.$el.children('ul').eq(0));

        this.dependenciesViews.push(graphItemView);
      }, this);

      //_.each(deps.models, function (depModel, i) {
      //  this.renderDependency(depModel, GraphItemView, this.model, this);
      //}, this);
    }
  },

  render: function () {
    this.$el.html(this.template(_.extend({cid: this.model.cid}, this.model.toJSON())));
  },

  hasChildUL: function () {
    return this.$el.children('ul').length;
  },
});

_.extend(GraphItemView.prototype, renderDepMixin);

module.exports = GraphItemView;
