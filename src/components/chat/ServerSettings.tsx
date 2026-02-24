import { useState } from "react";
import { motion } from "framer-motion";
import {
  X, Settings, Shield, Palette, Users, Hash, Bell, Ban, Link,
  ChevronRight, Plus, Trash2, Edit2, Crown, Eye, MessageSquare,
  Mic, Upload, Check
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

type SettingsTab = "overview" | "roles" | "permissions" | "customization";

const tabs: { id: SettingsTab; label: string; icon: React.ElementType }[] = [
  { id: "overview", label: "Overview", icon: Settings },
  { id: "roles", label: "Roles", icon: Shield },
  { id: "permissions", label: "Permissions", icon: Users },
  { id: "customization", label: "Customization", icon: Palette },
];

const mockRoles = [
  { id: "admin", name: "Admin", color: "from-primary to-accent", members: 2, permissions: ["all"] },
  { id: "moderator", name: "Moderator", color: "from-amber-400 to-orange-500", members: 4, permissions: ["kick", "ban", "mute", "manage_messages"] },
  { id: "contributor", name: "Contributor", color: "from-emerald-400 to-green-500", members: 12, permissions: ["send_messages", "embed_links", "attach_files"] },
  { id: "member", name: "Member", color: "from-slate-400 to-slate-500", members: 48, permissions: ["send_messages", "read_messages"] },
];

const permissionCategories = [
  {
    name: "General",
    icon: Settings,
    permissions: [
      { id: "view_channels", label: "View Channels", desc: "Allows members to view channels", enabled: true },
      { id: "manage_channels", label: "Manage Channels", desc: "Create, edit, or delete channels", enabled: false },
      { id: "manage_server", label: "Manage Server", desc: "Edit server name, icon, and settings", enabled: false },
    ],
  },
  {
    name: "Messaging",
    icon: MessageSquare,
    permissions: [
      { id: "send_messages", label: "Send Messages", desc: "Send messages in text channels", enabled: true },
      { id: "embed_links", label: "Embed Links", desc: "Links will show a preview", enabled: true },
      { id: "attach_files", label: "Attach Files", desc: "Upload images and files", enabled: true },
      { id: "manage_messages", label: "Manage Messages", desc: "Delete or pin others' messages", enabled: false },
    ],
  },
  {
    name: "Voice",
    icon: Mic,
    permissions: [
      { id: "connect", label: "Connect", desc: "Join voice channels", enabled: true },
      { id: "speak", label: "Speak", desc: "Talk in voice channels", enabled: true },
      { id: "mute_members", label: "Mute Members", desc: "Mute others in voice channels", enabled: false },
    ],
  },
  {
    name: "Moderation",
    icon: Shield,
    permissions: [
      { id: "kick_members", label: "Kick Members", desc: "Remove members from the server", enabled: false },
      { id: "ban_members", label: "Ban Members", desc: "Permanently ban members", enabled: false },
      { id: "manage_roles", label: "Manage Roles", desc: "Create and edit roles", enabled: false },
    ],
  },
];

interface ServerSettingsProps {
  onClose: () => void;
}

const ServerSettings = ({ onClose }: ServerSettingsProps) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>("overview");
  const [selectedRole, setSelectedRole] = useState("admin");
  const [serverName, setServerName] = useState("Vortex HQ");
  const [permissions, setPermissions] = useState(
    permissionCategories.map((cat) => ({
      ...cat,
      permissions: cat.permissions.map((p) => ({ ...p })),
    }))
  );

  const togglePermission = (catIdx: number, permIdx: number) => {
    setPermissions((prev) => {
      const next = prev.map((cat, ci) => ({
        ...cat,
        permissions: cat.permissions.map((p, pi) =>
          ci === catIdx && pi === permIdx ? { ...p, enabled: !p.enabled } : p
        ),
      }));
      return next;
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex bg-background/80 backdrop-blur-sm"
    >
      <div className="flex w-full">
        {/* Left nav */}
        <div className="w-56 bg-card border-r border-border flex flex-col shrink-0">
          <div className="p-4 pb-2">
            <p className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
              Server Settings
            </p>
          </div>
          <nav className="flex-1 px-2 space-y-0.5">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive
                      ? "bg-muted text-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  <tab.icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
          <Separator />
          <button
            className="flex items-center gap-2.5 px-5 py-3 text-sm text-destructive hover:bg-destructive/10 transition-colors"
          >
            <Trash2 size={16} />
            Delete Server
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="max-w-2xl mx-auto py-8 px-8">
            {/* Close button */}
            <div className="flex justify-end mb-4">
              <button
                onClick={onClose}
                className="w-9 h-9 flex items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {activeTab === "overview" && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} key="overview">
                <h2 className="text-xl font-bold text-foreground mb-6">Server Overview</h2>

                {/* Server identity */}
                <div className="flex items-start gap-6 mb-8">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-3xl font-bold text-primary-foreground">
                      V
                    </div>
                    <div className="absolute inset-0 rounded-2xl bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                      <Upload size={20} className="text-foreground" />
                    </div>
                  </div>
                  <div className="flex-1 space-y-3">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Server Name</label>
                      <input
                        value={serverName}
                        onChange={(e) => setServerName(e.target.value)}
                        className="mt-1 w-full bg-muted rounded-lg px-3 py-2.5 text-sm text-foreground outline-none border border-transparent focus:border-primary/50 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Description</label>
                      <textarea
                        placeholder="Tell people what this server is about..."
                        className="mt-1 w-full bg-muted rounded-lg px-3 py-2.5 text-sm text-foreground outline-none border border-transparent focus:border-primary/50 transition-colors resize-none h-20"
                      />
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Quick stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {[
                    { label: "Members", value: "66", icon: Users },
                    { label: "Channels", value: "10", icon: Hash },
                    { label: "Roles", value: "4", icon: Shield },
                  ].map((stat) => (
                    <div key={stat.label} className="glass rounded-xl p-4 text-center">
                      <stat.icon size={20} className="mx-auto text-primary mb-2" />
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                    </div>
                  ))}
                </div>

                <Separator className="my-6" />

                {/* Settings toggles */}
                <h3 className="text-sm font-semibold text-foreground mb-4">General Settings</h3>
                <div className="space-y-4">
                  {[
                    { label: "Require 2FA for Moderation", desc: "Require two-factor auth for moderator actions", default: false },
                    { label: "Explicit Content Filter", desc: "Scan media from all members", default: true },
                    { label: "Default Notifications", desc: "Only @mentions and highlights", default: true },
                  ].map((setting) => (
                    <div key={setting.label} className="flex items-center justify-between py-2">
                      <div>
                        <p className="text-sm font-medium text-foreground">{setting.label}</p>
                        <p className="text-xs text-muted-foreground">{setting.desc}</p>
                      </div>
                      <Switch defaultChecked={setting.default} />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === "roles" && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} key="roles">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-foreground">Roles</h2>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                    <Plus size={14} />
                    Create Role
                  </button>
                </div>

                <div className="space-y-2">
                  {mockRoles.map((role) => (
                    <button
                      key={role.id}
                      onClick={() => setSelectedRole(role.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors text-left ${
                        selectedRole === role.id
                          ? "bg-muted border border-primary/20"
                          : "hover:bg-muted/50 border border-transparent"
                      }`}
                    >
                      <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${role.color}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-foreground">{role.name}</span>
                          {role.id === "admin" && <Crown size={12} className="text-primary" />}
                        </div>
                        <span className="text-xs text-muted-foreground">{role.members} members</span>
                      </div>
                      <ChevronRight size={16} className="text-muted-foreground" />
                    </button>
                  ))}
                </div>

                {/* Selected role detail */}
                <Separator className="my-6" />
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-4">
                    Role Permissions — {mockRoles.find((r) => r.id === selectedRole)?.name}
                  </h3>
                  <div className="space-y-3">
                    {["View Channels", "Send Messages", "Manage Messages", "Kick Members", "Ban Members", "Manage Roles", "Manage Server"].map(
                      (perm, i) => (
                        <div key={perm} className="flex items-center justify-between py-1">
                          <span className="text-sm text-foreground">{perm}</span>
                          <Switch defaultChecked={i < (selectedRole === "admin" ? 7 : selectedRole === "moderator" ? 4 : 2)} />
                        </div>
                      )
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "permissions" && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} key="permissions">
                <h2 className="text-xl font-bold text-foreground mb-6">Channel Permissions</h2>

                {permissions.map((cat, catIdx) => (
                  <div key={cat.name} className="mb-8">
                    <div className="flex items-center gap-2 mb-3">
                      <cat.icon size={16} className="text-primary" />
                      <h3 className="text-sm font-semibold text-foreground">{cat.name}</h3>
                    </div>
                    <div className="space-y-1">
                      {cat.permissions.map((perm, permIdx) => (
                        <div
                          key={perm.id}
                          className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-muted/30 transition-colors"
                        >
                          <div>
                            <p className="text-sm text-foreground">{perm.label}</p>
                            <p className="text-xs text-muted-foreground">{perm.desc}</p>
                          </div>
                          <Switch
                            checked={perm.enabled}
                            onCheckedChange={() => togglePermission(catIdx, permIdx)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === "customization" && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} key="customization">
                <h2 className="text-xl font-bold text-foreground mb-6">Customization</h2>

                {/* Theme colors */}
                <h3 className="text-sm font-semibold text-foreground mb-3">Accent Color</h3>
                <div className="flex gap-3 mb-8">
                  {[
                    { name: "Cyan", class: "bg-primary" },
                    { name: "Purple", class: "bg-accent" },
                    { name: "Rose", class: "bg-destructive" },
                    { name: "Emerald", class: "bg-success" },
                    { name: "Amber", class: "bg-warning" },
                  ].map((color, i) => (
                    <button
                      key={color.name}
                      className={`w-10 h-10 rounded-xl ${color.class} transition-transform hover:scale-110 flex items-center justify-center ${
                        i === 0 ? "ring-2 ring-foreground ring-offset-2 ring-offset-background" : ""
                      }`}
                    >
                      {i === 0 && <Check size={16} className="text-primary-foreground" />}
                    </button>
                  ))}
                </div>

                <Separator className="my-6" />

                {/* Banner */}
                <h3 className="text-sm font-semibold text-foreground mb-3">Server Banner</h3>
                <div className="w-full h-32 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 border border-dashed border-border flex items-center justify-center cursor-pointer hover:border-primary/40 transition-colors mb-8">
                  <div className="text-center">
                    <Upload size={24} className="mx-auto text-muted-foreground mb-1" />
                    <p className="text-xs text-muted-foreground">Upload a banner image</p>
                    <p className="text-[10px] text-muted-foreground/60">Recommended: 960×540</p>
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Invite link */}
                <h3 className="text-sm font-semibold text-foreground mb-3">Invite Link</h3>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-muted rounded-lg px-3 py-2.5 text-sm text-muted-foreground font-mono">
                    vortex.app/invite/xK9mPq
                  </div>
                  <button className="px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-1.5">
                    <Link size={14} />
                    Copy
                  </button>
                </div>

                <Separator className="my-6" />

                {/* Emoji */}
                <h3 className="text-sm font-semibold text-foreground mb-3">Custom Emoji</h3>
                <div className="grid grid-cols-6 gap-3">
                  {["🔥", "⚡", "🎯", "💎", "🌊", "🚀", "✨", "🎮", "🎵", "🌟", "💜", "➕"].map((emoji, i) => (
                    <div
                      key={i}
                      className={`aspect-square rounded-xl flex items-center justify-center text-xl transition-colors ${
                        i === 11
                          ? "border border-dashed border-border hover:border-primary/40 cursor-pointer text-muted-foreground text-sm"
                          : "bg-muted/50 hover:bg-muted"
                      }`}
                    >
                      {i === 11 ? <Plus size={18} /> : emoji}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ServerSettings;
