window.$ = window.jQuery = require('jquery');
window._ = require('underscore');

// mustache style templates
_.templateSettings = {
  interpolate : /\{\{(.+?)\}\}/g
};

window.Backbone = require('backbone');
Backbone.$ = window.$;

var DepTreeView = require('./views/dependency-branch');
var DepModel = require('./models/dependency');
var EditView = require('./views/edit');
var EditModel = require('./models/edit');
var DependenciesCollection = require('./collections/dependencies');
var DependencyModel = require('./models/dependency');
var depTreeView;
var models = {};
var $tree;
var $edit;
var $app;
window.App = {};

App.Branches = [];
App.DepTreeViews = [];
App.TreeViews = [];

App.Vent = _.extend({}, Backbone.Events);

var Router = Backbone.Router.extend({
  routes: {
    ''    : 'index',
    '/'    : 'index',
    'edit': 'edit'
  },

  initialize: function (options) {
    // Create internal controller so we can call methods directly and pass them
    // data from App.Vent events.
    this.controller = options.controller;
  },

  index: function () {
    App.Vent.off('edit:save');
    App.Vent.off('edit:addDeps');
    App.Vent.off('edit:removeDeps');

    if (typeof App.Tree === 'undefined') {
      var branches = new DependenciesCollection(dependenciesData);

      var depTree = new DepTreeView({
        leavesCollection: branches
      });

      App.Tree = depTree;

      $tree.append(depTree.$el);

      $edit.hide();
      $tree.show();
    } else {
      $edit.hide();
      $tree.show();
    }
  },

  edit: function (data) {
    this.controller.edit(data);
  }
});

function Controller() {
  this.edit = function (model) {
    if (typeof model !== 'undefined') {
      $tree.hide();

      App.EditView = new EditView({
        model: new DepModel(_.extend({editModel: model}, model.toJSON()))
      });

      App.EditView.model.set('editModel', model);
      
      $edit.html(App.EditView.$el).show();

      App.Vent.on('edit:addDeps', function (dep) {
        model.trigger('addDeps', dep);
      });

      App.Vent.on('edit:removeDeps', function (deps) {
        model.trigger('removeDeps', deps);
      });

      App.Vent.on('edit:save', function (changes) {
        console.log(changes);
        model.set(changes);
        App.Router.navigate('/', {trigger:true});
      });
    } else {
      App.Router.navigate('/', {trigger:true});
    }
  };
}

App.Controller = new Controller();

App.Vent.bind('edit:show', function (data) {
  App.Controller.edit(data);
  App.Router.navigate('/edit');
});

$(function () {
  $app = $('#app');
  $tree = $('#tree');
  $edit = $('#edit');

  App.Router = new Router({
    controller: App.Controller
  });

  Backbone.history.start({pushState: true});
});
