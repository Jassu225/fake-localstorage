/**
 * Tests for auto-import functionality
 */

// Clear localStorage before each test
beforeEach(() => {
  if (typeof global !== "undefined") {
    delete (global as any).localStorage;
  }
  if (typeof window !== "undefined") {
    delete (window as any).localStorage;
  }
  if (typeof globalThis !== "undefined") {
    delete (globalThis as any).localStorage;
  }
});

describe("Auto import", () => {
  test("should add localStorage to global scope when not present", () => {
    // Ensure localStorage is not present
    expect(typeof localStorage).toBe("undefined");

    // Import the auto module
    require("../src/auto");

    // Check that localStorage is now available
    expect(typeof localStorage).toBe("object");
    expect(localStorage).toHaveProperty("getItem");
    expect(localStorage).toHaveProperty("setItem");
    expect(localStorage).toHaveProperty("removeItem");
    expect(localStorage).toHaveProperty("clear");
    expect(localStorage).toHaveProperty("key");
  });

  test("should not override existing localStorage", () => {
    // Create a mock localStorage
    const mockLocalStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
      key: jest.fn(),
      length: 0,
    };

    // Set it on global scope
    (global as any).localStorage = mockLocalStorage;

    // Import the auto module
    require("../src/auto");

    // Check that the original localStorage is still there
    expect(localStorage).toBe(mockLocalStorage);
  });
});
