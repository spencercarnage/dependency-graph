var _ = require('lodash');
var DependencyModel = require('../../src/model/dependency');

describe('Dependency Model', function () {
  before(function () {
    this.dependency = new DependencyModel();
  });

  after(function () {
    this.dependency = null;
  });

});
