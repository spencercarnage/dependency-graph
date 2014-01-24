var wrangler = require('../../src/utils/wrangler');
var Backbone = require('backbone');
var _ = require('lodash');
var TestModel = Backbone.Model.extend({
  defaults: {
    isChild: false
  }
});
var TestCollection = Backbone.Collection;
var assert = require('chai').assert;

describe('wrangle nested parent-child relationships', function () {
  before(function () {
    this.nestedModels = [
      //{ name: 'foo', },
      { name: 'baz', kids: [
          { name: 'bazzy' }, 
          { name: 'bozzie', kids: [ { name: 'timmy', }, { name: 'sally' } ] },
          { name: 'billy' }
        ]
      },
      //{ name: 'bar', kids: [ { name:'barry' }, ], },
      //{ name:'bart', kids: [{name: 'bob'}] }
    ];
  });

  it('should create parent models with kids', function () {
    var wrangledModels = wrangler(this.nestedModels, TestModel, TestCollection, 'kids');
    var parent = wrangledModels[0];
    var kidsCollection = wrangledModels[0].get('kidsCollection');

    var withGrandKidsCollections = _.filter(kidsCollection.models, function (kid, i) {
      var grandKids = kid.get('kidsCollection');

      return typeof grandKids !== 'undefined';
    });

    assert.notOk(parent.get('isChild'));
    assert.equal(kidsCollection.models.length, 3);
    assert.equal(withGrandKidsCollections[0].get('kidsCollection').models.length, 2);
  });
});
