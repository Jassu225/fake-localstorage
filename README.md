# ts-fake-localstorage

A fake localStorage implementation for testing in browsers and Node.js environments. This package provides a complete localStorage API that can be used in test environments where localStorage is not available or when you need to mock localStorage behavior.

## Features

- ✅ Full localStorage API compatibility
- ✅ TypeScript support with type definitions
- ✅ Works in both browser and Node.js environments
- ✅ Additional utility methods for testing
- ✅ Two import methods: global injection or explicit import
- ✅ Storage event system with both global and programmatic listeners
- ✅ Zero dependencies
- ✅ Comprehensive test coverage
- ✅ Modular architecture
- ✅ Global availability with fallback support

## Installation

```bash
npm install ts-fake-localstorage
```

## Usage

### Method 1: Auto-import (Global Injection)

This method automatically adds fake localStorage to the global scope if it doesn't exist:

```typescript
// This will add localStorage to global scope if it doesn't exist
import "ts-fake-localstorage/auto";

// Now localStorage is available globally
localStorage.setItem("key", "value");
console.log(localStorage.getItem("key")); // 'value'
```

### Method 2: Explicit Import

This method gives you a fake localStorage instance without modifying the global scope:

```typescript
import fakeLocalStorage from "ts-fake-localstorage";

// Use the fake localStorage instance
fakeLocalStorage.setItem("key", "value");
console.log(fakeLocalStorage.getItem("key")); // 'value'

// Or assign it to localStorage if needed
const localStorage = fakeLocalStorage;
```

## API

The fake localStorage implements the standard Storage interface with these methods:

### Standard Methods

- `getItem(key: string): string | null` - Get an item from storage
- `setItem(key: string, value: string): void` - Set an item in storage
- `removeItem(key: string): void` - Remove an item from storage
- `clear(): void` - Clear all items from storage
- `key(index: number): string | null` - Get key at index
- `length: number` - Number of items in storage

### Additional Methods (for testing)

- `has(key: string): boolean` - Check if key exists
- `keys(): string[]` - Get all keys
- `values(): string[]` - Get all values
- `entries(): [string, string][]` - Get all key-value pairs
- `forEach(callback: (value: string, key: string, storage: Storage) => void, thisArg?: any): void` - Iterate over items
- `reset(): void` - Reset storage (useful for test cleanup)
- `toJSON(): Record<string, string>` - Convert to JSON object
- `size: number` - Get number of items (same as length)

## Storage Events

The fake localStorage implementation includes a complete storage event system that fires events when storage is modified. **Note: Events only fire for the same tab/context - there is no cross-tab communication.**

### Event System Components

- **StorageEvent**: Complete implementation of the StorageEvent interface
- **Global Event Listeners**: Works with `window.addEventListener('storage', ...)` when using auto-import
- **Programmatic Event Listeners**: Use `onStorageEvent`, `offStorageEvent`, `clearStorageEvents` for explicit control

### Using Global Event Listeners (Auto-import mode)

```typescript
import "ts-fake-localstorage/auto";

// Listen for storage events globally
window.addEventListener("storage", (event) => {
  console.log("Storage changed:", {
    key: event.key,
    newValue: event.newValue,
    oldValue: event.oldValue,
    storageArea: event.storageArea,
    url: event.url,
  });
});

// Trigger events
localStorage.setItem("key", "value"); // Fires storage event
localStorage.removeItem("key"); // Fires storage event
localStorage.clear(); // Fires storage event for each cleared item
```

### Using Programmatic Event Listeners (Explicit import mode)

```typescript
import fakeLocalStorage, {
  onStorageEvent,
  offStorageEvent,
  clearStorageEvents,
} from "ts-fake-localstorage";

// Set up event listener
const handleStorageEvent = (event) => {
  console.log("Storage changed:", event);
};

onStorageEvent(handleStorageEvent);

// Trigger events
fakeLocalStorage.setItem("key", "value"); // Fires storage event
fakeLocalStorage.removeItem("key"); // Fires storage event

// Clean up
offStorageEvent(handleStorageEvent);
// or clear all listeners
clearStorageEvents();
```

### Event Properties

Storage events include all standard properties:

- `key`: The key that was changed (null for clear operations)
- `newValue`: The new value (null for remove/clear operations)
- `oldValue`: The previous value (null for new items)
- `storageArea`: Reference to the storage object
- `url`: The URL of the page that triggered the change

### Important Notes

- **Same-tab only**: Events only fire within the same tab/context, not across different tabs
- **In-memory storage**: Data is not persisted across page reloads or process restarts
- **Event timing**: Events are fired synchronously when storage operations occur
- **Error handling**: Event dispatching failures are logged as warnings but don't throw errors

## Architecture

The package uses a modular architecture with the following components:

- **`fake-localstorage.ts`**: Core localStorage implementation with event dispatching
- **`storage-event.ts`**: Complete StorageEvent implementation with full Event interface compliance
- **`event-emiter.ts`**: Event emitter system for programmatic event handling
- **`auto.ts`**: Auto-import module that sets up localStorage and StorageEvent globally
- **`index.ts`**: Main exports with proper re-exports and type definitions

This design ensures:

- **Clean separation** of concerns
- **Consistent API** across different import methods
- **Flexible event handling** with both global and programmatic approaches
- **Cross-platform compatibility** with smart environment detection

## Examples

### Basic Usage

```typescript
import fakeLocalStorage from "ts-fake-localstorage";

// Set and get items
fakeLocalStorage.setItem("username", "john_doe");
fakeLocalStorage.setItem("theme", "dark");

console.log(fakeLocalStorage.getItem("username")); // 'john_doe'
console.log(fakeLocalStorage.length); // 2

// Remove an item
fakeLocalStorage.removeItem("theme");
console.log(fakeLocalStorage.length); // 1

// Clear all items
fakeLocalStorage.clear();
console.log(fakeLocalStorage.length); // 0
```

## TypeScript Support

This package includes full TypeScript support with type definitions:

```typescript
import fakeLocalStorage from "ts-fake-localstorage";

// All methods are properly typed
const value: string | null = fakeLocalStorage.getItem("key");
fakeLocalStorage.setItem("key", "value");
```

## Browser Compatibility

- Modern browsers (ES2020+)
- Node.js 14+
- TypeScript 4.0+

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Build the package
npm run build

# Lint code
npm run lint

# Type check
npm run type-check
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
