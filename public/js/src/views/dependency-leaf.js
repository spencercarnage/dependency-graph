var Backbone = require('backbone');
var _ = require('underscore');
var renderDepMixin = require('../mixins/render-dependencies');
var DepModel = require('../models/dependency');

var LeafView = Backbone.View.extend({
  events: {
    'click > .view-deps': 'viewDeps',
    'click > .edit-dep': 'edit'
  },

  tagName: 'li',
  
  className: 'dependency-leaf',

  template: _.template("<a href='/edit' class='edit-dep'><span class='dep-name'>{{name}}</span> <span class='dep-version'>{{version}}</span></a>"),

  leafViews: [],

  branchViews: null,

  initialize: function () {
    this.render();

    return this;
  },

  render: function () {
    var depsCollection = this.model.get('depsCollection');

    // Require the branch view here so we don't have issues with circular
    // deps returning empty objects

    this.$el.html(this.template(this.model.toJSON()));

    if (depsCollection.length) {
      var DepBranchView = require('./dependency-branch');

      this.$el.prepend('<button class="view-deps">view dependencies</button>');

      var branchView = new DepBranchView({
        model: new DepModel(this.model.toJSON())
      });

      branchView.$el.appendTo(this.$el); 

      this.branchView = branchView;

      _.each(depsCollection.models, function(leafModel) {
        var leafView = new LeafView({
          model: new DepModel(leafModel.toJSON())
        });

        console.log(leafView.model.cid);

        leafView.$el.appendTo(branchView.$el);

        leafView.model.on('change:name', function (model, name) {
          this.$('.dep-name').html(name);
        }, leafView);

        leafView.model.on('change:version', function (model, version) {
          this.$('.dep-version').html(version);
        }, leafView);

        leafView.model.on('removeDeps', function (deps) {
          branchView.model.removeDeps(deps);
        }, leafView);

        leafView.model.on('edit:save', function (changes) {
          this.model.set(changes);
        }, leafView);

        this.leafViews.push(leafView);
      }, this);

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

    App.Vent.trigger('edit:show', this.model);
  }
});

_.extend(LeafView.prototype, renderDepMixin);

module.exports = LeafView;
