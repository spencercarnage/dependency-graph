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
          '<a href="/edit" class="edit-dep">mootools 1.4.5</a>' +
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
          '<button class="view-deps">view dependencies</button>' +
          '<a href="/edit" class="edit-dep">backbone 1.0.0</a>' +
          '<ul class="dependency-branch">' +
            '<li class="dependency-leaf">' +
              '<a href="/edit" class="edit-dep">underscore 1.5.0</a>' +
            '</li>' + 
            '<li class="dependency-leaf">' +
              '<a href="/edit" class="edit-dep">jquery 1.8.0</a>' +
            '</li>' + 
          '</ul>' + 
        '</li>' +
      '</ul>',
      "Should render a LI leaf for Backbone with child UL branches"
    );
  });
});

