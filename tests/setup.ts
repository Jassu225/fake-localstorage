/**
 * Jest setup file for fake-localstorage tests
 */

// Mock window object for Node.js environment
// if (typeof window === "undefined") {
//   (global as any).window = {
//     location: {
//       href: "http://localhost",
//     },
//     dispatchEvent: jest.fn(),
//   };
// }

// Import our custom StorageEvent implementation
// import { StorageEvent } from "../src/storage-event";

// // Make StorageEvent available globally for Node.js environment
// if (typeof global !== "undefined") {
//   (global as any).StorageEvent = StorageEvent;
// }
// Add this to your main application or test setup
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  // Don't exit in tests or development
  if (process.env.NODE_ENV !== "test") {
    process.exit(1);
  }
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  // Don't exit in tests
  if (process.env.NODE_ENV !== "test") {
    process.exit(1);
  }
});
