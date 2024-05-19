// src/math.js

class MathFunctions {
  // Function to add two numbers
  add(a, b) {
    return a + b;
  }

  // Function to subtract two numbers
  subtract(a, b) {
    return a - b;
  }

  // Function to multiply two numbers
  multiply(a, b) {
    return a * b;
  }

  // Function to divide two numbers
  divide(a, b) {
    if (b === 0) {
      throw new Error("Division by zero is not allowed.");
    }
    return a / b;
  }
}

// Export the MathFunctions class
module.exports = MathFunctions;
