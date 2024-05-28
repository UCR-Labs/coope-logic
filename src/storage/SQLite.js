const sqlite3 = require("sqlite3").verbose();

class SQLiteFunctions {
  SetKeyValue(db, key, value, callback) {
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

  GetKeyValue(db, key, callback) {
    try {
      db.get("SELECT value FROM kv WHERE key = ?", [key], (err, row) => {
        callback(null, row ? row.value : null);
      });
    } catch (err) {
      callback(err);
    }
  }
}

module.exports = SQLiteFunctions;
