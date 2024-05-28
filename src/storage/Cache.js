"use strict";
class Cache {
  constructor() {
    this.cache = {};
  }

  SetKeyValue(key, value, callback) {
    if (!key || !value) {
      return callback(new Error("Invalid key or value"));
    }
    this.cache[key] = value;
    callback(null);
  }

  GetKeyValue(key, callback) {
    try {
      const value = this.cache[key] !== undefined ? this.cache[key] : null;
      callback(null, value);
    } catch (err) {
      callback(err);
    }
  }
}

module.exports = Cache;
