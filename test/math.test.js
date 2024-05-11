// test/math.test.js

const assert = require("assert");
const MathFunctions = require("../src/math");

describe("MathFunctions", function () {
  const math = new MathFunctions();

  describe("add()", function () {
    it("should return the sum of two numbers", function () {
      assert.strictEqual(math.add(5, 3), 8);
      assert.strictEqual(math.add(-5, 3), -2);
      assert.strictEqual(math.add(0, 0), 0);
    });
  });

  describe("subtract()", function () {
    it("should return the difference of two numbers", function () {
      assert.strictEqual(math.subtract(5, 3), 2);
      assert.strictEqual(math.subtract(5, -3), 8);
      assert.strictEqual(math.subtract(0, 0), 0);
    });
  });

  describe("multiply()", function () {
    it("should return the product of two numbers", function () {
      assert.strictEqual(math.multiply(5, 3), 15);
      assert.strictEqual(math.multiply(-5, 3), -15);
      assert.strictEqual(math.multiply(5, 0), 0);
    });
  });

  describe("divide()", function () {
    it("should return the quotient of two numbers", function () {
      assert.strictEqual(math.divide(6, 3), 2);
      assert.strictEqual(math.divide(-6, 3), -2);
      assert.strictEqual(math.divide(5, 2), 2.5);
    });

    it("should throw an error when dividing by zero", function () {
      assert.throws(() => math.divide(5, 0), Error);
    });
  });
});
