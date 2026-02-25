import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Hash, Bell, Pin, Users, Search, SmilePlus, PlusCircle, Gift, ImagePlus, Send } from "lucide-react";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";

const mockMessages = [
  {
    id: "1",
    author: "Alex Chen",
    avatar: "A",
    color: "from-cyan-400 to-blue-500",
    content: "Hey everyone! Just shipped the new design system 🎨",
    time: "Today at 2:14 PM",
    reactions: [{ emoji: "🔥", count: 5 }, { emoji: "🎉", count: 3 }],
  },
  {
    id: "2",
    author: "Maya Patel",
    avatar: "M",
    color: "from-pink-400 to-rose-500",
    content: "This looks incredible! The glassmorphism effects are *chefs kiss*",
    time: "Today at 2:16 PM",
    reactions: [{ emoji: "💯", count: 2 }],
  },
  {
    id: "3",
    author: "Jordan Lee",
    avatar: "J",
    color: "from-amber-400 to-orange-500",
    content: "Can we get a preview of the new voice channels? I heard they're spatial now",
    time: "Today at 2:18 PM",
  },
  {
    id: "4",
    author: "Alex Chen",
    avatar: "A",
    color: "from-cyan-400 to-blue-500",
    content: "Yes! Spatial audio is live in the beta branch. Try joining the Lounge channel — it uses proximity-based audio positioning.",
    time: "Today at 2:20 PM",
    reactions: [{ emoji: "👀", count: 8 }],
  },
  {
    id: "5",
    author: "Sam Wright",
    avatar: "S",
    color: "from-emerald-400 to-green-500",
    content: "Just tested it — feels like you're actually in a room with people. The future is here 🚀",
    time: "Today at 2:23 PM",
    reactions: [{ emoji: "🚀", count: 4 }, { emoji: "❤️", count: 2 }],
  },
  {
    id: "6",
    author: "Riley Quinn",
    avatar: "R",
    color: "from-violet-400 to-purple-500",
    content: "Anyone want to jam in the music channel later? Got some new synth patches to try out",
    time: "Today at 2:25 PM",
  },
  {
    id: "7",
    author: "Maya Patel",
    avatar: "M",
    color: "from-pink-400 to-rose-500",
    content: "Count me in! Also, has anyone seen the new thread view? It's way cleaner now",
    time: "Today at 2:28 PM",
    reactions: [{ emoji: "✨", count: 3 }],
  },
];

interface ChatAreaProps {
  channel: string;
  onToggleMembers: () => void;
  showMembers: boolean;
  onOpenProfile: (name: string) => void;
}

const ChatArea = ({ channel, onToggleMembers, showMembers, onOpenProfile }: ChatAreaProps) => {
  const [message, setMessage] = useState("");
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Simulate random typing indicators
  useEffect(() => {
    const names = ["Maya Patel", "Jordan Lee", "Sam Wright", "Riley Quinn"];
    const interval = setInterval(() => {
      const shouldType = Math.random() > 0.5;
      if (shouldType) {
        const count = Math.random() > 0.7 ? 2 : 1;
        const shuffled = [...names].sort(() => Math.random() - 0.5);
        setTypingUsers(shuffled.slice(0, count));
        setTimeout(() => setTypingUsers([]), 3000 + Math.random() * 2000);
      }
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col flex-1 min-w-0">
      {/* Header */}
      <div className="h-12 px-4 flex items-center gap-2 border-b border-border shrink-0">
        <Hash size={20} className="text-muted-foreground" />
        <h3 className="font-semibold text-foreground">{channel}</h3>
        <div className="w-[1px] h-5 bg-border mx-2" />
        <span className="text-sm text-muted-foreground truncate">Welcome to the conversation</span>
        <div className="ml-auto flex items-center gap-1">
          {[Bell, Pin, Users, Search].map((Icon, i) => (
            <button
              key={i}
              onClick={i === 2 ? onToggleMembers : undefined}
              className={`p-1.5 rounded-md transition-colors ${
                i === 2 && showMembers
                  ? "text-foreground bg-muted"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon size={18} />
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto scrollbar-thin px-4 py-4">
        {/* Welcome banner */}
        <div className="mb-6 pb-6 border-b border-border">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-2xl mb-3">
            <Hash size={28} className="text-primary-foreground" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-1">Welcome to #{channel}</h2>
          <p className="text-muted-foreground text-sm">
            This is the start of the #{channel} channel. Say hello! 👋
          </p>
        </div>

        {mockMessages.map((msg, i) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            isGrouped={i > 0 && mockMessages[i - 1].author === msg.author}
            onAvatarClick={() => onOpenProfile(msg.author)}
          />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Typing Indicator + Input */}
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
            placeholder={`Message #${channel}`}
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
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="p-1.5 bg-primary text-primary-foreground rounded-lg ml-1"
              >
                <Send size={16} />
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;
