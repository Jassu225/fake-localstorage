# fake-localstorage

A fake localStorage implementation for testing in browsers and Node.js environments. This package provides a complete localStorage API that can be used in test environments where localStorage is not available or when you need to mock localStorage behavior.

## Features

- ✅ Full localStorage API compatibility
- ✅ TypeScript support with type definitions
- ✅ Works in both browser and Node.js environments
- ✅ Storage events support with complete Event interface implementation
- ✅ Event emitter API for non-auto mode (`onStorageEvent`, `offStorageEvent`, `clearStorageEvents`)
- ✅ Additional utility methods for testing
- ✅ Two import methods: global injection or explicit import
- ✅ Zero dependencies
- ✅ Comprehensive test coverage
- ✅ Modular architecture with separate StorageEvent implementation
- ✅ Global availability with fallback support

## Installation

```bash
npm install fake-localstorage
```

## Usage

### Method 1: Auto-import (Global Injection)

This method automatically adds fake localStorage and StorageEvent to the global scope if they don't exist:

```typescript
// This will add localStorage and StorageEvent to global scope if they don't exist
import "fake-localstorage/auto";

// Now both localStorage and StorageEvent are available globally
localStorage.setItem("key", "value");
console.log(localStorage.getItem("key")); // 'value'
```

### Method 2: Explicit Import

This method gives you a fake localStorage instance without modifying the global scope:

```typescript
import fakeLocalStorage, {
  StorageEvent,
  onStorageEvent,
  offStorageEvent,
  clearStorageEvents,
} from "fake-localstorage";

// Use the fake localStorage instance
fakeLocalStorage.setItem("key", "value");
console.log(fakeLocalStorage.getItem("key")); // 'value'

// Listen for storage events
const handleStorageEvent = (event: StorageEvent) => {
  console.log("Storage changed:", event.key, event.newValue);
};
onStorageEvent(handleStorageEvent);

// Stop listening
offStorageEvent(handleStorageEvent);

// Clear all storage event listeners
clearStorageEvents();

// Use StorageEvent directly
const event = new StorageEvent("storage", { key: "key", newValue: "value" });

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

### Event Emitter API

For non-auto mode, you can tap into storage events using the event emitter functions:

- `onStorageEvent(callback: EventListener): void` - Listen for storage events
- `offStorageEvent(callback: EventListener): void` - Stop listening for storage events
- `clearStorageEvents(): void` - Clear all storage event listeners

### StorageEvent Implementation

The package includes a complete `StorageEvent` implementation that:

- **Implements the full Event interface** - compatible with `window.dispatchEvent()`
- **Supports all StorageEvent properties** - key, newValue, oldValue, storageArea, url
- **Works in both browser and Node.js** - no external dependencies
- **Fully typed** - complete TypeScript support
- **Global availability** - automatically available globally when using auto-import
- **Modular design** - separate file for better organization
- **Fallback support** - uses imported implementation if global is not available

```typescript
import { StorageEvent, StorageEventInit } from "fake-localstorage";

// Create a storage event
const event = new StorageEvent("storage", {
  key: "myKey",
  newValue: "newValue",
  oldValue: "oldValue",
  storageArea: fakeLocalStorage,
  url: "http://localhost",
});

// Event properties
console.log(event.type); // "storage"
console.log(event.key); // "myKey"
console.log(event.bubbles); // false
console.log(event.cancelable); // false
console.log(event.timeStamp); // timestamp number

// Event methods
event.preventDefault();
event.stopPropagation();
event.stopImmediatePropagation();
```

### Global StorageEvent Availability

The StorageEvent is automatically made available globally when using the auto-import module:

```typescript
// Auto-import sets up both localStorage and StorageEvent globally
import "fake-localstorage/auto";

// No need to import - both localStorage and StorageEvent are available globally
localStorage.setItem("key", "value");

const event = new StorageEvent("storage", {
  key: "myKey",
  newValue: "newValue",
  oldValue: "oldValue",
  url: "http://localhost",
});

// Works in both browser and Node.js environments
console.log(event.type); // "storage"
```

**Note**: Global StorageEvent is only available when using the auto-import module. For explicit imports, you need to import StorageEvent directly.

## Architecture

The package uses a modular architecture with the following components:

- **`fake-localstorage.ts`**: Core localStorage implementation with StorageEvent integration
- **`storage-event.ts`**: Standalone StorageEvent implementation with full Event interface support
- **`event-emiter.ts`**: Event emitter for non-auto mode with `onStorageEvent`, `offStorageEvent`, `clearStorageEvents`
- **`auto.ts`**: Auto-import module that sets up both localStorage and StorageEvent globally
- **`index.ts`**: Main exports with proper re-exports and type definitions

This design ensures:

- **No naming conflicts** between imported and global StorageEvent
- **Fallback support** when global StorageEvent is not available
- **Clean separation** of concerns between localStorage and StorageEvent
- **Consistent API** across different import methods
- **Event listening flexibility** with both global and programmatic event handling

## Examples

### Basic Usage

```typescript
import fakeLocalStorage from "fake-localstorage";

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

### Testing with Jest

```typescript
import fakeLocalStorage, {
  onStorageEvent,
  offStorageEvent,
  clearStorageEvents,
} from "fake-localstorage";

describe("MyComponent", () => {
  beforeEach(() => {
    // Reset storage before each test
    fakeLocalStorage.reset();
    // Clear any existing event listeners
    clearStorageEvents();
  });

  test("should save data to localStorage", () => {
    const component = new MyComponent();
    component.saveData("key", "value");

    expect(fakeLocalStorage.getItem("key")).toBe("value");
  });

  test("should trigger storage events", () => {
    const storageEvents: StorageEvent[] = [];

    // Listen for storage events
    const handleStorageEvent = (event: StorageEvent) => {
      storageEvents.push(event);
    };
    onStorageEvent(handleStorageEvent);

    // Perform storage operations
    fakeLocalStorage.setItem("key1", "value1");
    fakeLocalStorage.setItem("key2", "value2");
    fakeLocalStorage.removeItem("key1");

    // Verify events were triggered
    expect(storageEvents).toHaveLength(3);
    expect(storageEvents[0].key).toBe("key1");
    expect(storageEvents[0].newValue).toBe("value1");
    expect(storageEvents[2].key).toBe("key1");
    expect(storageEvents[2].newValue).toBeNull();

    // Clean up
    offStorageEvent(handleStorageEvent);
  });
});
```

### Testing with Auto-import

```typescript
// In your test setup file
import "fake-localstorage/auto";

describe("MyComponent", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("should work with global localStorage", () => {
    localStorage.setItem("key", "value");
    expect(localStorage.getItem("key")).toBe("value");
  });

  test("should work with global StorageEvent", () => {
    const event = new StorageEvent("storage", {
      key: "key",
      newValue: "value",
    });
    expect(event.type).toBe("storage");
    expect(event.key).toBe("key");
  });
});
```

### Storage Events

The fake localStorage dispatches storage events when items are modified. There are two ways to listen for these events:

#### Method 1: Using Event Emitter API (Non-Auto Mode)

```typescript
import fakeLocalStorage, {
  onStorageEvent,
  offStorageEvent,
  clearStorageEvents,
} from "fake-localstorage";

// Listen for storage events
const handleStorageEvent = (event: StorageEvent) => {
  console.log("Storage changed:", {
    key: event.key,
    newValue: event.newValue,
    oldValue: event.oldValue,
  });
};

onStorageEvent(handleStorageEvent);

// This will trigger a storage event
fakeLocalStorage.setItem("key", "value");

// Stop listening
offStorageEvent(handleStorageEvent);

// Or clear all listeners
clearStorageEvents();
```

#### Method 2: Using Global Event Listeners (Auto Mode)

```typescript
import "fake-localstorage/auto";

// Listen for storage events using global addEventListener
window.addEventListener("storage", (event) => {
  console.log("Storage changed:", {
    key: event.key,
    newValue: event.newValue,
    oldValue: event.oldValue,
  });
});

// This will trigger a storage event
localStorage.setItem("key", "value");
```

## TypeScript Support

This package includes full TypeScript support with type definitions:

```typescript
import fakeLocalStorage, {
  StorageEvent,
  StorageEventInit,
} from "fake-localstorage";

// All methods are properly typed
const value: string | null = fakeLocalStorage.getItem("key");
fakeLocalStorage.setItem("key", "value");

// Storage events are fully implemented and typed
const event: StorageEvent = new StorageEvent("storage", {
  key: "key",
  newValue: "value",
  oldValue: null,
  storageArea: fakeLocalStorage,
  url: "http://localhost",
});

// StorageEvent implements the full Event interface
console.log(event.type); // "storage"
console.log(event.bubbles); // false
console.log(event.cancelable); // false
console.log(event.timeStamp); // timestamp number
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
