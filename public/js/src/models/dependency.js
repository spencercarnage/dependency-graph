var Backbone = require('backbone');
var _ = require('underscore');

module.exports = Backbone.Model.extend({
  defaults: {
    isChild: false,
    parentCid: null
  },
  initialize: function () {
    //console.log(this.attributes);
  }
});

