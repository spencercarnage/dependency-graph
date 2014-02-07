window._ = require('underscore');
window.Backbone = require('backbone');
Backbone.$ = jQuery;

// mustache style templates
_.templateSettings = {
  interpolate : /\{\{(.+?)\}\}/g
};

require('./models/dependency-tests');
require('./views/dependency-branch-tests');
require('./views/edit-tests');
