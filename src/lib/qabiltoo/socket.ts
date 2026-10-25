"use client";

import { useEffect, useRef } from "react";
import { io, type Socket } from "socket.io-client";

/**
 * Singleton socket connection to the Qabiltoo realtime service.
 * Always connects via the gateway path — never a bare port URL.
 */
let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io("/?XTransformPort=3003", {
      transports: ["websocket", "polling"],
      forceNew: false,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1500,
      timeout: 10000,
    });
  }
  return socket;
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
    const s = getSocket();
    const fn = (...args: unknown[]) => handlerRef.current(...args);
    s.on(event, fn);
    return () => {
      s.off(event, fn);
    };
  }, [event, enabled]);
}
