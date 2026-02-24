import { motion } from "framer-motion";

interface Reaction {
  emoji: string;
  count: number;
}

interface Message {
  id: string;
  author: string;
  avatar: string;
  color: string;
  content: string;
  time: string;
  reactions?: Reaction[];
}

interface MessageBubbleProps {
  message: Message;
  isGrouped: boolean;
  onAvatarClick: () => void;
}

const MessageBubble = ({ message, isGrouped, onAvatarClick }: MessageBubbleProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15 }}
      className={`group flex gap-3 px-2 py-0.5 -mx-2 rounded-lg hover:bg-muted/30 transition-colors ${
        isGrouped ? "mt-0" : "mt-4"
      }`}
    >
      {isGrouped ? (
        <div className="w-10 shrink-0 flex items-start justify-center">
          <span className="text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity pt-1">
            {message.time.split(" at ")[1]}
          </span>
        </div>
      ) : (
        <button
          onClick={onAvatarClick}
          className={`w-10 h-10 rounded-full bg-gradient-to-br ${message.color} flex items-center justify-center text-sm font-bold shrink-0 hover:opacity-80 transition-opacity mt-0.5`}
          style={{ color: "white" }}
        >
          {message.avatar}
        </button>
      )}

      <div className="flex-1 min-w-0">
        {!isGrouped && (
          <div className="flex items-baseline gap-2">
            <button
              onClick={onAvatarClick}
              className="text-sm font-semibold text-foreground hover:underline"
            >
              {message.author}
            </button>
            <span className="text-[11px] text-muted-foreground">{message.time}</span>
          </div>
        )}
        <p className="text-sm text-foreground/90 leading-relaxed">{message.content}</p>

        {message.reactions && message.reactions.length > 0 && (
          <div className="flex gap-1 mt-1.5">
            {message.reactions.map((r, i) => (
              <button
                key={i}
                className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary border border-border hover:border-primary/50 transition-colors text-xs"
              >
                <span>{r.emoji}</span>
                <span className="text-muted-foreground">{r.count}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MessageBubble;
