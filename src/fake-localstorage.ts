/**
 * Fake localStorage implementation for testing environments
 * Compatible with both browser and Node.js environments
 */

import {
  StorageEvent as StorageEventImpl,
  StorageEventInit as StorageEventInitType,
} from "./storage-event";
import { storageEventEmitter } from "./event-emiter";

// Re-export StorageEvent and StorageEventInit from storage-event module
export {
  StorageEventImpl as StorageEvent,
  StorageEventInitType as StorageEventInit,
};

export class FakeStorage implements Storage {
  private _data: Map<string, string> = new Map();
  private _length: number = 0;

  constructor() {
    // Bind methods to preserve 'this' context
    this.getItem = this.getItem.bind(this);
    this.setItem = this.setItem.bind(this);
    this.removeItem = this.removeItem.bind(this);
    this.clear = this.clear.bind(this);
    this.key = this.key.bind(this);
  }

  get length(): number {
    return this._length;
  }

  getItem(key: string): string | null {
    if (typeof key !== "string") {
      throw new TypeError(
        'Failed to execute "getItem" on "Storage": 1 argument required, but only 0 present.'
      );
    }
    return this._data.get(key) || null;
  }

  setItem(key: string, value: string): void {
    if (typeof key !== "string") {
      throw new TypeError(
        'Failed to execute "setItem" on "Storage": 1 argument required, but only 0 present.'
      );
    }
    if (typeof value !== "string") {
      throw new TypeError(
        'Failed to execute "setItem" on "Storage": 2 arguments required, but only 1 present.'
      );
    }

    const oldValue = this._data.get(key) || null;
    const wasPresent = this._data.has(key);

    this._data.set(key, value);

    if (!wasPresent) {
      this._length++;
    }

    // Dispatch storage event
    this._dispatchStorageEvent(key, value, oldValue);
  }

  removeItem(key: string): void {
    if (typeof key !== "string") {
      throw new TypeError(
        'Failed to execute "removeItem" on "Storage": 1 argument required, but only 0 present.'
      );
    }

    const oldValue = this._data.get(key) || null;
    const wasPresent = this._data.has(key);

    this._data.delete(key);

    if (wasPresent) {
      this._length--;
    }

    // Dispatch storage event
    this._dispatchStorageEvent(key, null, oldValue);
  }

  clear(): void {
    const keys = Array.from(this._data.keys());
    this._data.clear();
    this._length = 0;

    // Dispatch storage event for each cleared item
    keys.forEach((key) => {
      this._dispatchStorageEvent(key, null, this._data.get(key) || null);
    });
  }

  key(index: number): string | null {
    if (typeof index !== "number") {
      throw new TypeError(
        'Failed to execute "key" on "Storage": 1 argument required, but only 0 present.'
      );
    }

    const keys = Array.from(this._data.keys());
    return keys[index] || null;
  }

  // Additional methods for testing and debugging
  get size(): number {
    return this._data.size;
  }

  has(key: string): boolean {
    return this._data.has(key);
  }

  keys(): string[] {
    return Array.from(this._data.keys());
  }

  values(): string[] {
    return Array.from(this._data.values());
  }

  entries(): [string, string][] {
    return Array.from(this._data.entries());
  }

  forEach(
    callback: (value: string, key: string, storage: Storage) => void,
    thisArg?: any
  ): void {
    this._data.forEach((value, key) => {
      callback.call(thisArg, value, key, this);
    });
  }

  // Reset the storage (useful for testing)
  reset(): void {
    this._data.clear();
    this._length = 0;
  }

  // Get all data as an object (useful for debugging)
  toJSON(): Record<string, string> {
    return Object.fromEntries(this._data);
  }

  private _dispatchStorageEvent(
    key: string,
    newValue: string | null,
    oldValue: string | null
  ): void {
    try {
      storageEventEmitter.emit({
        key,
        newValue,
        oldValue,
        storageArea: this,
        url:
          typeof globalThis.window !== "undefined" &&
          typeof globalThis.window.location === "object"
            ? globalThis.window.location.href
            : process.env.TEST_URL || "",
      });
    } catch (error) {
      // Silently fail if StorageEvent is not available
      console.warn("Failed to dispatch storage event:", error);
    }
  }
}

// Create a singleton instance
const fakeLocalStorage = new FakeStorage();

export default fakeLocalStorage;
