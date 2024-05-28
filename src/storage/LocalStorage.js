class LocalStorage {
  SetKeyValue(key, value, callback) {
    if (!key || !value) {
      return callback(new Error("Invalid key or value"));
    }

    try {
      localStorage.setItem(key, value);
      callback(null);
    } catch (err) {
      callback(err);
    }
  }

  GetKeyValue(key, callback) {
    try {
      const value = localStorage.getItem(key);
      callback(null, value);
    } catch (err) {
      callback(err);
    }
  }
}

module.exports = LocalStorage;
