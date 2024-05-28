const assert = require("assert");
const Cache = require("../../src/storage/Cache");
const CacheFunctions = require("../../src/storage/Cache");

describe("CacheTestUnits", function () {
  let cache;
  const cacheFunct = new CacheFunctions();

  beforeEach(function () {
    // Create a new cache instance before each test
    cache = new Cache();
  });

  describe("SetKeyValueSuccess()", function () {
    it("should save a key-value pair", function (done) {
      cacheFunct.SetKeyValue("key1", "value1", (err) => {
        assert.strictEqual(err, null);
        const value = cache.cache["key1"];
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
          const value = cache.cache["key1"];
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
      cache.cache["key1"] = "value1";
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
      const originalCache = cache.cache;
      cache.cache = null;

      cacheFunct.GetKeyValue("key1", (err, value) => {
        assert(err instanceof Error);
        assert.strictEqual(value, undefined);

        // Restore the original cache
        cache.cache = originalCache;
        done();
      });
    });
  });
});
