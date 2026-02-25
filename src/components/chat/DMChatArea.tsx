import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Video, Pin, Search, SmilePlus, PlusCircle, ImagePlus, Send } from "lucide-react";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";

const dmMessages: Record<string, Array<{
  id: string; author: string; avatar: string; color: string; content: string; time: string; reactions?: Array<{ emoji: string; count: number }>;
}>> = {
  "1": [
    { id: "d1", author: "Alex Chen", avatar: "A", color: "from-cyan-400 to-blue-500", content: "Hey! Did you see the latest deploy?", time: "Today at 1:30 PM" },
    { id: "d2", author: "You", avatar: "Y", color: "from-primary to-accent", content: "Yeah, looks solid! The performance improvements are noticeable", time: "Today at 1:32 PM", reactions: [{ emoji: "🔥", count: 1 }] },
    { id: "d3", author: "Alex Chen", avatar: "A", color: "from-cyan-400 to-blue-500", content: "Right? Load times dropped by 40%. Want to pair on the next sprint?", time: "Today at 1:35 PM" },
    { id: "d4", author: "You", avatar: "Y", color: "from-primary to-accent", content: "Absolutely, let's set that up tomorrow", time: "Today at 1:36 PM" },
    { id: "d5", author: "Alex Chen", avatar: "A", color: "from-cyan-400 to-blue-500", content: "Sounds good, let me know!", time: "Today at 1:38 PM", reactions: [{ emoji: "👍", count: 1 }] },
  ],
  "2": [
    { id: "d6", author: "Maya Patel", avatar: "M", color: "from-pink-400 to-rose-500", content: "I just finished the new component library docs", time: "Today at 11:00 AM" },
    { id: "d7", author: "You", avatar: "Y", color: "from-primary to-accent", content: "Amazing work! The examples are really clear", time: "Today at 11:15 AM" },
    { id: "d8", author: "Maya Patel", avatar: "M", color: "from-pink-400 to-rose-500", content: "The new design looks great 🎨", time: "Today at 11:20 AM", reactions: [{ emoji: "✨", count: 2 }] },
  ],
  "3": [
    { id: "d9", author: "Jordan Lee", avatar: "J", color: "from-amber-400 to-orange-500", content: "Can you review my PR? It's the auth refactor", time: "Today at 10:00 AM" },
    { id: "d10", author: "You", avatar: "Y", color: "from-primary to-accent", content: "Sure, I'll take a look this afternoon", time: "Today at 10:05 AM" },
  ],
};

const contactNames: Record<string, { name: string; avatar: string; color: string; status: string }> = {
  "1": { name: "Alex Chen", avatar: "A", color: "from-cyan-400 to-blue-500", status: "online" },
  "2": { name: "Maya Patel", avatar: "M", color: "from-pink-400 to-rose-500", status: "online" },
  "3": { name: "Jordan Lee", avatar: "J", color: "from-amber-400 to-orange-500", status: "idle" },
  "4": { name: "Sam Wright", avatar: "S", color: "from-emerald-400 to-green-500", status: "dnd" },
  "5": { name: "Riley Quinn", avatar: "R", color: "from-violet-400 to-purple-500", status: "offline" },
  "6": { name: "Taylor Kim", avatar: "T", color: "from-teal-400 to-cyan-500", status: "offline" },
};

const statusColors: Record<string, string> = {
  online: "bg-online",
  idle: "bg-idle",
  dnd: "bg-dnd",
  offline: "bg-muted-foreground/50",
};

interface DMChatAreaProps {
  conversationId: string;
  onOpenProfile: (name: string) => void;
}

const DMChatArea = ({ conversationId, onOpenProfile }: DMChatAreaProps) => {
  const [message, setMessage] = useState("");
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const contact = contactNames[conversationId];
  const messages = dmMessages[conversationId] || [];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversationId]);

  // Simulate typing from DM contact
  useEffect(() => {
    if (!contact) return;
    const interval = setInterval(() => {
      if (Math.random() > 0.6) {
        setTypingUsers([contact.name]);
        setTimeout(() => setTypingUsers([]), 2000 + Math.random() * 2000);
      }
    }, 7000);
    return () => clearInterval(interval);
  }, [contact]);

  if (!contact) return null;

  return (
    <div className="flex flex-col flex-1 min-w-0">
      {/* Header */}
      <div className="h-12 px-4 flex items-center gap-2 border-b border-border shrink-0">
        <button onClick={() => onOpenProfile(contact.name)} className="relative">
          <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${contact.color} flex items-center justify-center text-xs font-bold`} style={{ color: "white" }}>
            {contact.avatar}
          </div>
          <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-background ${statusColors[contact.status]}`} />
        </button>
        <button onClick={() => onOpenProfile(contact.name)} className="font-semibold text-foreground hover:underline text-sm">
          {contact.name}
        </button>
        <div className="ml-auto flex items-center gap-1">
          {[Phone, Video, Pin, Search].map((Icon, i) => (
            <button key={i} className="p-1.5 rounded-md text-muted-foreground hover:text-foreground transition-colors">
              <Icon size={18} />
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto scrollbar-thin px-4 py-4">
        {/* DM Welcome */}
        <div className="mb-6 pb-6 border-b border-border">
          <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${contact.color} flex items-center justify-center text-2xl font-bold mb-3`} style={{ color: "white" }}>
            {contact.avatar}
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-1">{contact.name}</h2>
          <p className="text-muted-foreground text-sm">
            This is the beginning of your direct message history with <strong className="text-foreground">{contact.name}</strong>.
          </p>
        </div>

        {messages.map((msg, i) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            isGrouped={i > 0 && messages[i - 1].author === msg.author}
            onAvatarClick={() => onOpenProfile(msg.author === "You" ? "You" : contact.name)}
          />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 pb-4">
        <AnimatePresence>
          <TypingIndicator users={typingUsers} />
        </AnimatePresence>
        <div className="flex items-center gap-2 bg-muted rounded-xl px-4 py-1">
          <button className="text-muted-foreground hover:text-foreground transition-colors">
            <PlusCircle size={20} />
          </button>
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={`Message @${contact.name}`}
            className="flex-1 bg-transparent py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
          <div className="flex items-center gap-1">
            <button className="p-1 text-muted-foreground hover:text-foreground transition-colors">
              <ImagePlus size={18} />
            </button>
            <button className="p-1 text-muted-foreground hover:text-foreground transition-colors">
              <SmilePlus size={18} />
            </button>
            {message && (
              <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} className="p-1.5 bg-primary text-primary-foreground rounded-lg ml-1">
                <Send size={16} />
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DMChatArea;
