import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic,
  MicOff,
  Headphones,
  HeadphoneOff,
  MonitorUp,
  PhoneOff,
  Volume2,
  Signal,
  Video,
} from "lucide-react";

const voiceUsers = [
  { id: "1", name: "Alex Chen", avatar: "A", color: "from-cyan-400 to-blue-500", muted: false, deafened: false, speaking: true, streaming: false },
  { id: "2", name: "Maya Patel", avatar: "M", color: "from-pink-400 to-rose-500", muted: true, deafened: false, speaking: false, streaming: false },
  { id: "3", name: "Sam Wright", avatar: "S", color: "from-emerald-400 to-green-500", muted: false, deafened: false, speaking: false, streaming: true },
];

interface VoiceChannelPanelProps {
  channelName: string;
  onDisconnect: () => void;
}

const VoiceChannelPanel = ({ channelName, onDisconnect }: VoiceChannelPanelProps) => {
  const [muted, setMuted] = useState(false);
  const [deafened, setDeafened] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [videoOn, setVideoOn] = useState(false);

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="border-t border-border bg-card overflow-hidden"
    >
      {/* Connection info */}
      <div className="px-3 pt-3 pb-2">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center gap-1.5">
            <Signal size={14} className="text-online" />
            <span className="text-xs font-semibold text-online">Voice Connected</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Volume2 size={12} />
          <span className="text-xs truncate">{channelName}</span>
        </div>
      </div>

      {/* Connected users */}
      <div className="px-3 pb-2 space-y-0.5">
        {voiceUsers.map((user) => (
          <div
            key={user.id}
            className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-muted/30 transition-colors group"
          >
            <div className="relative">
              <div
                className={`w-6 h-6 rounded-full bg-gradient-to-br ${user.color} flex items-center justify-center text-[10px] font-bold ring-2 transition-all ${
                  user.speaking ? "ring-online" : "ring-transparent"
                }`}
                style={{ color: "white" }}
              >
                {user.avatar}
              </div>
              {user.speaking && (
                <motion.div
                  className="absolute inset-0 rounded-full ring-2 ring-online"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0, 0.6] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
            </div>
            <span className="text-xs text-foreground truncate flex-1">{user.name}</span>
            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
              {user.muted && <MicOff size={12} className="text-destructive" />}
              {user.deafened && <HeadphoneOff size={12} className="text-destructive" />}
              {user.streaming && <MonitorUp size={12} className="text-accent" />}
            </div>
          </div>
        ))}

        {/* You */}
        <div className="flex items-center gap-2 px-2 py-1 rounded-md bg-muted/20">
          <div className="relative">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-[10px] font-bold text-primary-foreground ring-2 ring-transparent">
              Y
            </div>
          </div>
          <span className="text-xs text-foreground truncate flex-1">You</span>
          <div className="flex items-center gap-0.5">
            {muted && <MicOff size={12} className="text-destructive" />}
            {deafened && <HeadphoneOff size={12} className="text-destructive" />}
            {streaming && <MonitorUp size={12} className="text-accent" />}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="px-3 pb-3 flex items-center justify-center gap-1">
        <button
          onClick={() => { setMuted(!muted); if (deafened) setDeafened(false); }}
          className={`p-2 rounded-lg transition-all ${
            muted
              ? "bg-destructive/20 text-destructive hover:bg-destructive/30"
              : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
          }`}
          title={muted ? "Unmute" : "Mute"}
        >
          {muted ? <MicOff size={16} /> : <Mic size={16} />}
        </button>

        <button
          onClick={() => { setDeafened(!deafened); if (!deafened) setMuted(true); }}
          className={`p-2 rounded-lg transition-all ${
            deafened
              ? "bg-destructive/20 text-destructive hover:bg-destructive/30"
              : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
          }`}
          title={deafened ? "Undeafen" : "Deafen"}
        >
          {deafened ? <HeadphoneOff size={16} /> : <Headphones size={16} />}
        </button>

        <button
          onClick={() => setVideoOn(!videoOn)}
          className={`p-2 rounded-lg transition-all ${
            videoOn
              ? "bg-primary/20 text-primary hover:bg-primary/30"
              : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
          }`}
          title="Toggle Camera"
        >
          <Video size={16} />
        </button>

        <button
          onClick={() => setStreaming(!streaming)}
          className={`p-2 rounded-lg transition-all ${
            streaming
              ? "bg-accent/20 text-accent hover:bg-accent/30"
              : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
          }`}
          title="Share Screen"
        >
          <MonitorUp size={16} />
        </button>

        <button
          onClick={onDisconnect}
          className="p-2 rounded-lg bg-destructive/20 text-destructive hover:bg-destructive/30 transition-all"
          title="Disconnect"
        >
          <PhoneOff size={16} />
        </button>
      </div>
    </motion.div>
  );
};

export default VoiceChannelPanel;
