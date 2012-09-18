var resume = {}; //namespace

/**
 * Data store
 * @implements {resume.Store}
 * @param {Object|string} data Object or JSON string
 */
resume.JsonStore = function(data) {
  if (typeof data === 'string') this.data = JSON.parse(data);
  else this.data = data;
};

/**
 * Data object parsed from the JSON source
 * @type {Object}
 * @private
 */
resume.JsonStore.prototype.data = null;

/**
 * Get the value associated with a particular key.
 * @param {!string} key
 * @return {Object} Returns null if key is not found.
 */
resume.JsonStore.prototype.getValue = function(key) {
  if (typeof this.data[key] !== 'undefined') return this.data[key];
  return null;
};

/**
 * Expose 'Store' interface.
 */
module.exports = resume.JsonStore;