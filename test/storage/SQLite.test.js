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

  describe("SetKeyValueSuccess()", function () {
    it("should save a key-value pair", function (done) {
      sqliteFunct.SetKeyValue(db, "key1", "value1", (err) => {
        assert.strictEqual(err, null);
        db.get("SELECT value FROM kv WHERE key = ?", ["key1"], (err, row) => {
          assert.strictEqual(err, null);
          assert.strictEqual(row.value, "value1");
          done();
        });
      });
    });
  });

  describe("SetKeyValueUpdateValue()", function () {
    it("should update the value for an existing key", function (done) {
      sqliteFunct.SetKeyValue(db, "key1", "value1", (err) => {
        assert.strictEqual(err, null);
        sqliteFunct.SetKeyValue(db, "key1", "value2", (err) => {
          db.get("SELECT value FROM kv WHERE key = ?", ["key1"], (err, row) => {
            assert.strictEqual(err, null);
            assert.strictEqual(row.value, "value2");
            done();
          });
        });
      });
    });
  });

  describe("SetKeyValueError()", function () {
    it("should handle invalid inputs", function (done) {
      sqliteFunct.SetKeyValue(db, null, "value1", (err) => {
        assert(err instanceof Error);
        sqliteFunct.SetKeyValue(db, "key", null, (err) => {
          assert(err instanceof Error);
          done();
        });
      });
    });
  });

  describe("GetKeyValueSuccess()", function () {
    it("should retrieve the value for an existing key", function (done) {
      db.run(
        "INSERT INTO kv (key, value) VALUES (?, ?)",
        ["key1", "value1"],
        (err) => {
          assert.strictEqual(err, null);
          sqliteFunct.GetKeyValue(db, "key1", (err, value) => {
            assert.strictEqual(err, null);
            assert.strictEqual(value, "value1");
            done();
          });
        }
      );
    });
  });

  describe("GetKeyValueReturnNullOrNon-Existing()", function () {
    it("should return null for a non-existing key", function (done) {
      sqliteFunct.GetKeyValue(db, "nonExistingKey", (err, value) => {
        assert.strictEqual(err, null);
        assert.strictEqual(value, null);
        done();
      });
    });
  });

  describe("GetKeyValueReturnError()", function () {
    it("should handle database errors gracefully", function (done) {
      // Close the database to force an error
      db.close(() => {
        sqliteFunct.GetKeyValue(db, "key1", (err, value) => {
          assert(err instanceof Error);
          assert.strictEqual(value, undefined);
          done();
        });
      });
    });
  });
});
