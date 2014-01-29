window.$ = window.jQuery = require('jquery');
window._ = require('underscore');

// mustache style templates
_.templateSettings = {
  interpolate : /\{\{(.+?)\}\}/g
};

window.Backbone = require('backbone');
Backbone.$ = window.$;
//require('../vendor/backbone.marionette');
var AppView = require('./views/app');
var DepTreeView = require('./views/dependency-branch');
var Leaves = require('./collections/leaves');
//var TreeView = require('./views/tree');
//var TreeRoot = require('./views/tree-root');
//var TreeNodeCollection = require('./collections/tree-node');
var DepModel = require('./models/dependency');
var EditView = require('./views/edit');
var EditModel = require('./models/edit');
var DependenciesCollection = require('./collections/dependencies');
var DependencyModel = require('./models/dependency');
var depTreeView;
var models = {};
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
    //var treeCollection = new TreeNodeCollection(dependenciesData);

    //var treeview = new treeroot({
    //  collection: treecollection
    //});

    //treeview.render();
    //
    //$app.html(treeview.$el);

    //app.treeview = treeview;
    var branches = new DependenciesCollection(dependenciesData);

    $app.html('');

    _.each(branches.models, function (branch) {
      console.log('branch', branch.get('name'));
      var depTree = new DepTreeView({
        model: new DepModel(branch)
      });

      depTree.render();

      $app.append(depTree.$el);
    });
  },

  edit: function (data) {
    this.controller.edit(data);
  }
});

function Controller() {
  this.edit = function (data) {
    if (typeof data !== 'undefined') {
      App.EditView = new EditView({
        model: new DepModel(data)
        //model: new EditModel(data)
      });
      
      $app.html(App.EditView.$el);
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

  App.Router = new Router({
    controller: App.Controller
  });

  Backbone.history.start({pushState: true});
});
