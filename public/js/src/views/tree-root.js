var TreeView = require('./tree');

module.exports = Backbone.Marionette.CollectionView.extend({
  tagName: 'ul',
  itemView: TreeView
});
