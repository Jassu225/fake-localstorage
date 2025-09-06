/**
 * Main export for fake-localstorage package
 * Usage: import fakeLocalStorage from "fake-localstorage"
 */

export { default } from "./fake-localstorage";
export { default as fakeLocalStorage } from "./fake-localstorage";
export { StorageEvent } from "./fake-localstorage";
export type { StorageEventInit } from "./fake-localstorage";
export {
  onStorageEvent,
  offStorageEvent,
  clearStorageEvents,
} from "./event-emiter";
