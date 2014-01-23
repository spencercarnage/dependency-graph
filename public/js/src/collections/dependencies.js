var Backbone = require('backbone');
var _ = require('lodash');
var DependencyModel = require('../models/dependency');

var DependenciesCollection = Backbone.Collection.extend({
  model: DependencyModel
});

module.exports = DependenciesCollection;
