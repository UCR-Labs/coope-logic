const assert = require("assert");
const sqlite3 = require("sqlite3").verbose();
const SQLite = require("../../src/storage/SQLite");
const SQLiteFunctions = require("../../src/storage/SQLite");

describe("SQLiteTestUnits", function () {
  let db;
  const sqliteFunct = new SQLiteFunctions();
  beforeEach(function (done) {
    db = new sqlite3.Database(":memory:");
    db.serialize(() => {
      db.run("CREATE TABLE kv (key TEXT PRIMARY KEY, value TEXT)", done);
    });
  });

  afterEach(function (done) {
    db.close(done);
  });

  describe("SetValueSuccess()", function () {
    it("should save a key-value pair", function (done) {
      sqliteFunct.SetValue(db, "key1", "value1", (err) => {
        assert.strictEqual(err, null);
        db.get("SELECT value FROM kv WHERE key = ?", ["key1"], (err, row) => {
          assert.strictEqual(err, null);
          assert.strictEqual(row.value, "value1");
          done();
        });
      });
    });
  });

  describe("SetValueUpdateValue()", function () {
    it("should update the value for an existing key", function (done) {
      sqliteFunct.SetValue(db, "key1", "value1", (err) => {
        assert.strictEqual(err, null);
        sqliteFunct.SetValue(db, "key1", "value2", (err) => {
          db.get("SELECT value FROM kv WHERE key = ?", ["key1"], (err, row) => {
            assert.strictEqual(err, null);
            assert.strictEqual(row.value, "value2");
            done();
          });
        });
      });
    });
  });

  describe("SetValueError()", function () {
    it("should update the value for an existing key", function (done) {
      sqliteFunct.SetValue(db, null, "value1", (err) => {
        assert(err instanceof Error);
        sqliteFunct.SetValue(db, "key", null, (err) => {
          assert(err instanceof Error);
          done();
        });
      });
    });
  });
});
