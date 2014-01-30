var assert = require('chai').assert;
var DependenciesCollection = require('../../src/collections/dependencies');
var DepModel = require('../../src/models/dependency');

var mootoolsData = {name: 'mootools', version: '1.4.5'};
var backboneData = {
  name: 'backbone',
  version: '1.0.0',
  deps: [
    {name: 'underscore', version: '1.5.0'},
    {name: 'jquery', version: '1.8.0'}
  ]
};

describe('Dependency Model', function () {
  beforeEach(function () {
    this.mootools = new DepModel(mootoolsData);
    this.backbone = new DepModel(backboneData);
  });

  afterEach(function () {
    this.mootools = undefined;
    this.backbone = undefined;
  });

  it('should not build a depsCollection for a library with no deps', function () {
  });

  it('should build a dep collection', function () {
    var backboneDeps = this.backbone.get('depsCollection');
    var mootoolsDeps = this.mootools.get('depsCollection');

    assert.isNotNull(mootoolsDeps);
    assert.isNotNull(backboneDeps);
    assert.equal(mootoolsDeps.models.length, 0);
    assert.equal(backboneDeps.models.length, 2);
  });

  it('should remove 1 dep from the backbone deps collection', function () {
    var backboneDeps = this.backbone.get('depsCollection');
    var underscore = backboneDeps.findWhere({name: 'underscore'});

    this.backbone.trigger('removeDeps', underscore);

    assert.equal(
      backboneDeps.models.length, 
      1,
      'backbone depsCollection models should have length of 1'
    );

    assert.isUndefined(
      backboneDeps.findWhere({name: 'underscore'}),
      'findWhere with "underscore" should return undefined'
    );

    assert.equal(
      this.backbone.get('deps').length, 
      1,
      'model deps attribute should have length of 1'
    );
  });

  it('should remove multiple deps from the backbone deps collection, leaving no deps', function () {
    var backboneDeps = this.backbone.get('depsCollection');
    var underscore = backboneDeps.findWhere({name: 'underscore'});
    var jquery = backboneDeps.findWhere({name: 'jquery'});

    this.backbone.trigger('removeDeps', [underscore, jquery]);

    assert.equal(
      backboneDeps.models.length, 
      0,
      'backbone depsCollection models should have length of 0'
    );

    assert.isUndefined(
      backboneDeps.findWhere(underscore),
      'findWhere with "underscore" should return undefined'
    );

    assert.isUndefined(
      backboneDeps.findWhere(jquery),
      'findWhere with "underscore" should return undefined'
    );

    assert.equal(
      this.backbone.get('deps').length, 
      0,
      'model deps attribute should have length of 0'
    );
  });

  it('should remove multiple deps from the backbone deps collection, leaving remaining deps', function () {
    var backboneDeps = this.backbone.get('depsCollection');
    var someLib = backboneDeps.add({name: 'some lib', version: '0.0.1'});
    var underscore = backboneDeps.findWhere({name: 'underscore'});
    var jquery = backboneDeps.findWhere({name: 'jquery'});

    this.backbone.trigger('removeDeps', [underscore, jquery]);

    assert.equal(
      backboneDeps.models.length, 
      1,
      'backbone depsCollection models should have length of 1'
    );

    assert.isUndefined(
      backboneDeps.findWhere(underscore),
      'findWhere with "underscore" should return undefined'
    );

    assert.isUndefined(
      backboneDeps.findWhere(jquery),
      'findWhere with "underscore" should return undefined'
    );

    assert.isUndefined(
      backboneDeps.findWhere(someLib),
      'findWhere with "someLib" should be defined'
    );

    assert.equal(
      this.backbone.get('deps').length, 
      1,
      'model deps attribute should have length of 1'
    );
  });

  it('should add a dep to the collection for backbone deps', function () {
    var backboneDeps = this.backbone.get('depsCollection');

    this.backbone.trigger('addDeps', {name: 'pluploader', version: '0.3.4'});

    assert.equal(backboneDeps.models.length, 3);
    assert.isDefined(backboneDeps.findWhere({name: 'pluploader'}));
  });

  it('should add a dep to a dep-less library', function () {
    this.mootools.trigger('addDeps', {name: 'MooTools More', version: '0.5.0'});
                        
    assert.isNotNull(this.mootools.get('depsCollection'));
    assert.equal(this.mootools.get('depsCollection').models.length, 1);
  });
});
