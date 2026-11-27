"use client";

import { useEffect, useRef } from "react";
import type { Socket } from "socket.io-client";

/**
 * Singleton socket connection to the Qabiltoo realtime service.
 * Always connects via the gateway path — never a bare port URL.
 *
 * Performance: the socket.io bundle is code-split and the connection is
 * established once the main thread is idle, so realtime never competes
 * with page hydration for main-thread time. Call sites `await getSocket()`.
 */
let socketPromise: Promise<Socket> | null = null;

/**
 * Realtime service URL.
 * - Sandbox/preview: gateway path with port transform (default).
 * - Docker/self-host: set NEXT_PUBLIC_SOCKET_URL (e.g. "http://localhost:3003" or "/realtime").
 */
const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || "/?XTransformPort=3003";

/** Run cb when the main thread is idle (fallback: short timeout). */
function whenIdle(cb: () => void): void {
  if (typeof window === "undefined") {
    cb();
    return;
  }
  const ric = (
    window as unknown as {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
    }
  ).requestIdleCallback;
  if (ric) ric(cb, { timeout: 2000 });
  else window.setTimeout(cb, 300);
}

/**
 * Promise resolving to the shared socket connection.
 * The socket.io chunk is fetched lazily on idle; emits issued before the
 * promise resolves are simply delayed by a few ms — socket.io buffers them.
 */
export function getSocket(): Promise<Socket> {
  if (!socketPromise) {
    socketPromise = new Promise<Socket>((resolve, reject) => {
      whenIdle(() => {
        import("socket.io-client")
          .then(({ io }) => {
            resolve(
              io(SOCKET_URL, {
                transports: ["websocket", "polling"],
                forceNew: false,
                reconnection: true,
                reconnectionAttempts: Infinity,
                reconnectionDelay: 1500,
                timeout: 10000,
              })
            );
          })
          .catch((err) => {
            socketPromise = null; // allow a later retry
            reject(err);
          });
      });
    });
    // A failed realtime connection must never surface as an unhandled rejection
    socketPromise.catch(() => {});
  }
  return socketPromise;
}

/** Subscribe to a socket event with automatic cleanup. Handler should be memoized. */
export function useSocketEvent(
  event: string,
  handler: (...args: unknown[]) => void,
  enabled = true
) {
  const handlerRef = useRef(handler);
  useEffect(() => {
    handlerRef.current = handler;
  });

  useEffect(() => {
    if (!enabled) return;
    let active = true;
    let detach: (() => void) | null = null;
    getSocket()
      .then((s) => {
        if (!active) return;
        const fn = (...args: unknown[]) => handlerRef.current(...args);
        s.on(event, fn);
        detach = () => s.off(event, fn);
      })
      .catch(() => {});
    return () => {
      active = false;
      detach?.();
    };
  }, [event, enabled]);
}
