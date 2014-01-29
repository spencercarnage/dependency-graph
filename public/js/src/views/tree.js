var Backbone = require('backbone');

module.exports = Backbone.Marionette.CompositeView.extend({
  tagName: 'li',

  template: '#tree-template',

  initialize: function () {
    this.collection = this.model.deps;

  },

  appendHtml: function (currentView, itemView) {
    console.log(this.$el.html());
    currentView.$('ul:first').append(itemView.el);

    if (typeof this.collection  !== 'undefined') {
      var $button = $('<button class="toggle-deps">toggle</button>');
      
      this.$el.prepend($button);
    }
  }
});
