const assert = require("assert");
const { LocalStorage } = require("node-localstorage");
const LocalStorageFunctions = require("../../src/storage/LocalStorage");

// Create a new localStorage instance for testing
global.localStorage = new LocalStorage("./scratch");

describe("LocalStorageTestUnits", function () {
  const storageFunct = new LocalStorageFunctions();

  beforeEach(function () {
    // Clear localStorage before each test
    localStorage.clear();
  });

  describe("SetKeyValueSuccess()", function () {
    it("should save a key-value pair", function (done) {
      storageFunct.SetKeyValue("key1", "value1", (err) => {
        assert.strictEqual(err, null);
        const value = localStorage.getItem("key1");
        assert.strictEqual(value, "value1");
        done();
      });
    });
  });

  describe("SetKeyValueUpdateValue()", function () {
    it("should update the value for an existing key", function (done) {
      storageFunct.SetKeyValue("key1", "value1", (err) => {
        assert.strictEqual(err, null);
        storageFunct.SetKeyValue("key1", "value2", (err) => {
          assert.strictEqual(err, null);
          const value = localStorage.getItem("key1");
          assert.strictEqual(value, "value2");
          done();
        });
      });
    });
  });

  describe("SetKeyValueError()", function () {
    it("should handle invalid inputs", function (done) {
      storageFunct.SetKeyValue(null, "value1", (err) => {
        assert(err instanceof Error);
        storageFunct.SetKeyValue("key", null, (err) => {
          assert(err instanceof Error);
          done();
        });
      });
    });
  });

  describe("SetKeyValueStorageError()", function () {
    it("should handle localStorage setItem errors gracefully", function (done) {
      // Simulate a localStorage error by overriding setItem temporarily
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = () => {
        throw new Error("Forced error");
      };

      storageFunct.SetKeyValue("key1", "value1", (err) => {
        assert(err instanceof Error);
        assert.strictEqual(err.message, "Forced error");

        // Restore the original setItem function
        localStorage.setItem = originalSetItem;
        done();
      });
    });
  });

  describe("GetKeyValueSuccess()", function () {
    it("should retrieve the value for an existing key", function (done) {
      localStorage.setItem("key1", "value1");
      storageFunct.GetKeyValue("key1", (err, value) => {
        assert.strictEqual(err, null);
        assert.strictEqual(value, "value1");
        done();
      });
    });
  });

  describe("GetKeyValueReturnNullOrNonExisting()", function () {
    it("should return null for a non-existing key", function (done) {
      storageFunct.GetKeyValue("nonExistingKey", (err, value) => {
        assert.strictEqual(err, null);
        assert.strictEqual(value, null);
        done();
      });
    });
  });

  describe("GetKeyValueReturnError()", function () {
    it("should handle localStorage errors gracefully", function (done) {
      // Simulate a localStorage error by overriding getItem temporarily
      const originalGetItem = localStorage.getItem;
      localStorage.getItem = () => {
        throw new Error("Forced error");
      };

      storageFunct.GetKeyValue("key1", (err, value) => {
        assert(err instanceof Error);
        assert.strictEqual(value, undefined);

        // Restore the original getItem function
        localStorage.getItem = originalGetItem;
        done();
      });
    });
  });
});
