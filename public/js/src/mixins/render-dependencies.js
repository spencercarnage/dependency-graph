module.exports = {
  renderDependency: function (DepModel, DepView, parentModel, parentView) {
    var graphItemView = new DepView({
      //el: parentView.$el.children('ul').eq(0),
      model: DepModel
    }).$el.appendTo(parentView.$el.children('ul').eq(0));

    parentView.dependenciesViews.push(graphItemView);
  }
};
