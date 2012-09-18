var resume = {};

/**
 * Data store
 * @interface
 */
resume.Store = function () {};

/**
 * Get the value associated with a particular key.
 * @param {!string} key
 * @return {Object}
 */
resume.Store.prototype.getValue = function(key) { return null; };

/**
 * Expose 'resume.Store' interface.
 */
module.exports = resume.Store;