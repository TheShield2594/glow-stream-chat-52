import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Compass, MessageCircle } from "lucide-react";

const servers = [
  { id: "home", name: "Home", icon: "V", color: "from-primary to-accent" },
  { id: "design", name: "Design Hub", icon: "D", color: "from-pink-500 to-rose-500" },
  { id: "dev", name: "Dev Team", icon: "⚡", color: "from-amber-500 to-orange-500" },
  { id: "gaming", name: "Gaming", icon: "🎮", color: "from-emerald-500 to-green-500" },
  { id: "music", name: "Music", icon: "♫", color: "from-violet-500 to-purple-500" },
];

interface ServerSidebarProps {
  activeServer: string;
  onServerChange: (id: string) => void;
}

const ServerSidebar = ({ activeServer, onServerChange }: ServerSidebarProps) => {
  return (
    <div className="flex flex-col items-center w-[72px] bg-sidebar py-3 gap-2 shrink-0">
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
        <div className="absolute left-full ml-3 px-3 py-1.5 glass rounded-md text-sm font-medium opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
          Direct Messages
        </div>
        <motion.button
          onClick={() => onServerChange("dm")}
          className={`w-12 h-12 flex items-center justify-center transition-all duration-200 ${
            activeServer === "dm"
              ? "bg-primary rounded-2xl glow-primary text-primary-foreground"
              : "bg-secondary rounded-3xl hover:rounded-2xl hover:bg-primary hover:text-primary-foreground text-muted-foreground"
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <MessageCircle size={20} />
        </motion.button>
      </div>

      <div className="w-8 h-[2px] bg-border rounded-full my-1" />

      {servers.map((server, i) => {
        const isActive = activeServer === server.id;
        return (
          <div key={server.id} className="relative group">
            {/* Active indicator */}
            <motion.div
              className="absolute -left-1 top-1/2 w-1 bg-primary rounded-r-full"
              initial={false}
              animate={{
                height: isActive ? 32 : 0,
                y: isActive ? -16 : 0,
                opacity: isActive ? 1 : 0,
              }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />

            {/* Hover tooltip */}
            <div className="absolute left-full ml-3 px-3 py-1.5 glass rounded-md text-sm font-medium opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
              {server.name}
            </div>

            <motion.button
              onClick={() => onServerChange(server.id)}
              className={`w-12 h-12 flex items-center justify-center text-lg font-semibold transition-all duration-200 ${
                isActive
                  ? `bg-gradient-to-br ${server.color} rounded-2xl glow-primary`
                  : "bg-secondary rounded-3xl hover:rounded-2xl hover:bg-muted"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {server.icon}
            </motion.button>
          </div>
        );
      })}

      <div className="w-8 h-[2px] bg-border rounded-full my-1" />

      <motion.button
        className="w-12 h-12 flex items-center justify-center rounded-3xl bg-secondary hover:rounded-2xl hover:bg-primary hover:text-primary-foreground transition-all duration-200 text-primary"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Plus size={20} />
      </motion.button>

      <motion.button
        className="w-12 h-12 flex items-center justify-center rounded-3xl bg-secondary hover:rounded-2xl hover:bg-success/20 hover:text-success transition-all duration-200 text-muted-foreground"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Compass size={20} />
      </motion.button>
    </div>
  );
};

export default ServerSidebar;
