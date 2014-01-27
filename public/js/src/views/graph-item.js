var Backbone = require('backbone');
var _ = require('underscore');
var renderDepMixin = require('../mixins/render-dependencies');
var GraphModel = require('../models/graph');

var GraphItemView = Backbone.View.extend({
  events: {
    'click > .view-deps': 'viewDeps',
    'click > .dep-info': 'edit'
  },

  tagName: 'li',
  
  className: 'graph-item',

  template: _.template("<a href='/edit' class='dep-info'>{{name}} {{version}}</a>"),

  dependenciesViews: [],

  initialize: function () {
    this.render();

    var deps = this.model.get('depsCollection');

    if (typeof deps !== 'undefined') {
      if (!this.hasChildUL()) {
        this.$el.append('<span class="view-deps">view deps</span>');
        this.$el.append('<ul>');
      }
      console.log('deps for ' + this.model.get('name'), deps.models.length);

      _.each(deps.models, function (depModel, i) {
        var graphItemView = new GraphItemView({
          model: new GraphModel(depModel.toJSON())
        })

        graphItemView.$el.appendTo(this.$el.children('ul').eq(0));

        this.dependenciesViews.push(graphItemView);
      }, this);
    }

    return this;
  },

  render: function () {
    this.$el.prepend(this.template(_.extend({cid: this.model.cid}, this.model.toJSON())));
    
    return this;
  },

  hasChildUL: function () {
    return this.$el.children('ul').length;
  },

  viewDeps: function (event) {
    var deps = this.model.get('depsCollection');

    _.each(deps.models, function (dep, i) {
      console.log(dep.get('name'));
    });
  },

  edit: function (event) {
    event.preventDefault();

    var editData = {
      name: this.model.get('name'),
      version: this.model.get('version'),
      deps: this.model.get('deps')
    };

    App.Vent.trigger('edit:show', editData);
  },
  close: function () {
    console.log(this.model.get('name'), this.dependenciesViews.length);
    /*
    if (this.dependenciesViews.length) {
      _.each(this.dependenciesViews, function (depView, i) {
        console.log('close', depView.model.get('name'));
        depView.close();
      });
    }
    */

    //console.log('close', this.model.get('name'));
    //this.remove();
  }
});

_.extend(GraphItemView.prototype, renderDepMixin);

module.exports = GraphItemView;
