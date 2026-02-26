import { motion, AnimatePresence } from "framer-motion";
import { X, MessageSquare, UserPlus, MoreHorizontal, Shield, Calendar, Clock, Gamepad2 } from "lucide-react";

interface ProfilePanelProps {
  name: string | null;
  onClose: () => void;
}

const profileData: Record<string, {
  avatar: string;
  color: string;
  banner: string;
  bio: string;
  joined: string;
  role: string;
  badges: string[];
  activity?: string;
}> = {
  "Alex Chen": {
    avatar: "A",
    color: "from-cyan-400 to-blue-500",
    banner: "from-cyan-600 via-blue-700 to-indigo-800",
    bio: "Building the future of communication ✨ Full-stack dev & design enthusiast",
    joined: "Jan 2024",
    role: "Admin",
    badges: ["🛡️ Server Admin", "🚀 Early Adopter", "⚡ Nitro"],
    activity: "Working on Vortex v2.0",
  },
  "Maya Patel": {
    avatar: "M",
    color: "from-pink-400 to-rose-500",
    banner: "from-pink-600 via-rose-700 to-red-800",
    bio: "UX Designer @ Vortex | Making pixels perfect 🎨",
    joined: "Mar 2024",
    role: "Moderator",
    badges: ["🎨 Designer", "⭐ Active Member"],
    activity: "In a meeting",
  },
  "Jordan Lee": {
    avatar: "J",
    color: "from-amber-400 to-orange-500",
    banner: "from-amber-600 via-orange-700 to-red-800",
    bio: "Game dev | Always curious 🎮",
    joined: "Jun 2024",
    role: "Member",
    badges: ["🎮 Gamer", "💬 Chatterbox"],
  },
};

const defaultProfile = {
  avatar: "?",
  color: "from-slate-400 to-slate-600",
  banner: "from-slate-600 via-slate-700 to-slate-800",
  bio: "Vortex member",
  joined: "2024",
  role: "Member",
  badges: [] as string[],
  activity: undefined as string | undefined,
};

const ProfilePanel = ({ name, onClose }: ProfilePanelProps) => {
  if (!name) return null;

  const profile = profileData[name] || { ...defaultProfile, avatar: name[0] };

  return (
    <AnimatePresence>
      {name && (
        <motion.div
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 300, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="w-[340px] shrink-0 border-l border-border bg-background flex flex-col overflow-hidden"
        >
          {/* Banner */}
          <div className={`h-28 bg-gradient-to-br ${profile.banner} relative`}>
            <button
              onClick={onClose}
              className="absolute top-2 right-2 p-1.5 rounded-full bg-background/80 hover:bg-background transition-colors shadow-sm"
            >
              <X size={14} className="text-foreground" />
            </button>
          </div>

          {/* Avatar */}
          <div className="px-4 -mt-10 relative">
            <div
              className={`w-20 h-20 rounded-full bg-gradient-to-br ${profile.color} flex items-center justify-center text-2xl font-bold border-4 border-card`}
              style={{ color: "white" }}
            >
              {profile.avatar}
            </div>
          </div>

          {/* Info */}
          <div className="px-4 pt-2 pb-4 flex-1 overflow-y-auto scrollbar-thin">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-xl font-bold text-foreground">{name}</h3>
              {profile.role === "Admin" && <Shield size={16} className="text-primary" />}
            </div>
            <p className="text-sm text-muted-foreground mb-3">@{name.toLowerCase().replace(" ", ".")}</p>

            {/* Action buttons */}
            <div className="flex gap-2 mb-4">
              <button className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
                <MessageSquare size={14} />
                Message
              </button>
              <button className="px-3 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-muted transition-colors">
                <UserPlus size={16} />
              </button>
              <button className="px-3 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-muted transition-colors">
                <MoreHorizontal size={16} />
              </button>
            </div>

            {/* Sections */}
            <div className="space-y-3">
              {/* Bio */}
              <div className="bg-secondary rounded-xl p-3">
                <h4 className="text-[11px] font-semibold tracking-wider text-muted-foreground mb-1.5">ABOUT ME</h4>
                <p className="text-sm text-foreground leading-relaxed">{profile.bio}</p>
              </div>

              {/* Activity */}
              {profile.activity && (
                <div className="bg-secondary rounded-xl p-3">
                  <h4 className="text-[11px] font-semibold tracking-wider text-muted-foreground mb-1.5">ACTIVITY</h4>
                  <div className="flex items-center gap-2">
                    <Gamepad2 size={14} className="text-primary" />
                    <p className="text-sm text-foreground">{profile.activity}</p>
                  </div>
                </div>
              )}

              {/* Badges */}
              {profile.badges.length > 0 && (
                <div className="bg-secondary rounded-xl p-3">
                  <h4 className="text-[11px] font-semibold tracking-wider text-muted-foreground mb-2">BADGES</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {profile.badges.map((badge) => (
                      <span
                        key={badge}
                        className="text-xs bg-secondary/80 text-secondary-foreground px-2.5 py-1 rounded-full"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Member since */}
              <div className="bg-secondary rounded-xl p-3">
                <h4 className="text-[11px] font-semibold tracking-wider text-muted-foreground mb-1.5">MEMBER SINCE</h4>
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-muted-foreground" />
                  <p className="text-sm text-foreground">{profile.joined}</p>
                </div>
              </div>

              {/* Roles */}
              <div className="bg-secondary rounded-xl p-3">
                <h4 className="text-[11px] font-semibold tracking-wider text-muted-foreground mb-2">ROLES</h4>
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-xs flex items-center gap-1 bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    {profile.role}
                  </span>
                  <span className="text-xs flex items-center gap-1 bg-secondary text-secondary-foreground px-2.5 py-1 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-muted-foreground" />
                    @everyone
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProfilePanel;
