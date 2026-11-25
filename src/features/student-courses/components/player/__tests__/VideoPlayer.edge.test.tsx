import React, { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vite-plus/test";
import type { VideoPlaybackPayload } from "@/types";

// --- Minimal DOM shim for mounting React 19 in Vitest node environment ---
class FakeEvent {
  type: string;
  bubbles: boolean;
  cancelable: boolean;
  target: FakeNode | null = null;
  currentTarget: FakeNode | null = null;
  defaultPrevented = false;
  cancelBubble = false;

  constructor(type: string, init?: { bubbles?: boolean; cancelable?: boolean }) {
    this.type = type;
    this.bubbles = Boolean(init?.bubbles);
    this.cancelable = Boolean(init?.cancelable);
  }

  preventDefault() {
    this.defaultPrevented = true;
  }

  stopPropagation() {
    this.cancelBubble = true;
  }
}

class FakeNode {
  nodeType: number;
  nodeName: string;
  parentNode: FakeNode | null = null;
  childNodes: FakeNode[] = [];
  ownerDocument: FakeDocument;
  private listeners = new Map<string, Set<(e: FakeEvent) => void>>();

  constructor(nodeType: number, nodeName: string, ownerDocument: FakeDocument) {
    this.nodeType = nodeType;
    this.nodeName = nodeName;
    this.ownerDocument = ownerDocument;
  }

  get firstChild() {
    return this.childNodes[0] ?? null;
  }

  get lastChild() {
    return this.childNodes[this.childNodes.length - 1] ?? null;
  }

  get nextSibling(): FakeNode | null {
    if (!this.parentNode) return null;
    const idx = this.parentNode.childNodes.indexOf(this);
    return idx >= 0 ? (this.parentNode.childNodes[idx + 1] ?? null) : null;
  }

  get previousSibling(): FakeNode | null {
    if (!this.parentNode) return null;
    const idx = this.parentNode.childNodes.indexOf(this);
    return idx > 0 ? (this.parentNode.childNodes[idx - 1] ?? null) : null;
  }

  appendChild(child: FakeNode) {
    if (child.parentNode) child.parentNode.removeChild(child);
    child.parentNode = this;
    this.childNodes.push(child);
    return child;
  }

  insertBefore(child: FakeNode, ref: FakeNode | null) {
    if (!ref) return this.appendChild(child);
    if (child.parentNode) child.parentNode.removeChild(child);
    const idx = this.childNodes.indexOf(ref);
    if (idx === -1) return this.appendChild(child);
    child.parentNode = this;
    this.childNodes.splice(idx, 0, child);
    return child;
  }

  removeChild(child: FakeNode) {
    const idx = this.childNodes.indexOf(child);
    if (idx !== -1) {
      this.childNodes.splice(idx, 1);
      child.parentNode = null;
    }
    return child;
  }

  addEventListener(type: string, listener: (e: FakeEvent) => void) {
    if (!this.listeners.has(type)) this.listeners.set(type, new Set());
    this.listeners.get(type)!.add(listener);
  }

  removeEventListener(type: string, listener: (e: FakeEvent) => void) {
    this.listeners.get(type)?.delete(listener);
  }

  dispatchEvent(event: FakeEvent) {
    event.target = event.target ?? this;
    let current: FakeNode | null = this;
    while (current) {
      event.currentTarget = current;
      const set = current.listeners.get(event.type);
      if (set) {
        for (const fn of set) fn(event);
      }
      if (!event.bubbles || event.cancelBubble) break;
      current = current.parentNode;
    }
    return !event.defaultPrevented;
  }
}

class FakeElement extends FakeNode {
  tagName: string;
  style: Record<string, string> = {};
  attributes = new Map<string, string>();
  className = "";
  textContent: string | null = "";
  src = "";
  currentTime = 0;
  duration = 100;
  controls = false;
  playsInline = false;

  constructor(tagName: string, ownerDocument: FakeDocument) {
    super(1, tagName.toUpperCase(), ownerDocument);
    this.tagName = tagName.toUpperCase();
  }

  setAttribute(name: string, value: string) {
    this.attributes.set(name, String(value));
  }

  removeAttribute(name: string) {
    this.attributes.delete(name);
  }

  getAttribute(name: string) {
    return this.attributes.get(name) ?? null;
  }

  canPlayType() {
    return "";
  }

  querySelector(selector: string): FakeElement | null {
    const targetTag = selector.toUpperCase();
    for (const child of this.childNodes) {
      if (child instanceof FakeElement) {
        if (child.tagName === targetTag) return child;
        const nested = child.querySelector(selector);
        if (nested) return nested;
      }
    }
    return null;
  }
}

class FakeDocument extends FakeNode {
  activeElement: FakeNode | null = null;
  body: FakeElement;

  constructor() {
    super(9, "#document", null as unknown as FakeDocument);
    this.ownerDocument = this;
    this.body = new FakeElement("body", this);
    this.appendChild(this.body);
  }

  createElement(tag: string) {
    return new FakeElement(tag, this);
  }

  createElementNS(_ns: string, tag: string) {
    return new FakeElement(tag, this);
  }

  createTextNode(text: string) {
    const node = new FakeNode(3, "#text", this);
    (node as unknown as { nodeValue: string }).nodeValue = text;
    return node;
  }

  createComment(text: string) {
    const node = new FakeNode(8, "#comment", this);
    (node as unknown as { nodeValue: string }).nodeValue = text;
    return node;
  }
}

// --- Mocks ---
const hlsControl = vi.hoisted(() => {
  type ErrorHandler = (event: string, data: Record<string, unknown>) => void;
  const instances: Array<{
    loadSource: ReturnType<typeof vi.fn>;
    attachMedia: ReturnType<typeof vi.fn>;
    on: ReturnType<typeof vi.fn>;
    recoverMediaError: ReturnType<typeof vi.fn>;
    destroy: ReturnType<typeof vi.fn>;
    errorHandlers: ErrorHandler[];
  }> = [];

  class MockHls {
    static isSupported = vi.fn(() => true);
    static Events = { ERROR: "hlsError" };
    static ErrorTypes = {
      NETWORK_ERROR: "networkError",
      MEDIA_ERROR: "mediaError",
      KEY_SYSTEM_ERROR: "keySystemError",
      MUX_ERROR: "muxError",
      OTHER_ERROR: "otherError",
    };

    loadSource = vi.fn();
    attachMedia = vi.fn();
    recoverMediaError = vi.fn();
    destroy = vi.fn();
    errorHandlers: ErrorHandler[] = [];
    on = vi.fn((event: string, handler: ErrorHandler) => {
      if (event === MockHls.Events.ERROR) {
        this.errorHandlers.push(handler);
      }
    });

    constructor() {
      instances.push(this);
    }
  }

  return { MockHls, instances };
});

vi.mock("hls.js", () => ({
  default: hlsControl.MockHls,
}));

vi.mock("next/dynamic", () => ({
  default: () =>
    function MockYouTube() {
      return React.createElement("div", { "data-testid": "mock-youtube" });
    },
}));

vi.mock("@/features/auth", () => ({
  useCurrentUser: () => ({ user: null }),
}));

import { VideoPlayer } from "../VideoPlayer";

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0));

describe("VideoPlayer Edge Cases (TDD)", () => {
  let doc: FakeDocument;
  let container: FakeElement;
  let root: Root;

  beforeAll(() => {
    (globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT =
      true;
    doc = new FakeDocument();
    const fakeWindow = {
      document: doc,
      Event: FakeEvent,
      HTMLIFrameElement: FakeElement,
      HTMLElement: FakeElement,
      Element: FakeElement,
      Node: FakeNode,
    };
    (doc as unknown as { defaultView: typeof fakeWindow }).defaultView = fakeWindow;
    (globalThis as unknown as { document: FakeDocument }).document = doc;
    (globalThis as unknown as { window: typeof fakeWindow }).window = fakeWindow;
    (globalThis as unknown as { Node: typeof FakeNode }).Node = FakeNode;
    (globalThis as unknown as { Element: typeof FakeElement }).Element = FakeElement;
    (globalThis as unknown as { HTMLElement: typeof FakeElement }).HTMLElement = FakeElement;
    (globalThis as unknown as { HTMLIFrameElement: typeof FakeElement }).HTMLIFrameElement =
      FakeElement;
    (globalThis as unknown as { Event: typeof FakeEvent }).Event = FakeEvent;
  });

  beforeEach(() => {
    hlsControl.instances.length = 0;
    vi.clearAllMocks();
    container = doc.createElement("div");
    doc.body.appendChild(container);
    root = createRoot(container as unknown as Element);
  });

  afterEach(async () => {
    await act(async () => {
      root.unmount();
    });
    if (container.parentNode) {
      container.parentNode.removeChild(container);
    }
    vi.useRealTimers();
  });

  const makeHlsPlayback = (
    url: string,
    expiresAt = "2099-01-01T00:00:00Z",
  ): VideoPlaybackPayload => ({
    provider: "hls",
    url,
    expires_at: expiresAt,
  });

  it("recovers from fatal MEDIA_ERROR and respects a 5000ms cooldown", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:10.000Z"));

    await act(async () => {
      root.render(<VideoPlayer playback={makeHlsPlayback("https://cdn.test/1.m3u8")} />);
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(0);
    });

    const hls = hlsControl.instances[0];
    expect(hls).toBeDefined();
    expect(hls.errorHandlers.length).toBeGreaterThan(0);

    const emitFatalMediaError = () => {
      for (const fn of hls.errorHandlers) {
        fn("hlsError", {
          fatal: true,
          type: hlsControl.MockHls.ErrorTypes.MEDIA_ERROR,
        });
      }
    };

    // First fatal MEDIA_ERROR triggers recovery
    emitFatalMediaError();
    expect(hls.recoverMediaError).toHaveBeenCalledTimes(1);

    // Within 5000ms cooldown -> ignored
    vi.advanceTimersByTime(3000);
    emitFatalMediaError();
    expect(hls.recoverMediaError).toHaveBeenCalledTimes(1);

    // After 5000ms cooldown -> recovers again
    vi.advanceTimersByTime(2500);
    emitFatalMediaError();
    expect(hls.recoverMediaError).toHaveBeenCalledTimes(2);
  });

  it("destroys hls instance on fatal OTHER_ERROR", async () => {
    await act(async () => {
      root.render(<VideoPlayer playback={makeHlsPlayback("https://cdn.test/2.m3u8")} />);
    });
    await act(async () => {
      await flushPromises();
    });

    const hls = hlsControl.instances[0];
    expect(hls).toBeDefined();

    for (const fn of hls.errorHandlers) {
      fn("hlsError", {
        fatal: true,
        type: hlsControl.MockHls.ErrorTypes.OTHER_ERROR,
      });
    }

    expect(hls.destroy).toHaveBeenCalledTimes(1);
    expect(hls.recoverMediaError).not.toHaveBeenCalled();
  });

  it("invokes onTokenExpired on fatal NETWORK_ERROR with 403 or expired stream", async () => {
    const onTokenExpired = vi.fn();

    await act(async () => {
      root.render(
        <VideoPlayer
          playback={makeHlsPlayback("https://cdn.test/3.m3u8", "2099-01-01T00:00:00Z")}
          onTokenExpired={onTokenExpired}
        />,
      );
    });
    await act(async () => {
      await flushPromises();
    });

    const hls = hlsControl.instances[0];
    expect(hls).toBeDefined();

    for (const fn of hls.errorHandlers) {
      fn("hlsError", {
        fatal: true,
        type: hlsControl.MockHls.ErrorTypes.NETWORK_ERROR,
        response: { code: 403 },
      });
    }

    expect(onTokenExpired).toHaveBeenCalledTimes(1);
  });

  it("resets watchedMax and completion tracking when playback prop switches to a new lesson", async () => {
    const onProgress = vi.fn();
    const onComplete = vi.fn();

    // Lesson 1
    await act(async () => {
      root.render(
        <VideoPlayer
          playback={makeHlsPlayback("https://cdn.test/lesson-1.m3u8")}
          onProgress={onProgress}
          onComplete={onComplete}
          completionThreshold={80}
        />,
      );
    });
    await act(async () => {
      await flushPromises();
    });

    const video = container.querySelector("video");
    expect(video).not.toBeNull();

    // Complete Lesson 1 (90%)
    video!.duration = 100;
    video!.currentTime = 90;
    await act(async () => {
      video!.dispatchEvent(new FakeEvent("timeupdate", { bubbles: true }));
    });
    expect(onComplete).toHaveBeenCalledTimes(1);

    onProgress.mockClear();
    onComplete.mockClear();

    // Switch to Lesson 2 while mounted
    await act(async () => {
      root.render(
        <VideoPlayer
          playback={makeHlsPlayback("https://cdn.test/lesson-2.m3u8")}
          onProgress={onProgress}
          onComplete={onComplete}
          completionThreshold={80}
        />,
      );
    });
    await act(async () => {
      await flushPromises();
    });

    const video2 = container.querySelector("video");
    expect(video2).not.toBeNull();

    // Lesson 2 at 10% should report 10 (not leaked 90 from Lesson 1)
    video2!.duration = 100;
    video2!.currentTime = 10;
    await act(async () => {
      video2!.dispatchEvent(new FakeEvent("timeupdate", { bubbles: true }));
    });
    expect(onProgress).toHaveBeenCalledWith(10, 10);
    expect(onComplete).not.toHaveBeenCalled();

    // Lesson 2 reaches 85% -> onComplete fires cleanly for Lesson 2
    video2!.currentTime = 85;
    await act(async () => {
      video2!.dispatchEvent(new FakeEvent("timeupdate", { bubbles: true }));
    });
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it("preserves and restores playback position across silent token renewal for the same lessonId", async () => {
    const onTokenExpired = vi.fn();

    await act(async () => {
      root.render(
        <VideoPlayer
          lessonId={10}
          playback={makeHlsPlayback("https://cdn.test/10/playlist.m3u8?token=old")}
          onTokenExpired={onTokenExpired}
        />,
      );
    });
    await act(async () => {
      await flushPromises();
    });

    const video = container.querySelector("video")!;
    video.currentTime = 142;

    const hls = hlsControl.instances[0];
    for (const fn of hls.errorHandlers) {
      fn("hlsError", {
        fatal: true,
        type: hlsControl.MockHls.ErrorTypes.NETWORK_ERROR,
        response: { code: 403 },
      });
    }
    expect(onTokenExpired).toHaveBeenCalledTimes(1);

    // Re-render with refreshed token URL for the SAME lessonId
    await act(async () => {
      root.render(
        <VideoPlayer
          lessonId={10}
          playback={makeHlsPlayback("https://cdn.test/10/playlist.m3u8?token=fresh")}
          onTokenExpired={onTokenExpired}
        />,
      );
    });
    await act(async () => {
      await flushPromises();
    });

    const refreshedVideo = container.querySelector("video")!;
    refreshedVideo.currentTime = 0;
    await act(async () => {
      refreshedVideo.dispatchEvent(new FakeEvent("loadedmetadata", { bubbles: true }));
    });
    expect(refreshedVideo.currentTime).toBe(142);

    // Switching to a DIFFERENT lessonId must NOT carry over savedTime
    await act(async () => {
      root.render(
        <VideoPlayer
          lessonId={11}
          playback={makeHlsPlayback("https://cdn.test/11/playlist.m3u8?token=fresh2")}
          onTokenExpired={onTokenExpired}
        />,
      );
    });
    await act(async () => {
      await flushPromises();
    });

    const nextVideo = container.querySelector("video")!;
    nextVideo.currentTime = 0;
    await act(async () => {
      nextVideo.dispatchEvent(new FakeEvent("loadedmetadata", { bubbles: true }));
    });
    expect(nextVideo.currentTime).toBe(0);
  });

  it("limits silent auto-renewal to 1 attempt and shows manual renewal prompt on repeated 403", async () => {
    const onTokenExpired = vi.fn();

    await act(async () => {
      root.render(
        <VideoPlayer
          lessonId={20}
          playback={makeHlsPlayback("https://cdn.test/20/playlist.m3u8?token=old")}
          onTokenExpired={onTokenExpired}
        />,
      );
    });
    await act(async () => {
      await flushPromises();
    });

    const hls = hlsControl.instances[0];
    const emit403 = () => {
      for (const fn of hls.errorHandlers) {
        fn("hlsError", {
          fatal: true,
          type: hlsControl.MockHls.ErrorTypes.NETWORK_ERROR,
          response: { code: 403 },
        });
      }
    };

    // 1st 403 -> silent auto-renewal
    await act(async () => {
      emit403();
    });
    expect(onTokenExpired).toHaveBeenCalledTimes(1);

    const getTextContent = (node: FakeNode): string => {
      const own =
        (node as unknown as { nodeValue?: string | null; textContent?: string | null }).nodeValue ??
        (node as unknown as { textContent?: string | null }).textContent ??
        "";
      return String(own) + node.childNodes.map(getTextContent).join("");
    };

    // 2nd 403 -> loop guard stops auto-renewal and renders manual prompt
    await act(async () => {
      emit403();
      await flushPromises();
    });
    expect(onTokenExpired).toHaveBeenCalledTimes(1);
    expect(getTextContent(container)).toContain("انتهت صلاحية جلسة الفيديو");

    const retryBtn = container.querySelector("button");
    expect(retryBtn).not.toBeNull();
    expect(getTextContent(retryBtn!)).toContain("تحديث رابط التشغيل");

    // Manual retry triggers onTokenExpired again
    await act(async () => {
      retryBtn!.dispatchEvent(new FakeEvent("click", { bubbles: true }));
    });
    expect(onTokenExpired).toHaveBeenCalledTimes(2);
  });

  it("triggers silent renewal on Safari native <video> MEDIA_ERR_NETWORK even before client expires_at", async () => {
    const onTokenExpired = vi.fn();

    await act(async () => {
      root.render(
        <VideoPlayer
          lessonId={30}
          playback={makeHlsPlayback("https://cdn.test/30/playlist.m3u8", "2099-01-01T00:00:00Z")}
          onTokenExpired={onTokenExpired}
        />,
      );
    });
    await act(async () => {
      await flushPromises();
    });

    const video = container.querySelector("video")! as unknown as {
      canPlayType: (t: string) => string;
      error: { code: number } | null;
      dispatchEvent: (e: Event) => boolean;
    };
    video.canPlayType = () => "probably";
    video.error = { code: 2 }; // MediaError.MEDIA_ERR_NETWORK

    await act(async () => {
      video.dispatchEvent(new FakeEvent("error", { bubbles: true }) as unknown as Event);
    });

    expect(onTokenExpired).toHaveBeenCalledTimes(1);
  });
});
