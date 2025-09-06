/**
 * Tests for fake-localstorage implementation
 */

import fakeLocalStorage from "../src/fake-localstorage";
import { FakeStorage } from "../src/fake-localstorage";
import { StorageEvent, StorageEventInit } from "../src/storage-event";
import {
  onStorageEvent,
  offStorageEvent,
  clearStorageEvents,
} from "../src/event-emiter";

describe("FakeStorage", () => {
  let storage: FakeStorage;

  beforeEach(() => {
    storage = new FakeStorage();
  });

  describe("Basic functionality", () => {
    test("should start empty", () => {
      expect(storage.length).toBe(0);
      expect(storage.getItem("nonexistent")).toBeNull();
    });

    test("should set and get items", () => {
      storage.setItem("key1", "value1");
      expect(storage.getItem("key1")).toBe("value1");
      expect(storage.length).toBe(1);
    });

    test("should update existing items", () => {
      storage.setItem("key1", "value1");
      storage.setItem("key1", "value2");
      expect(storage.getItem("key1")).toBe("value2");
      expect(storage.length).toBe(1);
    });

    test("should remove items", () => {
      storage.setItem("key1", "value1");
      storage.removeItem("key1");
      expect(storage.getItem("key1")).toBeNull();
      expect(storage.length).toBe(0);
    });

    test("should clear all items", () => {
      storage.setItem("key1", "value1");
      storage.setItem("key2", "value2");
      storage.clear();
      expect(storage.length).toBe(0);
      expect(storage.getItem("key1")).toBeNull();
      expect(storage.getItem("key2")).toBeNull();
    });

    test("should get key by index", () => {
      storage.setItem("key1", "value1");
      storage.setItem("key2", "value2");
      expect(storage.key(0)).toBe("key1");
      expect(storage.key(1)).toBe("key2");
      expect(storage.key(2)).toBeNull();
    });
  });

  describe("Error handling", () => {
    test("should throw error for invalid getItem calls", () => {
      expect(() => (storage as any).getItem()).toThrow(TypeError);
      expect(() => (storage as any).getItem(123)).toThrow(TypeError);
    });

    test("should throw error for invalid setItem calls", () => {
      expect(() => (storage as any).setItem()).toThrow(TypeError);
      expect(() => (storage as any).setItem("key")).toThrow(TypeError);
      expect(() => (storage as any).setItem(123, "value")).toThrow(TypeError);
      expect(() => (storage as any).setItem("key", 123)).toThrow(TypeError);
    });

    test("should throw error for invalid removeItem calls", () => {
      expect(() => (storage as any).removeItem()).toThrow(TypeError);
      expect(() => (storage as any).removeItem(123)).toThrow(TypeError);
    });

    test("should throw error for invalid key calls", () => {
      expect(() => (storage as any).key()).toThrow(TypeError);
      expect(() => (storage as any).key("invalid")).toThrow(TypeError);
    });
  });

  describe("Additional methods", () => {
    test("should check if key exists", () => {
      storage.setItem("key1", "value1");
      expect(storage.has("key1")).toBe(true);
      expect(storage.has("nonexistent")).toBe(false);
    });

    test("should get all keys", () => {
      storage.setItem("key1", "value1");
      storage.setItem("key2", "value2");
      const keys = storage.keys();
      expect(keys).toContain("key1");
      expect(keys).toContain("key2");
      expect(keys).toHaveLength(2);
    });

    test("should get all values", () => {
      storage.setItem("key1", "value1");
      storage.setItem("key2", "value2");
      const values = storage.values();
      expect(values).toContain("value1");
      expect(values).toContain("value2");
      expect(values).toHaveLength(2);
    });

    test("should get all entries", () => {
      storage.setItem("key1", "value1");
      storage.setItem("key2", "value2");
      const entries = storage.entries();
      expect(entries).toContainEqual(["key1", "value1"]);
      expect(entries).toContainEqual(["key2", "value2"]);
      expect(entries).toHaveLength(2);
    });

    test("should iterate with forEach", () => {
      storage.setItem("key1", "value1");
      storage.setItem("key2", "value2");
      const results: Array<[string, string]> = [];
      storage.forEach((value, key) => {
        results.push([key, value]);
      });
      expect(results).toContainEqual(["key1", "value1"]);
      expect(results).toContainEqual(["key2", "value2"]);
    });

    test("should reset storage", () => {
      storage.setItem("key1", "value1");
      storage.setItem("key2", "value2");
      storage.reset();
      expect(storage.length).toBe(0);
      expect(storage.getItem("key1")).toBeNull();
      expect(storage.getItem("key2")).toBeNull();
    });

    test("should convert to JSON", () => {
      storage.setItem("key1", "value1");
      storage.setItem("key2", "value2");
      const json = storage.toJSON();
      expect(json).toEqual({
        key1: "value1",
        key2: "value2",
      });
    });
  });

  describe("Storage events", () => {
    let mockDispatchEvent: jest.Mock;

    beforeEach(() => {
      mockDispatchEvent = jest.fn();
      globalThis.dispatchEvent = mockDispatchEvent;
    });

    test("should dispatch storage event on setItem", () => {
      storage.setItem("key1", "value1");
      expect(mockDispatchEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          key: "key1",
          newValue: "value1",
          oldValue: null,
          storageArea: storage,
        })
      );
    });

    test("should dispatch storage event on removeItem", () => {
      storage.setItem("key1", "value1");
      mockDispatchEvent.mockClear();
      storage.removeItem("key1");
      expect(mockDispatchEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          key: "key1",
          newValue: null,
          oldValue: "value1",
          storageArea: storage,
        })
      );
    });

    test("should dispatch storage event on clear", () => {
      storage.setItem("key1", "value1");
      storage.setItem("key2", "value2");
      mockDispatchEvent.mockClear();
      storage.clear();
      expect(mockDispatchEvent).toHaveBeenCalledTimes(2);
    });
  });
});

describe("Default export", () => {
  test("should export a FakeStorage instance", () => {
    expect(fakeLocalStorage).toBeInstanceOf(FakeStorage);
  });

  test("should be a singleton", () => {
    const anotherImport = require("../src/fake-localstorage").default;
    expect(fakeLocalStorage).toBe(anotherImport);
  });
});

describe("StorageEvent", () => {
  test("should create StorageEvent with default values", () => {
    const event = new StorageEvent("storage");
    expect(event.type).toBe("storage");
    expect(event.key).toBeNull();
    expect(event.newValue).toBeNull();
    expect(event.oldValue).toBeNull();
    expect(event.storageArea).toBeNull();
    expect(event.url).toBe("");
  });

  test("should create StorageEvent with custom values", () => {
    const storage = new FakeStorage();
    const eventInit: StorageEventInit = {
      key: "test-key",
      newValue: "new-value",
      oldValue: "old-value",
      storageArea: storage,
      url: "http://example.com",
    };

    const event = new StorageEvent("storage", eventInit);
    expect(event.type).toBe("storage");
    expect(event.key).toBe("test-key");
    expect(event.newValue).toBe("new-value");
    expect(event.oldValue).toBe("old-value");
    expect(event.storageArea).toBe(storage);
    expect(event.url).toBe("http://example.com");
  });

  test("should have Event-like properties", () => {
    const event = new StorageEvent("storage");
    expect(event.bubbles).toBe(false);
    expect(event.cancelable).toBe(false);
    expect(event.currentTarget).toBeNull();
    expect(event.defaultPrevented).toBe(false);
    expect(event.eventPhase).toBe(Event.NONE);
    expect(event.isTrusted).toBe(false);
    expect(event.target).toBeNull();
    expect(typeof event.timeStamp).toBe("number");
  });

  test("should have Event-like methods", () => {
    const event = new StorageEvent("storage");
    expect(() => event.preventDefault()).not.toThrow();
    expect(() => event.stopPropagation()).not.toThrow();
    expect(() => event.stopImmediatePropagation()).not.toThrow();
  });
});

describe("Storage Event Listeners (Standalone Mode)", () => {
  let storage: FakeStorage;
  let mockListener: jest.Mock;

  beforeEach(() => {
    storage = new FakeStorage();
    mockListener = jest.fn();
    // Clear any existing listeners
    clearStorageEvents();
  });

  afterEach(() => {
    // Clean up listeners after each test
    clearStorageEvents();
  });

  describe("onStorageEvent", () => {
    test("should register storage event listener", () => {
      onStorageEvent(mockListener);

      storage.setItem("key1", "value1");

      expect(mockListener).toHaveBeenCalledTimes(1);
      expect(mockListener).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "storage",
          key: "key1",
          newValue: "value1",
          oldValue: null,
          storageArea: storage,
        })
      );
    });

    test("should register multiple listeners", () => {
      const listener1 = jest.fn();
      const listener2 = jest.fn();

      onStorageEvent(listener1);
      onStorageEvent(listener2);

      storage.setItem("key1", "value1");

      expect(listener1).toHaveBeenCalledTimes(1);
      expect(listener2).toHaveBeenCalledTimes(1);
    });

    test("should call listeners for setItem events", () => {
      onStorageEvent(mockListener);

      storage.setItem("key1", "value1");
      storage.setItem("key1", "value2"); // Update existing

      expect(mockListener).toHaveBeenCalledTimes(2);

      // First call - new item
      expect(mockListener).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          key: "key1",
          newValue: "value1",
          oldValue: null,
        })
      );

      // Second call - update existing
      expect(mockListener).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          key: "key1",
          newValue: "value2",
          oldValue: "value1",
        })
      );
    });

    test("should call listeners for removeItem events", () => {
      onStorageEvent(mockListener);

      storage.setItem("key1", "value1");
      mockListener.mockClear();
      storage.removeItem("key1");

      expect(mockListener).toHaveBeenCalledTimes(1);
      expect(mockListener).toHaveBeenCalledWith(
        expect.objectContaining({
          key: "key1",
          newValue: null,
          oldValue: "value1",
        })
      );
    });

    test("should call listeners for clear events", () => {
      onStorageEvent(mockListener);

      storage.setItem("key1", "value1");
      storage.setItem("key2", "value2");
      mockListener.mockClear();
      storage.clear();

      expect(mockListener).toHaveBeenCalledTimes(2);
    });

    test("should not call listeners for non-existent key removal", () => {
      onStorageEvent(mockListener);

      storage.removeItem("nonexistent");

      expect(mockListener).not.toHaveBeenCalled();
    });
  });

  describe("offStorageEvent", () => {
    test("should remove specific listener", () => {
      const listener1 = jest.fn();
      const listener2 = jest.fn();

      onStorageEvent(listener1);
      onStorageEvent(listener2);
      offStorageEvent(listener1);

      storage.setItem("key1", "value1");

      expect(listener1).not.toHaveBeenCalled();
      expect(listener2).toHaveBeenCalledTimes(1);
    });

    test("should remove all instances of the same listener", () => {
      onStorageEvent(mockListener);
      onStorageEvent(mockListener); // Add same listener twice
      offStorageEvent(mockListener);

      storage.setItem("key1", "value1");

      expect(mockListener).not.toHaveBeenCalled();
    });

    test("should handle removing non-existent listener gracefully", () => {
      const nonExistentListener = jest.fn();

      expect(() => offStorageEvent(nonExistentListener)).not.toThrow();
    });
  });

  describe("clearStorageEvents", () => {
    test("should remove all listeners", () => {
      const listener1 = jest.fn();
      const listener2 = jest.fn();

      onStorageEvent(listener1);
      onStorageEvent(listener2);
      clearStorageEvents();

      storage.setItem("key1", "value1");

      expect(listener1).not.toHaveBeenCalled();
      expect(listener2).not.toHaveBeenCalled();
    });

    test("should work when no listeners are registered", () => {
      expect(() => clearStorageEvents()).not.toThrow();
    });
  });

  describe("Event Properties", () => {
    test("should have correct event properties", () => {
      onStorageEvent(mockListener);

      storage.setItem("key1", "value1");

      const event = mockListener.mock.calls[0][0];
      expect(event).toBeInstanceOf(StorageEvent);
      expect(event.type).toBe("storage");
      expect(event.key).toBe("key1");
      expect(event.newValue).toBe("value1");
      expect(event.oldValue).toBeNull();
      expect(event.storageArea).toBe(storage);
      expect(typeof event.url).toBe("string");
      expect(event.bubbles).toBe(false);
      expect(event.cancelable).toBe(false);
      expect(event.isTrusted).toBe(false);
    });

    test("should have correct event properties for updates", () => {
      onStorageEvent(mockListener);

      storage.setItem("key1", "value1");
      storage.setItem("key1", "value2");

      const updateEvent = mockListener.mock.calls[1][0];
      expect(updateEvent.key).toBe("key1");
      expect(updateEvent.newValue).toBe("value2");
      expect(updateEvent.oldValue).toBe("value1");
      expect(updateEvent.storageArea).toBe(storage);
    });

    test("should have correct event properties for removal", () => {
      onStorageEvent(mockListener);

      storage.setItem("key1", "value1");
      storage.removeItem("key1");

      const removeEvent = mockListener.mock.calls[1][0];
      expect(removeEvent.key).toBe("key1");
      expect(removeEvent.newValue).toBeNull();
      expect(removeEvent.oldValue).toBe("value1");
      expect(removeEvent.storageArea).toBe(storage);
    });
  });

  describe("Multiple Storage Instances", () => {
    test("should dispatch events for each storage instance", () => {
      const storage1 = new FakeStorage();
      const storage2 = new FakeStorage();
      const listener1 = jest.fn();
      const listener2 = jest.fn();

      onStorageEvent(listener1);
      onStorageEvent(listener2);

      storage1.setItem("key1", "value1");
      storage2.setItem("key2", "value2");

      // Both listeners should receive events from both storages
      expect(listener1).toHaveBeenCalledTimes(2);
      expect(listener2).toHaveBeenCalledTimes(2);

      // Check that events have correct storageArea
      const events1 = listener1.mock.calls.map((call) => call[0]);
      const events2 = listener2.mock.calls.map((call) => call[0]);

      expect(events1.some((e) => e.storageArea === storage1)).toBe(true);
      expect(events1.some((e) => e.storageArea === storage2)).toBe(true);
      expect(events2.some((e) => e.storageArea === storage1)).toBe(true);
      expect(events2.some((e) => e.storageArea === storage2)).toBe(true);
    });
  });

  describe("Error Handling", () => {
    test("should handle listener errors gracefully", () => {
      const errorListener = jest.fn(() => {
        throw new Error("Listener error");
      });
      const normalListener = jest.fn();

      onStorageEvent(errorListener);
      onStorageEvent(normalListener);

      // Should not throw, and normal listener should still be called
      expect(() => storage.setItem("key1", "value1")).not.toThrow();
      expect(normalListener).toHaveBeenCalledTimes(1);
    });
  });
});
