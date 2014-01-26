var fs = require('fs');
var data = JSON.parse(fs.readFileSync('./models/dependencies.json').toString());
var wrangler = require('../../src/utils/wrangler');
var Backbone = require('backbone');
var _ = require('lodash');
var DependenciesCollection = require('../../src/collections/dependencies');
var GraphModel = require('../../src/models/graph');
var assert = require('chai').assert;

describe('Graph Model', function () {
  before(function () {
    this.wrangledModels = wrangler(data, GraphModel, DependenciesCollection, 'deps');
  });

  beforeEach(function () {
    this.myLib = new GraphModel(data[0]);
    this.myLibDeps = this.myLib.get('depsCollection');
  });

  it('should build a dep collection for myLib', function () {
    assert.isNotNull(this.myLibDeps);
    assert.equal(this.myLibDeps.models.length, 3);
  });

  it('should remove a dep from the collection for myLib', function () {
    this.myLib.trigger('removeDeps', this.myLibDeps.findWhere({name: 'backbone'}));

    assert.equal(this.myLib.get('depsCollection').models.length, 2);
    assert.isUndefined(this.myLibDeps.findWhere({name: 'backbone'}));
  });

  it('should add a dep to the collection for myLib', function () {
    this.myLib.trigger('addDeps', {name: 'pluploader', version: '0.3.4'});

    assert.equal(this.myLib.get('depsCollection').models.length, 4);
    assert.isDefined(this.myLibDeps.findWhere({name: 'pluploader'}));
  });
});
