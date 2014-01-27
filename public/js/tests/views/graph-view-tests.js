var assert = require('chai').assert;
var _ = require('underscore');
var GraphView = require('../../src/views/graph');
var GraphModel = require('../../src/models/graph');
var GraphItemView = require('../../src/views/graph-item');
var DependencyModel = require('../../src/models/dependency');
var DependenciesCollection = require('../../src/collections/dependencies');

describe('Graph View', function () {
  before(function () {
    this.$fixture = $('<ul id="graph"/>');

    this.views = {};
  });

  beforeEach(function () {
    this.$fixture.empty().appendTo($('#fixture'));

    _.each(dependenciesData, function (item, i) {
      this.views[item.name] = new GraphView({
        el: this.$fixture,
        model: new GraphModel(item)
      });
    }, this);

    this.myLibView = this.views['my-library'];
  });

  after(function () {
    $('#fixtures').empty();
  });

  it('should have nested children that match the data structure', function () {
    var data = dependenciesData[0];

    this.myLibView.model.once('change', function () {
      // Test the backbone dependency tree. If this looks good, they should all
      // look good.
      var $backboneLI = this.myLibView.$el.find('li[id^=backbone]');
      var backboneData = data.deps[0];

      assert.equal($backboneLI.text(), backboneData.name + ' ' + backboneData.version);
      assert.equal($backboneLI.text(), backboneData.name + ' ' + backboneData.version);
      console.log(this.myLibView.model.get('depsCollection'));
    }, this);

    this.myLibView.model.trigger('change');
  });
});
