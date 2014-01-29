module.exports = Backbone.Model.extend({
  initialize: function () {
    var deps = this.get('deps');
    var TreeNodeCollection;

    if (deps) {
      TreeNodeCollection = require('../collections/tree-node');

      this.deps = new TreeNodeCollection(deps);
      this.unset('deps');
    }
  }
});
