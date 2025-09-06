import { StorageEvent } from "./storage-event";

class StorageEventEmitter extends EventTarget {
  private listeners: EventListener[] = [];

  constructor() {
    super();
  }

  private get dispatcher(): EventTarget {
    if (
      typeof globalThis !== "undefined" &&
      typeof globalThis.dispatchEvent === "function"
    ) {
      console.log("globalThis");
      return globalThis;
    }
    if (
      typeof global !== "undefined" &&
      typeof global.dispatchEvent === "function"
    ) {
      console.log("global");
      return global;
    }
    if (
      typeof window !== "undefined" &&
      typeof window.dispatchEvent === "function"
    ) {
      console.log("window");
      return window;
    }
    console.log("this");
    return this;
  }

  emit(data: StorageEventInit) {
    const StorageEventConstructor =
      (typeof globalThis !== "undefined" && globalThis.StorageEvent) ||
      (typeof global !== "undefined" && global.StorageEvent) ||
      (typeof window !== "undefined" && window.StorageEvent) ||
      StorageEvent;
    this.dispatcher.dispatchEvent(new StorageEventConstructor("storage", data));
  }

  on(callback: EventListener) {
    this.listeners.push(callback);
    this.dispatcher.addEventListener("storage", callback);
  }

  off(callback: EventListener) {
    this.listeners = this.listeners.filter((listener) => listener !== callback);
    this.dispatcher.removeEventListener("storage", callback);
  }

  clear() {
    this.listeners.forEach((listener) => {
      this.off(listener);
    });
    this.listeners = [];
  }
}

export const storageEventEmitter = new StorageEventEmitter();
export const onStorageEvent = storageEventEmitter.on.bind(storageEventEmitter);
export const offStorageEvent =
  storageEventEmitter.off.bind(storageEventEmitter);
export const clearStorageEvents =
  storageEventEmitter.clear.bind(storageEventEmitter);
