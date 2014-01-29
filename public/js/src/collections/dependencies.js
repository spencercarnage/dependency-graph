var _ = require('underscore');
var Backbone = require('backbone');
var DepModel = require('../models/dependency');

var DependenciesCollection = Backbone.Collection.extend({
  model: DepModel
});

module.exports = DependenciesCollection;
