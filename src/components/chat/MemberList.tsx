import { motion } from "framer-motion";

const members = {
  online: [
    { name: "Alex Chen", avatar: "A", color: "from-cyan-400 to-blue-500", status: "Working on v2.0", role: "Admin" },
    { name: "Maya Patel", avatar: "M", color: "from-pink-400 to-rose-500", status: "In a meeting", role: "Mod" },
    { name: "Jordan Lee", avatar: "J", color: "from-amber-400 to-orange-500", role: "Member" },
    { name: "Sam Wright", avatar: "S", color: "from-emerald-400 to-green-500", status: "Streaming", role: "Member" },
    { name: "Riley Quinn", avatar: "R", color: "from-violet-400 to-purple-500", role: "Member" },
  ],
  offline: [
    { name: "Taylor Kim", avatar: "T", color: "from-slate-400 to-slate-500", role: "Member" },
    { name: "Casey Park", avatar: "C", color: "from-slate-400 to-slate-500", role: "Member" },
  ],
};

interface MemberListProps {
  onMemberClick: (name: string) => void;
}

const MemberList = ({ onMemberClick }: MemberListProps) => {
  return (
    <motion.div
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: 240, opacity: 1 }}
      exit={{ width: 0, opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="shrink-0 border-l border-border bg-card overflow-hidden"
    >
      <div className="w-60 p-3 overflow-y-auto scrollbar-thin h-full">
        <h4 className="text-[11px] font-semibold tracking-wider text-muted-foreground px-2 mb-2">
          ONLINE — {members.online.length}
        </h4>
        {members.online.map((m) => (
          <button
            key={m.name}
            onClick={() => onMemberClick(m.name)}
            className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-muted/50 transition-colors group"
          >
            <div className="relative">
              <div
                className={`w-8 h-8 rounded-full bg-gradient-to-br ${m.color} flex items-center justify-center text-xs font-bold shrink-0`}
                style={{ color: "white" }}
              >
                {m.avatar}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-online rounded-full border-2 border-card" />
            </div>
            <div className="min-w-0 text-left">
              <p className="text-sm text-foreground truncate flex items-center gap-1.5">
                {m.name}
                {m.role === "Admin" && (
                  <span className="text-[9px] bg-primary/20 text-primary px-1.5 py-0.5 rounded font-medium">
                    ADMIN
                  </span>
                )}
                {m.role === "Mod" && (
                  <span className="text-[9px] bg-accent/20 text-accent px-1.5 py-0.5 rounded font-medium">
                    MOD
                  </span>
                )}
              </p>
              {m.status && (
                <p className="text-[11px] text-muted-foreground truncate">{m.status}</p>
              )}
            </div>
          </button>
        ))}

        <h4 className="text-[11px] font-semibold tracking-wider text-muted-foreground px-2 mb-2 mt-4">
          OFFLINE — {members.offline.length}
        </h4>
        {members.offline.map((m) => (
          <button
            key={m.name}
            onClick={() => onMemberClick(m.name)}
            className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-muted/50 transition-colors opacity-50"
          >
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground shrink-0">
              {m.avatar}
            </div>
            <p className="text-sm text-muted-foreground truncate">{m.name}</p>
          </button>
        ))}
      </div>
    </motion.div>
  );
};

export default MemberList;
