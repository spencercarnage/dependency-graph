window.$ = require('jquery');
var _ = require('lodash');
var Backbone = require('backbone');
Backbone.$ = window.$;
var GraphView = require('./views/graph');
var GraphModel = require('./models/graph');
var DependenciesCollection = require('./collections/dependencies');
var DependencyModel = require('./models/dependency');
var graphView;
var models = {};

function bootstrapDeps(data, parent) {
  _.each(data, function (dependency, i) {
    var model = models[dependency.name] = new DependencyModel(dependency);

    if (typeof parent !== 'undefined') {
      model.set('isChild', true);
      model.set('parentCid', parent.cid);
      console.log(model.attributes);
    }

    if (_.isArray(dependency.deps)) {
      model.set('dependencies', new DependenciesCollection(dependency.deps));

      bootstrapDeps(dependency.deps, model);
    }
  });
}

bootstrapDeps(dependenciesData);

$(function () {
  graphView = new GraphView({
    model: new GraphModel()
  });

  //var dependencies = new DependenciesCollection();
  //dependencies.reset(dependenciesData);
  //console.log(dependencies.toJSON());
});
