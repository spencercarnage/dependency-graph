var assert = require('chai').assert;
var libsFixture = require('../../tests/fixtures/libs');
var EditView = require('../../src/views/edit');
var DepModel = require('../../src/models/dependency');
var EditModel = require('../../src/models/edit');
var _ = require('underscore');

// Mock App object
window.App = {
  Router: {
    navigate: function () {}
  },
  Vent: {
    trigger: function () {}
  }
};

describe('Edit View tests', function () {
  before(function () {
    this.$fixtures = $('#fixtures');
  });
  
  beforeEach(function () {
    this.MooToolsModel = new DepModel(libsFixture.mootools);
    this.MooToolsEditView = new EditView({
      model: new EditModel(_.extend({editModel: this.MooToolsModel }, this.MooToolsModel.toJSON()))
    });

    this.BackboneModel = new DepModel(libsFixture.backbone);
    this.BackboneEditView = new EditView({
      model: new EditModel(_.extend({editModel: this.BackboneModel}, this.BackboneModel.toJSON()))
    });

    this.$fixtures.append(this.MooToolsEditView.$el);
    this.$fixtures.append(this.BackboneEditView.$el);
  });

  afterEach(function () {
    this.$fixtures.html('');
    this.MooToolsEditView.remove();
    this.BackboneEditView.remove();
  });

  it('Should have a reference to the Model that Edit view is editing', function () {
    assert.equal(this.MooToolsEditView.model.get('editModel').cid, this.MooToolsModel.cid);
  });

  it('Should render the Edit view', function () {
    assert.equal(this.MooToolsEditView.$('#name').val(), 'mootools');
    assert.equal(this.MooToolsEditView.$('#version').val(), '1.4.5');
    assert.equal(this.MooToolsEditView.$('.edit-deps').children().length, 0);

    var $backboneDeps = this.BackboneEditView.$('.edit-deps').children();

    assert.equal(this.BackboneEditView.$('#name').val(), 'backbone');
    assert.equal(this.BackboneEditView.$('#version').val(), '1.0.0');
    assert.equal($backboneDeps.length, 2);
    assert.equal($backboneDeps.eq(0).find('.name').html(), 'underscore 1.5.0');
    assert.equal($backboneDeps.eq(1).find('.name').html(), 'jquery 1.8.0');
  });

  it('Should filter the Dependency collection view', function () {
    this.BackboneEditView.$('#filter').val('jq').trigger('keyup');
    assert.equal(this.BackboneEditView.$('.edit-deps').children().length, 1);

    this.BackboneEditView.$('#filter').val('u').trigger('keyup');
    assert.equal(this.BackboneEditView.$('.edit-deps').children().length, 2);

    this.BackboneEditView.$('#filter').val('').trigger('keyup');
    assert.equal(
      this.BackboneEditView.$('.edit-deps').children().length, 
      2,
      'should show all dependency views'
    );

    this.BackboneEditView.$('#filter').val('z').trigger('keyup');
    assert.equal(
      this.BackboneEditView.$('.edit-deps').children().length, 
      0,
      'should remove all dependency views'
    );
  });

  it('Should close the Edit view', function () {
    this.MooToolsEditView.$('.close').trigger('click');
    this.BackboneEditView.$('.close').trigger('click');
    assert.equal(this.$fixtures.html(), '');
  });
});
