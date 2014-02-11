var assert = require('chai').assert;
var DepModel = require('../../src/models/dependency');
var DepBranchView = require('../../src/views/dependency-branch');
var DepLeafView = require('../../src/views/dependency-leaf');
var LeavesCollection = require('../../src/collections/leaves');

var mootoolsData = {name: 'mootools', version: '1.4.5'};
var backboneData = {
  name: 'backbone',
  version: '1.0.0',
  deps: [
    {name: 'underscore', version: '1.5.0'},
    {name: 'jquery', version: '1.8.0'}
  ]
};

function setup() {
  this.mootoolsBranch = new DepBranchView({
    leavesCollection: new LeavesCollection(mootoolsData),
    model: new DepModel(mootoolsData)
  });

  this.backboneBranch = new DepBranchView({
    leavesCollection: new LeavesCollection(backboneData),
    model: new DepModel(backboneData)
  });
}

function teardown() {
  this.mootoolsBranch = undefined;
  this.backboneBranch = undefined;
}

describe('Branch View', function () {
  beforeEach(function () {
    setup.call(this);
  });

  it("should render the MooTools Branch", function () {
    assert.equal(
      $('<div>').append(this.mootoolsBranch.$el.clone()).html(),
      '<ul class="dependency-branch">' + 
        '<li class="dependency-leaf">' +
          '<a href="/edit" class="edit-dep">' +
            '<span class="dep-name">mootools</span> ' +
            '<span class="dep-version">1.4.5</span>' + 
          '</a>' +
        '</li>' +
      '</ul>',
      "Assert branch markup"
    );
  });

  it("should render the Backbone dependency leaf", function () {
    assert.equal(
      $('<div>').append(this.backboneBranch.$el.clone()).html(),
      '<ul class="dependency-branch">' +
        '<li class="dependency-leaf">' +
          '<a href="/edit" class="edit-dep">' +
            '<span class="dep-name">backbone</span> ' +
            '<span class="dep-version">1.0.0</span>' + 
          '</a>' +
          '<ul class="dependency-branch">' +
            '<li class="dependency-leaf">' +
              '<a href="/edit" class="edit-dep">' +
                '<span class="dep-name">underscore</span> ' +
                '<span class="dep-version">1.5.0</span>' + 
              '</a>' +
            '</li>' + 
            '<li class="dependency-leaf">' +
              '<a href="/edit" class="edit-dep">' +
                '<span class="dep-name">jquery</span> ' +
                '<span class="dep-version">1.8.0</span>' + 
              '</a>' +
            '</li>' + 
          '</ul>' + 
        '</li>' +
      '</ul>',
      "Should render a LI leaf for Backbone with child UL branches"
    );
  });
});

