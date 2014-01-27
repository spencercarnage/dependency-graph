var Backbone = require('backbone');
var _ = require('underscore');
var EditModel = require('../models/edit');
var EditDepsModel = require('../models/edit-deps');
var EditDepsView = require('./edit-deps');

var EditView = Backbone.View.extend({
  className: 'edit-view',

  events: {
    'click .close': 'close'
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
          model: new EditDepsModel(dep)
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
  }
});

module.exports = EditView;
