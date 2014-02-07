var Backbone = require('backbone');
var _ = require('underscore');
//var DependenciesCollection = require('../collections/dependencies');

var DepModel = Backbone.Model.extend({
  url: '/api/dependencies',

  defaults: {
    deps: [],
    isChild: false,
    parentCid: null,
    depsCollection: null,
    version: '0.0.0'
  },

  initialize: function (options) {
    this.createDeps();

    this.on('removeDeps', function (deps) {
      console.log('model removedeps', deps);
      var self = this;
      setTimeout(function () {
        console.log(self.get('depsCollection'));
      }, 2000);
      this.removeDeps(deps);
    }, this);

    this.on('addDeps', function (deps) {
      this.addDeps(deps);
    }, this);

  },

  /**
   * Add dependencies to the model's dependencies collection
   */
  addDeps: function (deps) {
    this.get('depsCollection').add(deps);
    this.set('deps', this.cleanDeps());
  },

  /**
   * Remove dependencies to the model's dependencies collection
   */
  removeDeps: function (deps) {
    console.log('remove me', deps);
    this.get('depsCollection').remove(deps);
    console.log(this.get('depsCollection').models.length);
    this.set('deps', this.cleanDeps());
  },

  /**
   * Create this model's dependencies collection.
   */
  createDeps: function () {
    this.set('depsCollection', new Backbone.Collection(this.get('deps'), {
      model: DepModel
    }));

    return this;
  },

  cleanDeps: function () {
    return _.map(this.get('depsCollection').toJSON(), function (depObj) {
      return _.pick(depObj, ['name', 'version', 'deps']);
    });
  }
});

module.exports = DepModel;

