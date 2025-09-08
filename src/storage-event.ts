/**
 * StorageEvent implementation for testing environments
 * Uses native Event class available in both browser and modern Node.js
 */

export interface StorageEventInit {
  key?: string | null;
  newValue?: string | null;
  oldValue?: string | null;
  storageArea?: Storage | null;
  url?: string;
}

export class StorageEvent extends Event {
  public readonly key: string | null;
  public readonly newValue: string | null;
  public readonly oldValue: string | null;
  public readonly storageArea: Storage | null;
  public readonly url: string;

  constructor(type: string, eventInitDict?: StorageEventInit) {
    // StorageEvent has fixed bubbles=false, cancelable=false per MDN spec
    super(type, {
      bubbles: false,
      cancelable: false,
    });

    // Set StorageEvent-specific properties
    this.key = eventInitDict?.key ?? null;
    this.newValue = eventInitDict?.newValue ?? null;
    this.oldValue = eventInitDict?.oldValue ?? null;
    this.storageArea = eventInitDict?.storageArea ?? null;
    this.url =
      eventInitDict?.url ??
      (typeof window !== "undefined" ? window.location?.href : "") ??
      "";
  }
}
