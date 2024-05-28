const assert = require("assert");
const CacheFunctions = require("../../src/storage/Cache");

describe("CacheTestUnits", function () {
  const cacheFunct = new CacheFunctions();

  describe("SetKeyValueSuccess()", function () {
    it("should save a key-value pair", function (done) {
      cacheFunct.SetKeyValue("key1", "value1", (err) => {
        assert.strictEqual(err, null);
        const value = cacheFunct.cache["key1"];
        assert.strictEqual(value, "value1");
        done();
      });
    });
  });

  describe("SetKeyValueUpdateValue()", function () {
    it("should update the value for an existing key", function (done) {
      cacheFunct.SetKeyValue("key1", "value1", (err) => {
        assert.strictEqual(err, null);
        cacheFunct.SetKeyValue("key1", "value2", (err) => {
          assert.strictEqual(err, null);
          const value = cacheFunct.cache["key1"];
          assert.strictEqual(value, "value2");
          done();
        });
      });
    });
  });

  describe("SetKeyValueError()", function () {
    it("should handle invalid inputs", function (done) {
      cacheFunct.SetKeyValue(null, "value1", (err) => {
        assert(err instanceof Error);
        cacheFunct.SetKeyValue("key", null, (err) => {
          assert(err instanceof Error);
          done();
        });
      });
    });
  });

  describe("GetKeyValueSuccess()", function () {
    it("should retrieve the value for an existing key", function (done) {
      cacheFunct.cache["key1"] = "value1";
      cacheFunct.GetKeyValue("key1", (err, value) => {
        assert.strictEqual(err, null);
        assert.strictEqual(value, "value1");
        done();
      });
    });
  });

  describe("GetKeyValueReturnNullOrNonExisting()", function () {
    it("should return null for a non-existing key", function (done) {
      cacheFunct.GetKeyValue("nonExistingKey", (err, value) => {
        assert.strictEqual(err, null);
        assert.strictEqual(value, null);
        done();
      });
    });
  });

  describe("GetKeyValueReturnError()", function () {
    it("should handle cache errors gracefully", function (done) {
      // Simulate a cache error by overriding the cache temporarily
      const originalCache = cacheFunct.cache;
      cacheFunct.cache = null;

      cacheFunct.GetKeyValue("key1", (err, value) => {
        assert(err instanceof Error);
        assert.strictEqual(value, undefined);

        // Restore the original cache
        cacheFunct.cache = originalCache;
        done();
      });
    });
  });

  describe("SetKeyValueSuccess()", function () {
    it("should save a key-value pair", function (done) {
      cacheFunct.SetKeyValue("key1", "value1", (err) => {
        assert.strictEqual(err, null);
        const value = cacheFunct.cache["key1"];
        assert.strictEqual(value, "value1");
        done();
      });
    });

    it("should return an error if the key is missing", function (done) {
      cacheFunct.SetKeyValue(null, "value1", (err) => {
        assert(err instanceof Error);
        assert.strictEqual(err.message, "Invalid key or value");
        done();
      });
    });

    it("should return an error if the value is missing", function (done) {
      cacheFunct.SetKeyValue("key1", null, (err) => {
        assert(err instanceof Error);
        assert.strictEqual(err.message, "Invalid key or value");
        done();
      });
    });

    it("should return an error if both key and value are missing", function (done) {
      cacheFunct.SetKeyValue(null, null, (err) => {
        assert(err instanceof Error);
        assert.strictEqual(err.message, "Invalid key or value");
        done();
      });
    });

    it("should return an error if the key is an empty string", function (done) {
      cacheFunct.SetKeyValue("", "value1", (err) => {
        assert(err instanceof Error);
        assert.strictEqual(err.message, "Invalid key or value");
        done();
      });
    });

    it("should return an error if the value is an empty string", function (done) {
      cacheFunct.SetKeyValue("key1", "", (err) => {
        assert(err instanceof Error);
        assert.strictEqual(err.message, "Invalid key or value");
        done();
      });
    });
  });
});
