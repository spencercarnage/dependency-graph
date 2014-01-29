var Backbone = require('backbone');
var _ = require('underscore');
var EditModel = require('../models/edit');
var EditDepsModel = require('../models/edit-deps');
var EditDepsView = require('./edit-deps');
var GraphModel = require('../models/graph');

var EditView = Backbone.View.extend({
  className: 'edit-view',

  events: {
    'click .close': 'close',
    'keyup #filter': 'filter'
  },

  initialize: function () {
    this.render(); 
  },

  depsViews: [],

  template: _.template($('#edit-template').html()),

  render: function () {
    this.$el.html(this.template(this.model.toJSON()));

    var deps = this.model.get('deps');

    if (typeof deps !== 'undefined') {
      _.each(deps, function (dep, i) {
        var editDepsView = new EditDepsView({
          id: dep.name + '-' + dep.version.replace(/\./g, '-'),
          model: new GraphModel(dep)
        });
        
        editDepsView.$el.appendTo(this.$el.find('.edit-deps'));

        this.depsViews.push(editDepsView);
      }, this);
    }
  },

  close: function (event) {
    if (this.depsViews.length) {
      _.each(this.depsViews, function (dep) {
        console.log('close', dep.$el.html());
        dep.remove();
      }, this);
    }

    console.log('close', this.model.get('name'));
    this.remove();

    App.Router.navigate('', {trigger:true});
  },

  filter: function (event) {
    var depsCollection = this.model.get('depsCollection');
    var filterValue = this.$el.find('#filter').val().toLowerCase();
    var results = [];

    _.each(depsCollection.models, function (dep) {
      if (dep.get('name').match(filterValue)) {
        results.push('#' + dep.get('name').toLowerCase() + '-' + dep.get('version').replace(/\./g, '-'));
      } else if (dep.get('version').match(filterValue)) {
        results.push('#' + dep.get('name').toLowerCase() + '-' + dep.get('version').replace(/\./g, '-'));
      }
    });

    if (results) {
      this.$el.find('.edit-deps-item').hide();

      _.each(results, function (result) {
        this.$el.find(result).show();
      }, this);
    }

    if (filterValue === '') {
      this.$el.find('.edit-deps-item').show();
    }
  }
});

module.exports = EditView;
