# fake-localstorage

A fake localStorage implementation for testing in browsers and Node.js environments. This package provides a complete localStorage API that can be used in test environments where localStorage is not available or when you need to mock localStorage behavior.

## Features

- ✅ Full localStorage API compatibility
- ✅ TypeScript support with type definitions
- ✅ Works in both browser and Node.js environments
- ✅ Additional utility methods for testing
- ✅ Two import methods: global injection or explicit import
- ✅ Zero dependencies
- ✅ Comprehensive test coverage
- ✅ Modular architecture
- ✅ Global availability with fallback support

## Installation

```bash
npm install fake-localstorage
```

## Usage

### Method 1: Auto-import (Global Injection)

This method automatically adds fake localStorage to the global scope if it doesn't exist:

```typescript
// This will add localStorage to global scope if it doesn't exist
import "fake-localstorage/auto";

// Now localStorage is available globally
localStorage.setItem("key", "value");
console.log(localStorage.getItem("key")); // 'value'
```

### Method 2: Explicit Import

This method gives you a fake localStorage instance without modifying the global scope:

```typescript
import fakeLocalStorage from "fake-localstorage";

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

## Architecture

The package uses a modular architecture with the following components:

- **`fake-localstorage.ts`**: Core localStorage implementation
- **`auto.ts`**: Auto-import module that sets up localStorage globally
- **`index.ts`**: Main exports with proper re-exports and type definitions

This design ensures:

- **Clean separation** of concerns
- **Consistent API** across different import methods

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

## TypeScript Support

This package includes full TypeScript support with type definitions:

```typescript
import fakeLocalStorage from "fake-localstorage";

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
