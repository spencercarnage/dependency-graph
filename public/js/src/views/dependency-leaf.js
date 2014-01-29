var Backbone = require('backbone');
var _ = require('underscore');
var renderDepMixin = require('../mixins/render-dependencies');
var DepModel = require('../models/dependency');

var LeafView = Backbone.View.extend({
  events: {
    'click > .view-deps': 'viewDeps',
    'click > .dep-info': 'edit'
  },

  tagName: 'li',
  
  className: 'dependency-leaf',

  template: _.template("<a href='/edit' class='edit-dep'>{{name}} {{version}}</a>"),

  leafViews: [],

  branchViews: [],

  initialize: function () {
    this.render();

    return this;
  },

  render: function () {
    var depsCollection = this.model.get('depsCollection');

    // Require the branch view here so we don't have issues with circular
    // deps returning empty objects
    var DepBranchView = require('./dependency-branch');

    this.$el.html(this.template(this.model.toJSON()));

    if (depsCollection.length) {
      this.$el.prepend('<button class="view-deps">view dependencies</button>');

      console.log('branch');
      var branchView = new DepBranchView({
        model: new DepModel(this.model.toJSON())
      });

      branchView.$el.appendTo(this.$el); 
      this.branchViews.push(branchView);

      _.each(depsCollection.models, function(leafModel) {
        console.log('leaf');
        var leafView = new LeafView({
          model: new DepModel(leafModel.toJSON())
        });

        leafView.$el.appendTo(branchView.$el);

        this.leafViews.push(leafView);
      }, this);

      //branchView.$el.appendTo(this.$el);
      //this.branchViews.push(branchView);

      //_.each(depsCollection.models, function (depModel, i) {
      //  //if (depModel.get('depsCollection').length) {

      //  //} else {
      //    console.log('leaf');
      //    var leafView = new LeafView({
      //      model: new DepModel(depModel.toJSON())
      //    });

      //    console.log(leafView.$el);
      //    leafView.$el.appendTo(this.$el);

      //    this.leafViews.push(leafView);
      //  //}
      //}, this);
    }

    return this;
  },

  hasChildUL: function () {
    return this.$el.children('ul').length;
  },

  viewDeps: function (event) {
    var deps = this.model.get('depsCollection');

    _.each(deps.models, function (dep, i) {
      //console.log(dep.get('name'));
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
    console.log(this.model.get('name'), this.leafViews.length);
    /*
    if (this.leafViews.length) {
      _.each(this.leafViews, function (leafView, i) {
        console.log('close', leafView.model.get('name'));
        leafView.close();
      });
    }
    */

    //console.log('close', this.model.get('name'));
    //this.remove();
  }
});

_.extend(LeafView.prototype, renderDepMixin);

module.exports = LeafView;
