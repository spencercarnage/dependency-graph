var _ = require('underscore');
var Backbone = require('backbone');
var DependencyModel = require('../models/dependency');

var DependenciesCollection = Backbone.Collection.extend({
  model: DependencyModel
});

module.exports = DependenciesCollection;
