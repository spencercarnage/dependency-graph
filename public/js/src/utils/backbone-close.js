// Shamelessly borrowed from // http://coenraets.org/blog/2012/01/backbone-js-lessons-learned-and-improved-sample-app/

module.exports = function () {
  if (this.beforeClose) {
    this.beforeClose();
  }

  this.remove();
  this.unbind();
};
