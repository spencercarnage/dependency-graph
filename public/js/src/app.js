window.$ = require('jquery');
var _ = require('underscore');

// mustache style templates
_.templateSettings = {
  interpolate : /\{\{(.+?)\}\}/g
};

var Backbone = require('backbone');
Backbone.$ = window.$;
var wrangler = require('./utils/wrangler');
var AppView = require('./views/app');
var GraphView = require('./views/graph');
var GraphModel = require('./models/graph');
var EditView = require('./views/edit');
var EditModel = require('./models/edit');
var DependenciesCollection = require('./collections/dependencies');
var DependencyModel = require('./models/dependency');
var graphView;
var models = {};
var $app;
window.App = {};

App.Dependencies = wrangler(
  dependenciesData, 
  DependencyModel, 
  DependenciesCollection, 
  'deps'
); 

App.GraphViews = [];

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
    _.each(dependenciesData, function (data, i) {
      var graphView = new GraphView({
        model: new GraphModel(data)
      })
      
      $app.html(graphView.$el);

      App.GraphViews.push(graphView);
    }, this);
  },

  edit: function (data) {
    this.controller.edit(data);
  }
});

function Controller() {
  this.edit = function (data) {
    if (typeof data !== 'undefined') {
      console.log(App.GraphViews);
      if (App.GraphViews.length) {
        _.each(App.GraphViews, function (graphView) {
          graphView.close();
        });
      }

      App.EditView = new EditView({
        model: new EditModel(data)
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
