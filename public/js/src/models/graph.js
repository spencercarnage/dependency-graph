var Backbone = require('backbone');
var _ = require('underscore');
var DependenciesCollection = require('../collections/dependencies');

var GraphModel = Backbone.Model.extend({
  url: '/api/dependencies',

  defaults: {
    deps: [],
    isChild: false,
    parentCid: null,
    depsCollection: null,
  },

  initialize: function () {
    this.createDeps();

    this.on('removeDeps', function (deps) {
      this.removeDeps(deps);
    }, this);

    this.on('addDeps', function (deps) {
      this.addDeps(deps);
    }, this);

  },

  addDeps: function (deps) {
    //this.set('deps', modelDeps);
    this.get('depsCollection').add(deps);
    this.set('deps', this.cleanDeps());
  },

  removeDeps: function (deps) {
    this.get('depsCollection').remove(deps);
    this.set('deps', this.cleanDeps());
  },

  createDeps: function () {
    this.set('depsCollection', new DependenciesCollection(this.get('deps'), {
      model: GraphModel
    }));

    return this;
  },

  cleanDeps: function () {
    return _.map(this.get('depsCollection').toJSON(), function (depObj) {
      return _.pick(depObj, ['name', 'version', 'deps']);
    });
  }
});

module.exports = GraphModel;
