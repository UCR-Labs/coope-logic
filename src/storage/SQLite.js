const sqlite3 = require("sqlite3").verbose();

class SQLiteFunctions {
  SetValue(db, key, value, callback) {
    if (!key || !value) {
      return callback(new Error("Invalid key or value"));
    }

    db.run(
      "INSERT INTO kv (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value",
      [key, value],
      function (err) {
        callback(err);
      }
    );
  }
}

module.exports = SQLiteFunctions;
