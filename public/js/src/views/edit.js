var Backbone = require('backbone');
var _ = require('underscore');
var EditModel = require('../models/edit');
var EditDepsModel = require('../models/edit-deps');
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

  depsViews: [],

  template: _.template($('#edit-template').html()),

  render: function () {
    this.$el.html(this.template(this.model.toJSON()));

    var deps = this.model.get('depsCollection');
    var self = this;

    if (typeof deps !== 'undefined') {
      _.each(deps.models, function (depModel, i) {
        var cid = depModel.cid;

        var editDepsModel = new DepModel(depModel.toJSON());
        editDepsModel.set('depCid', depModel.cid);

        var editDepsView = new EditDepsView({
          id: depModel.get('name') + '-' + depModel.get('version').replace(/\./g, '-'),
          model: editDepsModel
        });
        
        editDepsView.$el.appendTo(this.$el.find('.edit-deps'));

        this.depsViews.push(editDepsView);
      }, this);
    }

    this.$('form').validate({
      submitHandler: function (form) {
        var depsCollection = self.model.get('depsCollection');
        var depModelsToDelete = [];
        var changes = {};

        _.each(self.$('input[type="checkbox"]:checked'), function (input) {
          depModelsToDelete.push(depsCollection.get($(input).attr('data-dep-cid')));
        });

        _.each($(form).serializeArray(), function (item) {
          if (item.name === 'name' || item.name === 'version') {
            changes[item.name] = item.value;
          }
        });

        if (depModelsToDelete.length) {
          self.model.get('editModel').trigger('removeDeps', depModelsToDelete);
        }

        self.model.get('editModel').set(changes);
        App.Vent.trigger('edit:save', self.model, changes);
      }
    });
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
