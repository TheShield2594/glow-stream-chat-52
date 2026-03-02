import { motion } from "framer-motion";
import { X, Sun, Moon, Monitor, Check } from "lucide-react";
import { useTheme, accentColors, fontOptions, type ThemeMode, type AccentColor, type FontOption } from "@/hooks/useTheme";

interface ThemePanelProps {
  onClose: () => void;
}

const modeOptions: { id: ThemeMode; label: string; icon: typeof Sun }[] = [
  { id: "light", label: "Light", icon: Sun },
  { id: "dark", label: "Dark", icon: Moon },
  { id: "system", label: "System", icon: Monitor },
];

const ThemePanel = ({ onClose }: ThemePanelProps) => {
  const { mode, accent, font, setMode, setAccent, setFont } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="bg-card border border-border rounded-2xl shadow-xl w-[420px] max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Appearance</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-6">
          {/* Mode */}
          <section>
            <h3 className="text-xs font-semibold tracking-wider text-muted-foreground mb-3">THEME</h3>
            <div className="flex gap-2">
              {modeOptions.map((opt) => {
                const active = mode === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setMode(opt.id)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      active
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-secondary text-secondary-foreground hover:bg-muted"
                    }`}
                  >
                    <opt.icon size={16} />
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Accent Color */}
          <section>
            <h3 className="text-xs font-semibold tracking-wider text-muted-foreground mb-3">ACCENT COLOR</h3>
            <div className="grid grid-cols-4 gap-2">
              {accentColors.map((c) => {
                const active = accent.name === c.name;
                return (
                  <button
                    key={c.name}
                    onClick={() => setAccent(c)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium transition-all border ${
                      active
                        ? "border-foreground/20 bg-muted shadow-sm"
                        : "border-transparent hover:bg-muted/50"
                    }`}
                  >
                    <span
                      className="w-4 h-4 rounded-full shrink-0 flex items-center justify-center"
                      style={{ background: `hsl(${c.hue} ${c.saturation}% ${c.lightness}%)` }}
                    >
                      {active && <Check size={10} className="text-white" />}
                    </span>
                    <span className="text-foreground truncate">{c.name}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Font */}
          <section>
            <h3 className="text-xs font-semibold tracking-wider text-muted-foreground mb-3">FONT</h3>
            <div className="space-y-1.5">
              {fontOptions.map((f) => {
                const active = font === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => setFont(f.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all ${
                      active
                        ? "bg-muted text-foreground font-medium"
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    }`}
                  >
                    <span style={{ fontFamily: f.family }}>{f.label}</span>
                    {active && <Check size={14} className="text-primary" />}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Preview */}
          <section>
            <h3 className="text-xs font-semibold tracking-wider text-muted-foreground mb-3">PREVIEW</h3>
            <div className="rounded-xl border border-border bg-background p-4 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
                  A
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Alex Chen</p>
                  <p className="text-xs text-muted-foreground">This is how messages will look</p>
                </div>
              </div>
              <div className="flex gap-1.5 ml-10">
                <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-md text-xs">🔥 5</span>
                <span className="px-2 py-0.5 bg-muted text-muted-foreground rounded-md text-xs">✨ 3</span>
              </div>
            </div>
          </section>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ThemePanel;
