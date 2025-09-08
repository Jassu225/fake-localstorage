import { StorageEvent } from "./storage-event";

class StorageEventEmitter extends EventTarget {
  private listenerToSafeListener: Map<EventListener, EventListener> = new Map();
  private safeListenerToOptions: Map<
    EventListener,
    AddEventListenerOptions | boolean | undefined
  > = new Map();
  private errorHandler?: (error: Error, listener: EventListener) => void;

  constructor() {
    super();
  }

  private get dispatcher(): EventTarget {
    if (
      typeof window !== "undefined" &&
      typeof window.dispatchEvent === "function"
    ) {
      // console.log("window");
      return window;
    }
    // console.log("this");
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

  on(callback: EventListener, options?: AddEventListenerOptions | boolean) {
    if (this.listenerToSafeListener.has(callback)) {
      return;
    }
    const safeListener = this.createSafeListener(callback);
    this.listenerToSafeListener.set(callback, safeListener);
    this.safeListenerToOptions.set(safeListener, options);
    this.dispatcher.addEventListener("storage", safeListener, options);
  }

  off(callback: EventListener) {
    const safeListener = this.listenerToSafeListener.get(callback);
    if (!safeListener) {
      return;
    }
    this.listenerToSafeListener.delete(callback);
    const savedOptions = this.safeListenerToOptions.get(safeListener);
    this.safeListenerToOptions.delete(safeListener);
    this.dispatcher.removeEventListener("storage", safeListener, savedOptions);
  }

  clear() {
    this.listenerToSafeListener.forEach((safeListener, listener) => {
      this.off(listener);
    });
    this.listenerToSafeListener.clear();
    this.safeListenerToOptions.clear();
  }

  private createSafeListener(originalListener: EventListener): EventListener {
    return (event: Event) => {
      try {
        originalListener(event);
      } catch (error) {
        this.handleListenerError(error as Error, originalListener);
      }
    };
  }

  private handleListenerError(error: Error, listener: EventListener) {
    if (this.errorHandler) {
      try {
        this.errorHandler(error, listener);
      } catch (handlerError) {
        console.error("Error in error handler:", handlerError);
        console.error("Original error:", error);
      }
    } else {
      // Default error handling - log but don't crash
      console.error("Error in storage event listener:", error);
      console.error("Listener:", listener.toString());
    }
  }

  // Set a custom error handler
  setErrorHandler(handler: (error: Error, listener: EventListener) => void) {
    this.errorHandler = handler;
  }
}

export const storageEventEmitter = new StorageEventEmitter();
export const onStorageEvent = storageEventEmitter.on.bind(storageEventEmitter);
export const offStorageEvent =
  storageEventEmitter.off.bind(storageEventEmitter);
export const clearStorageEvents =
  storageEventEmitter.clear.bind(storageEventEmitter);
