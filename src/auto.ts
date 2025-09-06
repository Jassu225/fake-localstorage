/**
 * Auto-import module that adds fake localStorage to the global scope
 * Usage: import "fake-localstorage/auto"
 */

import fakeLocalStorage from "./fake-localstorage";
import { StorageEvent } from "./storage-event";

// Check if localStorage already exists
if (typeof localStorage === "undefined") {
  // Add fake localStorage to global scope
  if (typeof global !== "undefined") {
    // Node.js environment
    (global as any).localStorage = fakeLocalStorage;
  }
  if (typeof window !== "undefined") {
    // Browser environment
    (window as any).localStorage = fakeLocalStorage;
  }
  if (typeof globalThis !== "undefined") {
    // Modern environments
    (globalThis as any).localStorage = fakeLocalStorage;
  }
}

// Make StorageEvent available globally only if it doesn't exist
if (typeof StorageEvent === "undefined") {
  if (typeof global !== "undefined") {
    // Node.js environment
    (global as any).StorageEvent = StorageEvent;
  }
  if (typeof window !== "undefined") {
    // Browser environment
    (window as any).StorageEvent = StorageEvent;
  }
  if (typeof globalThis !== "undefined") {
    // Modern environments
    (globalThis as any).StorageEvent = StorageEvent;
  }
}
