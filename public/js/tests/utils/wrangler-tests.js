var wrangler = require('../../src/utils/wrangler');
var _ = require('underscore');
var TestModel = Backbone.Model.extend({ defaults: { isChild: false } });
var TestCollection = Backbone.Collection;
var GraphModel = require('../../src/models/graph');
var assert = require('chai').assert;

function assertChildren(children, parent) {
  _.each(children.models, function (kid, i) {
    assert.ok(kid.get('isChild'));
    assert.equal(kid.get('parentCid'), parent.cid);
  });
}

describe('wrangle nested parent-child relationships', function () {
  before(function () {
    //this.wrangledModels = wrangler(data, TestModel, TestCollection, 'deps');
  });

  it('should create parent models with kids', function () {
    var myLib = new GraphModel(dependenciesData[0]);
    var myLibDeps = myLib.get('depsCollection');

    var backbone = myLibDeps.findWhere({name: 'backbone'});
    var backboneDeps = backbone.get('depsCollection');
    var underscore = backboneDeps.findWhere({name: 'underscore'});
    var jquery = backboneDeps.findWhere({name: 'jquery'});

    var browserify = myLibDeps.findWhere({name: 'browserify'});
    var browserifyDeps = browserify.get('depsCollection');
    var browserPack = browserifyDeps.findWhere({name: 'browser-pack'});
    var moduleDeps = browserifyDeps.findWhere({name: 'module-deps'});
    var moduleDepsDeps = moduleDeps.get('depsCollection');
    var through = moduleDepsDeps.findWhere({name: 'through'});

    var angularRoutes = myLibDeps.findWhere({name: 'angular-routes'});

    // Test that all of the kids are there by checking the length of
    // the collections' models.
    assert.equal(backboneDeps.models.length, 2);
    assert.equal(browserifyDeps.models.length, 2);
    assert.equal(moduleDepsDeps.models.length, 1);

    //// Test which ones are the parents and which one are the children.
    assert.notOk(myLib.get('isChild'));
    assert.ok(backbone.get('isChild'));
    assert.ok(browserify.get('isChild'));
    assert.ok(angularRoutes.get('isChild'));
    assert.ok(underscore.get('isChild'));
    assert.ok(jquery.get('isChild'));
    assert.ok(browserPack.get('isChild'));
    assert.ok(moduleDeps.get('isChild'));
    assert.ok(through.get('isChild'));
    assertChildren(backboneDeps.models, backbone);
    assertChildren(browserifyDeps.models, browserify);
    assertChildren(moduleDepsDeps.models, moduleDeps);
  });
});
