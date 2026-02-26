import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Compass, MessageCircle } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";

const servers = [
  { id: "home", name: "Home", icon: "V", color: "bg-primary" },
  { id: "design", name: "Design Hub", icon: "D", color: "bg-rose-500" },
  { id: "dev", name: "Dev Team", icon: "⚡", color: "bg-amber-500" },
  { id: "gaming", name: "Gaming", icon: "🎮", color: "bg-emerald-500" },
  { id: "music", name: "Music", icon: "♫", color: "bg-violet-500" },
];

interface ServerSidebarProps {
  activeServer: string;
  onServerChange: (id: string) => void;
}

const ServerSidebar = ({ activeServer, onServerChange }: ServerSidebarProps) => {
  const { getTotalUnreads } = useNotifications();
  const dmUnreads = getTotalUnreads("dm");

  return (
    <div className="flex flex-col items-center w-[72px] bg-sidebar border-r border-border py-3 gap-2 shrink-0">
      {/* DM Button */}
      <div className="relative group">
        <motion.div
          className="absolute -left-1 top-1/2 w-1 bg-primary rounded-r-full"
          initial={false}
          animate={{
            height: activeServer === "dm" ? 32 : 0,
            y: activeServer === "dm" ? -16 : 0,
            opacity: activeServer === "dm" ? 1 : 0,
          }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
        <div className="absolute left-full ml-3 px-3 py-1.5 bg-foreground text-background rounded-md text-xs font-medium opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-sm">
          Direct Messages
        </div>
        <motion.button
          onClick={() => onServerChange("dm")}
          className={`w-11 h-11 flex items-center justify-center transition-all duration-200 ${
            activeServer === "dm"
              ? "bg-primary rounded-xl text-primary-foreground shadow-sm"
              : "bg-card rounded-xl hover:bg-primary/10 text-muted-foreground border border-border"
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <MessageCircle size={20} />
        </motion.button>
        {/* DM badge */}
        {dmUnreads.count > 0 && activeServer !== "dm" && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -bottom-1 -right-1 bg-destructive text-destructive-foreground text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full px-1 border-2 border-sidebar"
          >
            {dmUnreads.count > 99 ? "99+" : dmUnreads.count}
          </motion.span>
        )}
      </div>

      <div className="w-8 h-[2px] bg-border rounded-full my-1" />

      {servers.map((server) => {
        const isActive = activeServer === server.id;
        const serverUnreads = getTotalUnreads(server.id);
        return (
          <div key={server.id} className="relative group">
            {/* Active indicator */}
            <motion.div
              className="absolute -left-1 top-1/2 w-1 bg-primary rounded-r-full"
              initial={false}
              animate={{
                height: isActive ? 32 : serverUnreads.count > 0 ? 8 : 0,
                y: isActive ? -16 : serverUnreads.count > 0 ? -4 : 0,
                opacity: isActive || serverUnreads.count > 0 ? 1 : 0,
              }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />

            {/* Hover tooltip */}
            <div className="absolute left-full ml-3 px-3 py-1.5 bg-foreground text-background rounded-md text-xs font-medium opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-sm">
              {server.name}
            </div>

            <motion.button
              onClick={() => onServerChange(server.id)}
              className={`w-11 h-11 flex items-center justify-center text-lg font-semibold transition-all duration-200 ${
                isActive
                  ? `${server.color} rounded-xl text-white shadow-sm`
                  : "bg-card rounded-xl border border-border hover:border-muted-foreground/30"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {server.icon}
            </motion.button>

            {/* Server badge */}
            {serverUnreads.mentions > 0 && !isActive && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -bottom-1 -right-1 bg-destructive text-destructive-foreground text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full px-1 border-2 border-sidebar"
              >
                {serverUnreads.mentions}
              </motion.span>
            )}
            {/* Unread dot (no mentions) */}
            {serverUnreads.count > 0 && serverUnreads.mentions === 0 && !isActive && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-foreground rounded-full border-2 border-sidebar"
              />
            )}
          </div>
        );
      })}

      <div className="w-8 h-[2px] bg-border rounded-full my-1" />

      <motion.button
        className="w-11 h-11 flex items-center justify-center rounded-xl bg-card border border-dashed border-border hover:border-primary hover:text-primary transition-all duration-200 text-muted-foreground"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Plus size={18} />
      </motion.button>

      <motion.button
        className="w-11 h-11 flex items-center justify-center rounded-xl bg-card border border-border hover:border-muted-foreground/30 transition-all duration-200 text-muted-foreground"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Compass size={20} />
      </motion.button>
    </div>
  );
};

export default ServerSidebar;
