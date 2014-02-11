var Backbone = require('backbone');
var _ = require('underscore');
var EditModel = require('../models/edit');
var EditDepsView = require('./edit-deps');
var DepModel = require('../models/dependency');
require('../../vendor/jquery.validate');

var EditView = Backbone.View.extend({
  className: 'edit-view',

  events: {
    'click .close': 'close',
    'keyup #filter': 'filter'
  },

  validator: null,

  initialize: function () {
    this.render(); 
  },

  depsViews: {},

  template: _.template($('#edit-template').html()),

  render: function () {
    this.$el.html(this.template(this.model.toJSON()));

    var deps = this.model.get('editModel').get('depsCollection');
    var self = this;

    if (typeof deps !== 'undefined') {
      this.renderDependencies(deps.models);
    }

    this.$('form').validate({
      submitHandler: function (form) {
        self.saveModel($(form).serializeArray());
      }
    });
  },

  saveModel: function (formData) {
    var depsCollection = this.model.get('editModel').get('depsCollection');
    var depModelsToDelete = [];
    var changes = {};
    var addValue = this.$('#add').val().trim();

    _.each(this.$('input[type="checkbox"]:checked'), function (input) {
      depModelsToDelete.push(depsCollection.get($(input).attr('data-dep-cid')));
    });

    _.each(formData, function (item) {
      if (item.name === 'name' || item.name === 'version') {
        changes[item.name] = item.value;
      }
    });

    if (addValue) {
      App.Vent.trigger('edit:addDeps', {name: addValue});
    }

    if (depModelsToDelete.length) {
      App.Vent.trigger('edit:removeDeps', depModelsToDelete);
    }

    App.Vent.trigger('edit:save', changes);
  },

  removeDependencies: function () {
    _.each(this.depsViews, function (view) {
      delete this.depsViews[view.model.cid];
      view.remove();
    }, this);
  },

  renderDependencies: function (models) {
    this.removeDependencies();

    _.each(models, function (depModel, i) {
      depModel.set('depCid', depModel.cid);

      var editDepsView = new EditDepsView({
        id: depModel.get('name') + '-' + depModel.get('version').replace(/\./g, '-'),
        model: depModel
      });
      
      editDepsView.$el.appendTo(this.$el.find('.edit-deps'));

      this.depsViews[depModel.cid] = editDepsView;
    }, this);
  },

  close: function (event) {
    if (this.depsViews.length) {
      _.each(this.depsViews, function (dep) {
        dep.remove();
      }, this);
    }

    this.remove();

    App.Router.navigate('', {trigger:true});
  },

  filter: function (event) {
    var depsCollection = this.model.get('editModel').get('depsCollection');
    var filterValue = this.$el.find('#filter').val().trim().toLowerCase();
    var filterValueRE = new RegExp(filterValue);
    var results = [];

    _.each(depsCollection.models, function (dep) {
      if (filterValueRE.test(dep.get('name')) || filterValueRE.test(dep.get('version'))) {
        results.push(dep.cid);
      }
    });

    this.renderDependencies(_.map(results, function (cid) {
      return depsCollection.get(cid);
    }));
  }
});

module.exports = EditView;
