import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Hash, Volume2, ChevronDown, Settings, Plus, Search, Bell, Pin } from "lucide-react";
import VoiceChannelPanel from "./VoiceChannelPanel";
import { useNotifications } from "@/hooks/useNotifications";

const categories = [
  {
    name: "INFORMATION",
    channels: [
      { id: "announcements", name: "announcements", type: "text", unread: true, mentions: 3 },
      { id: "rules", name: "rules", type: "text" },
    ],
  },
  {
    name: "GENERAL",
    channels: [
      { id: "general", name: "general", type: "text", unread: true },
      { id: "off-topic", name: "off-topic", type: "text" },
      { id: "introductions", name: "introductions", type: "text" },
    ],
  },
  {
    name: "VOICE",
    channels: [
      { id: "lounge", name: "Lounge", type: "voice", users: 3 },
      { id: "gaming", name: "Gaming", type: "voice" },
    ],
  },
  {
    name: "PROJECTS",
    channels: [
      { id: "showcase", name: "showcase", type: "text", unread: true },
      { id: "feedback", name: "feedback", type: "text" },
      { id: "resources", name: "resources", type: "text" },
    ],
  },
];

interface ChannelListProps {
  activeChannel: string;
  onChannelChange: (id: string) => void;
  onOpenSettings?: () => void;
  voiceChannel: string | null;
  onJoinVoice: (id: string) => void;
  onLeaveVoice: () => void;
}

const ChannelList = ({ activeChannel, onChannelChange, onOpenSettings, voiceChannel, onJoinVoice, onLeaveVoice }: ChannelListProps) => {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const { unreads } = useNotifications();

  return (
    <div className="flex flex-col w-60 bg-card shrink-0">
      {/* Server header */}
      <button
        onClick={onOpenSettings}
        className="h-12 px-4 flex items-center justify-between border-b border-border hover:bg-muted/50 transition-colors"
      >
        <h2 className="font-semibold text-foreground truncate">Vortex HQ</h2>
        <Settings size={16} className="text-muted-foreground" />
      </button>

      {/* Search */}
      <div className="px-2 pt-3 pb-1">
        <button className="w-full h-7 px-2 flex items-center gap-2 text-xs text-muted-foreground bg-background/50 rounded-md hover:bg-background transition-colors">
          <Search size={14} />
          <span>Search</span>
        </button>
      </div>

      {/* Channels */}
      <div className="flex-1 overflow-y-auto scrollbar-thin px-2 pb-2">
        {categories.map((cat) => (
          <div key={cat.name} className="mt-4">
            <button
              onClick={() => setCollapsed((p) => ({ ...p, [cat.name]: !p[cat.name] }))}
              className="flex items-center gap-0.5 px-1 mb-1 text-[11px] font-semibold tracking-wider text-muted-foreground hover:text-foreground transition-colors w-full group"
            >
              <ChevronDown
                size={10}
                className={`transition-transform ${collapsed[cat.name] ? "-rotate-90" : ""}`}
              />
              <span>{cat.name}</span>
              <Plus size={12} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>

            <AnimatePresence initial={false}>
              {!collapsed[cat.name] && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="overflow-hidden"
                >
                  {cat.channels.map((ch) => {
                    const isActive = ch.type === "voice" ? voiceChannel === ch.id : activeChannel === ch.id;
                    const chUnread = unreads[ch.id];
                    const hasUnread = !!chUnread && chUnread.count > 0;
                    return (
                      <button
                        key={ch.id}
                        onClick={() => {
                          if (ch.type === "voice") {
                            voiceChannel === ch.id ? onLeaveVoice() : onJoinVoice(ch.id);
                          } else {
                            onChannelChange(ch.id);
                          }
                        }}
                        className={`w-full flex items-center gap-1.5 px-2 py-1.5 rounded-md text-sm group transition-colors ${
                          isActive
                            ? "bg-muted text-foreground"
                            : hasUnread
                            ? "text-foreground hover:bg-muted/50"
                            : "text-muted-foreground hover:bg-muted/30 hover:text-foreground"
                        }`}
                      >
                        {/* Unread indicator bar */}
                        {hasUnread && !isActive && (
                          <span className="absolute left-0 w-1 h-2 bg-foreground rounded-r-full" />
                        )}
                        {ch.type === "voice" ? (
                          <Volume2 size={16} className="shrink-0 text-muted-foreground" />
                        ) : (
                          <Hash size={16} className="shrink-0 text-muted-foreground" />
                        )}
                        <span className={`truncate ${hasUnread && !isActive ? "font-semibold" : ""}`}>
                          {ch.name}
                        </span>
                        {chUnread && chUnread.mentions > 0 && !isActive && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="ml-auto bg-destructive text-destructive-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center"
                          >
                            {chUnread.mentions}
                          </motion.span>
                        )}
                        {ch.users && (
                          <span className="ml-auto text-[10px] text-muted-foreground">
                            {ch.users}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Voice Channel Panel */}
      <AnimatePresence>
        {voiceChannel && (
          <VoiceChannelPanel
            channelName={
              categories
                .flatMap((c) => c.channels)
                .find((ch) => ch.id === voiceChannel)?.name || voiceChannel
            }
            onDisconnect={onLeaveVoice}
          />
        )}
      </AnimatePresence>

      {/* User bar */}
      <div className="h-[52px] px-2 flex items-center gap-2 bg-sidebar border-t border-border">
        <div className="relative">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xs font-bold text-primary-foreground">
            Y
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-online rounded-full border-2 border-sidebar" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">You</p>
          <p className="text-[10px] text-muted-foreground">Online</p>
        </div>
        <button className="p-1.5 text-muted-foreground hover:text-foreground transition-colors">
          <Settings size={16} />
        </button>
      </div>
    </div>
  );
};

export default ChannelList;
