var Backbone = require('backbone');
var _ = require('lodash');
var DependenciesCollection = require('../collections/dependencies');

var GraphModel = Backbone.Model.extend({
  url: '/api/dependencies',
  defaults: {
    deps: [],
    isChild: false,
    parentCid: null
  },

  depsCollection: null,

  initialize: function () {
    if (this.get('deps').length) {
      this.set('depsCollection', new DependenciesCollection(this.get('deps'), {
        model: GraphModel
      }));
    }

    this.on('removeDeps', function (deps) {
      this.get('depsCollection').remove(deps);
    }, this);

    this.on('addDeps', function (deps) {
      this.get('depsCollection').add(deps);
    }, this);
  }
});

module.exports = GraphModel;
