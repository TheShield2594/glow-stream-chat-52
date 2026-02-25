import { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";

interface Notification {
  id: string;
  channelId: string;
  serverId: string;
  message: string;
  author: string;
  timestamp: number;
}

interface UnreadState {
  [channelOrConvoId: string]: { count: number; mentions: number };
}

interface NotificationContextType {
  unreads: UnreadState;
  addUnread: (channelId: string, mentions?: number) => void;
  markRead: (channelId: string) => void;
  getTotalUnreads: (serverIdOrType: string) => { count: number; mentions: number };
  soundEnabled: boolean;
  setSoundEnabled: (v: boolean) => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

// Channel -> server mapping
const channelServerMap: Record<string, string> = {
  announcements: "home",
  rules: "home",
  general: "home",
  "off-topic": "home",
  introductions: "home",
  showcase: "home",
  feedback: "home",
  resources: "home",
  // DM conversations
  "dm-1": "dm",
  "dm-2": "dm",
  "dm-3": "dm",
  "dm-4": "dm",
  "dm-5": "dm",
  "dm-6": "dm",
};

const initialUnreads: UnreadState = {
  announcements: { count: 3, mentions: 3 },
  general: { count: 5, mentions: 0 },
  showcase: { count: 2, mentions: 0 },
  "dm-1": { count: 2, mentions: 2 },
  "dm-3": { count: 1, mentions: 1 },
};

// Generate a short notification sound using Web Audio API
function playNotificationSound(type: "message" | "mention" = "message") {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === "mention") {
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.setValueAtTime(1100, ctx.currentTime + 0.08);
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.16);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.3);
    } else {
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.setValueAtTime(800, ctx.currentTime + 0.06);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.15);
    }
  } catch {
    // Audio not available
  }
}

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [unreads, setUnreads] = useState<UnreadState>(initialUnreads);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const soundEnabledRef = useRef(soundEnabled);
  soundEnabledRef.current = soundEnabled;

  const addUnread = useCallback((channelId: string, mentions = 0) => {
    setUnreads((prev) => ({
      ...prev,
      [channelId]: {
        count: (prev[channelId]?.count || 0) + 1,
        mentions: (prev[channelId]?.mentions || 0) + mentions,
      },
    }));
    if (soundEnabledRef.current) {
      playNotificationSound(mentions > 0 ? "mention" : "message");
    }
  }, []);

  const markRead = useCallback((channelId: string) => {
    setUnreads((prev) => {
      const next = { ...prev };
      delete next[channelId];
      return next;
    });
  }, []);

  const getTotalUnreads = useCallback(
    (serverIdOrType: string) => {
      let count = 0;
      let mentions = 0;
      for (const [chId, data] of Object.entries(unreads)) {
        const server = channelServerMap[chId];
        if (server === serverIdOrType) {
          count += data.count;
          mentions += data.mentions;
        }
      }
      return { count, mentions };
    },
    [unreads]
  );

  // Simulate incoming messages periodically
  useEffect(() => {
    const channels = ["general", "off-topic", "showcase", "feedback", "dm-1", "dm-2", "dm-3"];
    const interval = setInterval(() => {
      const ch = channels[Math.floor(Math.random() * channels.length)];
      const isMention = Math.random() > 0.8;
      addUnread(ch, isMention ? 1 : 0);
    }, 12000);
    return () => clearInterval(interval);
  }, [addUnread]);

  return (
    <NotificationContext.Provider value={{ unreads, addUnread, markRead, getTotalUnreads, soundEnabled, setSoundEnabled }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotifications must be used within NotificationProvider");
  return ctx;
}
