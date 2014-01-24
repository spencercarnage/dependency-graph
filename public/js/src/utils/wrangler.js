var _ = require('lodash');

/**
 * "Wrangles" nested data structures into proper parent-child relationships
 * @param {Object} data Nested data object
 * @param {Object} model Model used for creating the parent and child
 * @param {Object} childCollection Collection used for child models
 * @param {String} childKey Name of key used on data arg for indicating the
 *                          array of children 
 * @param {Object} parent Optional parent model for the child
 */
function wrangle(data, Model, ChildCollection, childKey, parent) {
  var wrangled = [];
  var parentCount = 0;
  var childCount = 0;

  wrangled = _.map(data, function (item, i) {
    var model = new Model(item);
    var children;

    if (typeof parent !== 'undefined') {
      parentCount++;
      model.set('isChild', true);
      model.set('parentCid', parent.cid);

      parent.get(childKey + 'Collection').add(model);
    }

    if (_.isArray(item[childKey])) {
      children = new ChildCollection({
        model: Model
      });

      children.reset();

      model.set(childKey + 'Collection', children);

      children.add(wrangle(item[childKey], Model, ChildCollection, childKey, model));
    }
    
    return model;
  });

  return wrangled;
}

module.exports = wrangle;
