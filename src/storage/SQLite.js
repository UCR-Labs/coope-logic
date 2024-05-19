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
    db.get("SELECT value FROM kv WHERE key = ?", [key], (err, row) => {
      if (err) {
        return callback(err);
      }
      callback(null, row ? row.value : null);
    });
  }
}

module.exports = SQLiteFunctions;
