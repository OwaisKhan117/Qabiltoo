import { createServer } from "http";
import { Server } from "socket.io";

/**
 * Qabiltoo Realtime Service (port 3003)
 * ─────────────────────────────────────
 * Pure relay + presence + live ticker. Message persistence happens via
 * the Next.js REST API (/api/messages); this service delivers events live.
 *
 * Client → Server
 *   identity     { profileId, name }
 *   chat:typing  { threadKey, toId, name }
 *   chat:read    { threadKey, readerId, otherId }
 *   chat:new     { message }            (relay after REST persist)
 *   notify       { toId, notification } (proposal/match toast relay)
 *
 * Server → Client
 *   presence          { onlineIds }
 *   chat:typing       { threadKey, name }
 *   chat:read         { threadKey, readerId }
 *   chat:new          { message }
 *   notification:new  { notification }
 *   ticker            { item }
 */

const httpServer = createServer();
const io = new Server(httpServer, {
  // DO NOT change the path, it is used by Caddy to forward the request to the correct port
  path: "/",
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
  pingTimeout: 60000,
  pingInterval: 25000,
});

const online = new Map<string, { profileId: string; name: string; sockets: Set<string> }>();

function broadcastPresence() {
  io.emit("presence", { onlineIds: [...online.keys()] });
}

io.on("connection", (socket) => {
  console.log(`socket connected: ${socket.id}`);

  socket.on("identity", (data: { profileId?: string; name?: string } = {}) => {
    const profileId = data?.profileId;
    if (!profileId || typeof profileId !== "string") return;
    socket.data.profileId = profileId;
    socket.join(`user:${profileId}`);
    const entry = online.get(profileId) ?? { profileId, name: data.name ?? "", sockets: new Set() };
    entry.sockets.add(socket.id);
    if (data.name) entry.name = data.name;
    online.set(profileId, entry);
    broadcastPresence();
    console.log(`identity: ${data.name ?? profileId} online (${online.size} users)`);
  });

  socket.on("chat:typing", (data: { threadKey?: string; toId?: string; name?: string } = {}) => {
    if (!data?.toId) return;
    io.to(`user:${data.toId}`).emit("chat:typing", {
      threadKey: data.threadKey,
      name: data.name,
      fromId: socket.data.profileId,
    });
  });

  socket.on("chat:read", (data: { threadKey?: string; readerId?: string; otherId?: string } = {}) => {
    if (!data?.otherId) return;
    io.to(`user:${data.otherId}`).emit("chat:read", {
      threadKey: data.threadKey,
      readerId: data.readerId,
    });
  });

  socket.on("chat:new", (data: { message?: any } = {}) => {
    const message = data?.message;
    if (!message?.toId || typeof message.toId !== "string") return;
    io.to(`user:${message.toId}`).emit("chat:new", { message });
  });

  socket.on("notify", (data: { toId?: string; notification?: any } = {}) => {
    if (!data?.toId) return;
    io.to(`user:${data.toId}`).emit("notification:new", { notification: data.notification });
  });

  socket.on("disconnect", () => {
    const pid = socket.data.profileId as string | undefined;
    if (pid && online.has(pid)) {
      const entry = online.get(pid)!;
      entry.sockets.delete(socket.id);
      if (entry.sockets.size === 0) {
        online.delete(pid);
        broadcastPresence();
      }
    }
    console.log(`socket disconnected: ${socket.id}`);
  });

  socket.on("error", (error) => {
    console.error(`socket error (${socket.id}):`, error);
  });
});

/* ── Simulated live ticker (sample data, clearly labelled client-side) ── */
const TICKER_ITEMS = [
  { text: "Ibrahim from Bengaluru just joined Qabiltoo", type: "join" },
  { text: "3 new proposals sent in the last hour", type: "proposal" },
  { text: "A wakeel from Pune just sent a respectful proposal", type: "proposal" },
  { text: "Two families in Kolkata agreed to a match — MashaAllah", type: "match" },
  { text: "Fatima from Dubai is now Gold verified", type: "verification" },
  { text: "A couple from Hyderabad completed their nikah — Barakallahu", type: "success" },
  { text: "Hafiz Yusuf from Toronto just joined", type: "join" },
  { text: "5 ID verifications approved today", type: "verification" },
];

let tick = 0;
setInterval(() => {
  const t = TICKER_ITEMS[tick % TICKER_ITEMS.length];
  tick += 1;
  io.emit("ticker", {
    item: { ...t, id: `ws-${Date.now()}`, createdAt: new Date().toISOString(), sample: true },
  });
}, 12000);

const PORT = 3003;
httpServer.listen(PORT, () => {
  console.log(`Qabiltoo realtime service running on port ${PORT}`);
});

process.on("SIGTERM", () => {
  httpServer.close(() => process.exit(0));
});
process.on("SIGINT", () => {
  httpServer.close(() => process.exit(0));
});
