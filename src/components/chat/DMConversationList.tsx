import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Plus, Users } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";

const conversations = [
  { id: "1", name: "Alex Chen", avatar: "A", color: "from-cyan-400 to-blue-500", status: "online", lastMessage: "Sounds good, let me know!", time: "2m ago", unread: 2 },
  { id: "2", name: "Maya Patel", avatar: "M", color: "from-pink-400 to-rose-500", status: "online", lastMessage: "The new design looks great 🎨", time: "15m ago", unread: 0 },
  { id: "3", name: "Jordan Lee", avatar: "J", color: "from-amber-400 to-orange-500", status: "idle", lastMessage: "Can you review my PR?", time: "1h ago", unread: 1 },
  { id: "4", name: "Sam Wright", avatar: "S", color: "from-emerald-400 to-green-500", status: "dnd", lastMessage: "Meeting at 3pm tomorrow", time: "3h ago", unread: 0 },
  { id: "5", name: "Riley Quinn", avatar: "R", color: "from-violet-400 to-purple-500", status: "offline", lastMessage: "Thanks for the help!", time: "1d ago", unread: 0 },
  { id: "6", name: "Taylor Kim", avatar: "T", color: "from-teal-400 to-cyan-500", status: "offline", lastMessage: "See you next week", time: "2d ago", unread: 0 },
];

const statusColors: Record<string, string> = {
  online: "bg-online",
  idle: "bg-idle",
  dnd: "bg-dnd",
  offline: "bg-muted-foreground/50",
};

interface DMConversationListProps {
  activeConversation: string;
  onConversationChange: (id: string) => void;
}

const DMConversationList = ({ activeConversation, onConversationChange }: DMConversationListProps) => {
  const [search, setSearch] = useState("");
  const { unreads } = useNotifications();

  const filtered = conversations.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col w-60 bg-card shrink-0">
      {/* Header */}
      <div className="h-12 px-4 flex items-center border-b border-border">
        <h2 className="font-semibold text-foreground">Direct Messages</h2>
      </div>

      {/* Search */}
      <div className="px-2 pt-3 pb-1">
        <div className="flex items-center gap-2 px-2 h-7 bg-background/50 rounded-md">
          <Search size={14} className="text-muted-foreground shrink-0" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Find a conversation"
            className="flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground outline-none"
          />
        </div>
      </div>

      {/* New DM button */}
      <div className="px-2 pt-2 pb-1">
        <button className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors">
          <Plus size={16} />
          <span>New Message</span>
        </button>
        <button className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors">
          <Users size={16} />
          <span>Create Group DM</span>
        </button>
      </div>

      <div className="px-2 pt-2">
        <span className="px-1 text-[11px] font-semibold tracking-wider text-muted-foreground">
          RECENT
        </span>
      </div>

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto scrollbar-thin px-2 pb-2 mt-1">
          {filtered.map((convo) => {
            const isActive = activeConversation === convo.id;
            const dmKey = `dm-${convo.id}`;
            const convoUnread = unreads[dmKey];
            const unreadCount = convoUnread?.count || 0;
            return (
              <motion.button
                key={convo.id}
                onClick={() => onConversationChange(convo.id)}
                className={`w-full flex items-center gap-2.5 px-2 py-2 rounded-md transition-colors mb-0.5 ${
                  isActive ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/30 hover:text-foreground"
                }`}
                whileTap={{ scale: 0.98 }}
              >
                <div className="relative shrink-0">
                  <div
                    className={`w-8 h-8 rounded-full bg-gradient-to-br ${convo.color} flex items-center justify-center text-xs font-bold`}
                    style={{ color: "white" }}
                  >
                    {convo.avatar}
                  </div>
                  <div
                    className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-card ${statusColors[convo.status]}`}
                  />
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm truncate ${unreadCount > 0 ? "font-semibold text-foreground" : ""}`}>
                      {convo.name}
                    </span>
                    <span className="text-[10px] text-muted-foreground shrink-0 ml-1">{convo.time}</span>
                  </div>
                  <p className={`text-xs truncate ${unreadCount > 0 ? "text-foreground/80" : "text-muted-foreground"}`}>
                    {convo.lastMessage}
                  </p>
                </div>
                {unreadCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center shrink-0"
                  >
                    {unreadCount}
                  </motion.span>
                )}
              </motion.button>
            );
          })}
      </div>

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
      </div>
    </div>
  );
};

export default DMConversationList;
