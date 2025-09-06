/**
 * StorageEvent implementation for testing environments
 * Compatible with both browser and Node.js environments
 */

export interface StorageEventInit {
  key?: string | null;
  newValue?: string | null;
  oldValue?: string | null;
  storageArea?: Storage | null;
  url?: string;
}

export class StorageEvent implements Event {
  public readonly type: string;
  public readonly key: string | null;
  public readonly newValue: string | null;
  public readonly oldValue: string | null;
  public readonly storageArea: Storage | null;
  public readonly url: string;

  // Event interface properties
  public readonly AT_TARGET = 2;
  public readonly BUBBLING_PHASE = 3;
  public readonly CAPTURING_PHASE = 1;
  public readonly NONE = 0;

  public bubbles = false;
  public cancelable = false;
  public cancelBubble = false;
  public composed = false;
  public currentTarget: EventTarget | null = null;
  public defaultPrevented = false;
  public eventPhase = this.NONE;
  public isTrusted = false;
  public returnValue = true;
  public srcElement: EventTarget | null = null;
  public target: EventTarget | null = null;
  public timeStamp = Date.now();

  constructor(type: string, eventInitDict?: StorageEventInit) {
    this.type = type;
    this.key = eventInitDict?.key ?? null;
    this.newValue = eventInitDict?.newValue ?? null;
    this.oldValue = eventInitDict?.oldValue ?? null;
    this.storageArea = eventInitDict?.storageArea ?? null;
    this.url = eventInitDict?.url ?? "";
  }

  // Event interface methods
  preventDefault(): void {
    this.defaultPrevented = true;
  }

  stopPropagation(): void {
    this.cancelBubble = true;
  }

  stopImmediatePropagation(): void {
    this.cancelBubble = true;
  }

  initEvent(): void {
    // No-op for compatibility
  }

  composedPath(): EventTarget[] {
    return [];
  }
}
