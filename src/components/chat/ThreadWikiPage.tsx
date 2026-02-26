import { useState, useCallback, KeyboardEvent } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Plus,
  GripVertical,
  Type,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  CheckSquare,
  Minus,
  Quote,
  Code,
  MoreHorizontal,
  Trash2,
  ChevronUp,
  ChevronDown,
  MessageSquare,
} from "lucide-react";

type BlockType =
  | "paragraph"
  | "heading1"
  | "heading2"
  | "heading3"
  | "bullet-list"
  | "numbered-list"
  | "todo"
  | "divider"
  | "quote"
  | "code";

interface Block {
  id: string;
  type: BlockType;
  content: string;
  checked?: boolean;
}

interface ThreadMessage {
  id: string;
  author: string;
  avatar: string;
  color: string;
  content: string;
  time: string;
}

interface ThreadWikiPageProps {
  message: ThreadMessage;
  onClose: () => void;
}

const blockTypeConfig: Record<BlockType, { icon: React.ElementType; label: string }> = {
  paragraph: { icon: Type, label: "Text" },
  "heading1": { icon: Heading1, label: "Heading 1" },
  "heading2": { icon: Heading2, label: "Heading 2" },
  "heading3": { icon: Heading3, label: "Heading 3" },
  "bullet-list": { icon: List, label: "Bullet List" },
  "numbered-list": { icon: ListOrdered, label: "Numbered List" },
  todo: { icon: CheckSquare, label: "To-do" },
  divider: { icon: Minus, label: "Divider" },
  quote: { icon: Quote, label: "Quote" },
  code: { icon: Code, label: "Code" },
};

const initialBlocks: Record<string, Block[]> = {
  "1": [
    { id: "b1", type: "heading1", content: "New Design System — Overview" },
    { id: "b2", type: "paragraph", content: "We've shipped a complete overhaul of our design tokens, component library, and documentation. Here's what changed and why." },
    { id: "b3", type: "heading2", content: "What's New" },
    { id: "b4", type: "bullet-list", content: "Unified color system with semantic tokens" },
    { id: "b5", type: "bullet-list", content: "New typography scale (Inter, tighter tracking)" },
    { id: "b6", type: "bullet-list", content: "Simplified component variants" },
    { id: "b7", type: "divider", content: "" },
    { id: "b8", type: "heading2", content: "Migration Guide" },
    { id: "b9", type: "paragraph", content: "To migrate existing components, update your imports and replace gradient utilities with semantic classes." },
    { id: "b10", type: "todo", content: "Update color tokens in tailwind config", checked: true },
    { id: "b11", type: "todo", content: "Replace glass utilities with bg-secondary", checked: true },
    { id: "b12", type: "todo", content: "Audit all components for hardcoded colors", checked: false },
  ],
  "4": [
    { id: "b20", type: "heading1", content: "Spatial Audio — Technical Notes" },
    { id: "b21", type: "paragraph", content: "Proximity-based audio positioning is now live. This page documents the architecture and usage." },
    { id: "b22", type: "heading2", content: "How It Works" },
    { id: "b23", type: "numbered-list", content: "Each user has a position in a 2D coordinate space" },
    { id: "b24", type: "numbered-list", content: "Audio volume scales inversely with distance" },
    { id: "b25", type: "numbered-list", content: "Stereo panning reflects relative position" },
    { id: "b26", type: "quote", content: "Think of it like a virtual room — the closer you are, the louder they sound." },
    { id: "b27", type: "heading2", content: "API" },
    { id: "b28", type: "code", content: "voiceEngine.setPosition(userId, { x: 0.5, y: 0.3 })" },
  ],
};

let blockIdCounter = 100;
const genId = () => `b${++blockIdCounter}`;

const ThreadWikiPage = ({ message, onClose }: ThreadWikiPageProps) => {
  const [blocks, setBlocks] = useState<Block[]>(
    initialBlocks[message.id] || [
      { id: genId(), type: "heading1", content: message.content },
      { id: genId(), type: "paragraph", content: "" },
    ]
  );
  const [focusedBlock, setFocusedBlock] = useState<string | null>(null);
  const [showMenu, setShowMenu] = useState<string | null>(null);
  const [showTypeMenu, setShowTypeMenu] = useState<string | null>(null);

  const updateBlock = useCallback((id: string, updates: Partial<Block>) => {
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, ...updates } : b)));
  }, []);

  const addBlockAfter = useCallback((afterId: string, type: BlockType = "paragraph") => {
    const newBlock: Block = { id: genId(), type, content: "", checked: type === "todo" ? false : undefined };
    setBlocks((prev) => {
      const idx = prev.findIndex((b) => b.id === afterId);
      const next = [...prev];
      next.splice(idx + 1, 0, newBlock);
      return next;
    });
    setTimeout(() => setFocusedBlock(newBlock.id), 30);
    return newBlock.id;
  }, []);

  const removeBlock = useCallback((id: string) => {
    setBlocks((prev) => {
      if (prev.length <= 1) return prev;
      const idx = prev.findIndex((b) => b.id === id);
      const next = prev.filter((b) => b.id !== id);
      const focusIdx = Math.max(0, idx - 1);
      setTimeout(() => setFocusedBlock(next[focusIdx]?.id ?? null), 30);
      return next;
    });
  }, []);

  const moveBlock = useCallback((id: string, direction: "up" | "down") => {
    setBlocks((prev) => {
      const idx = prev.findIndex((b) => b.id === id);
      if ((direction === "up" && idx === 0) || (direction === "down" && idx === prev.length - 1)) return prev;
      const next = [...prev];
      const swapIdx = direction === "up" ? idx - 1 : idx + 1;
      [next[idx], next[swapIdx]] = [next[swapIdx], next[idx]];
      return next;
    });
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLElement>, block: Block) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        const continueType: BlockType =
          block.type === "bullet-list" || block.type === "numbered-list" || block.type === "todo"
            ? block.type
            : "paragraph";
        if (block.content === "" && continueType !== "paragraph") {
          updateBlock(block.id, { type: "paragraph" });
        } else {
          addBlockAfter(block.id, continueType);
        }
      }
      if (e.key === "Backspace" && block.content === "") {
        e.preventDefault();
        removeBlock(block.id);
      }
    },
    [addBlockAfter, removeBlock, updateBlock]
  );

  const renderBlockContent = (block: Block) => {
    if (block.type === "divider") {
      return <div className="border-t border-border my-2" />;
    }

    const baseClasses = "w-full outline-none bg-transparent resize-none leading-relaxed";
    const typeClasses: Record<string, string> = {
      heading1: "text-2xl font-bold text-foreground",
      heading2: "text-xl font-semibold text-foreground",
      heading3: "text-lg font-medium text-foreground",
      paragraph: "text-sm text-foreground/90",
      "bullet-list": "text-sm text-foreground/90",
      "numbered-list": "text-sm text-foreground/90",
      todo: "text-sm text-foreground/90",
      quote: "text-sm text-foreground/80 italic border-l-2 border-primary pl-3",
      code: "text-sm font-mono bg-secondary rounded px-2 py-1 text-foreground",
    };

    const prefix = (() => {
      if (block.type === "bullet-list") return <span className="text-muted-foreground mr-2 select-none">•</span>;
      if (block.type === "numbered-list") {
        const idx = blocks.filter((b) => b.type === "numbered-list").findIndex((b) => b.id === block.id);
        return <span className="text-muted-foreground mr-2 select-none min-w-[1.2em] text-right">{idx + 1}.</span>;
      }
      if (block.type === "todo") {
        return (
          <button
            onClick={() => updateBlock(block.id, { checked: !block.checked })}
            className={`mr-2 w-4 h-4 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
              block.checked
                ? "bg-primary border-primary text-primary-foreground"
                : "border-border hover:border-primary/50"
            }`}
          >
            {block.checked && (
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M2 5L4 7L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
        );
      }
      return null;
    })();

    return (
      <div className="flex items-start">
        {prefix}
        <input
          value={block.content}
          onChange={(e) => updateBlock(block.id, { content: e.target.value })}
          onKeyDown={(e) => handleKeyDown(e, block)}
          onFocus={() => setFocusedBlock(block.id)}
          placeholder={
            block.type === "heading1"
              ? "Heading 1"
              : block.type === "heading2"
              ? "Heading 2"
              : block.type === "heading3"
              ? "Heading 3"
              : "Type something..."
          }
          className={`${baseClasses} ${typeClasses[block.type] || typeClasses.paragraph} placeholder:text-muted-foreground/40 ${
            block.type === "todo" && block.checked ? "line-through text-muted-foreground" : ""
          }`}
          autoFocus={focusedBlock === block.id}
        />
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col flex-1 min-w-0 bg-background"
    >
      {/* Header */}
      <div className="h-12 px-4 flex items-center gap-3 border-b border-border shrink-0">
        <button
          onClick={onClose}
          className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="flex items-center gap-2 min-w-0">
          <MessageSquare size={16} className="text-muted-foreground shrink-0" />
          <span className="text-sm font-medium text-foreground truncate">
            Thread from {message.author}
          </span>
        </div>
        <span className="text-xs text-muted-foreground">{message.time}</span>
      </div>

      {/* Original message context */}
      <div className="px-8 pt-5 pb-3 border-b border-border bg-secondary/30">
        <div className="flex items-center gap-2 mb-1.5">
          <div
            className={`w-6 h-6 rounded-full bg-gradient-to-br ${message.color} flex items-center justify-center text-[10px] font-bold`}
            style={{ color: "white" }}
          >
            {message.avatar}
          </div>
          <span className="text-xs font-medium text-foreground">{message.author}</span>
          <span className="text-[10px] text-muted-foreground">{message.time}</span>
        </div>
        <p className="text-sm text-muted-foreground pl-8">{message.content}</p>
      </div>

      {/* Wiki blocks */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="max-w-2xl mx-auto px-8 py-6 space-y-0.5">
          {blocks.map((block, idx) => (
            <div
              key={block.id}
              className="group relative flex items-start gap-1 py-1 -ml-14 pl-14"
              onMouseLeave={() => {
                setShowMenu(null);
                setShowTypeMenu(null);
              }}
            >
              {/* Block controls */}
              <div className="absolute left-0 top-1 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => addBlockAfter(blocks[idx - 1]?.id || block.id)}
                  className="p-0.5 text-muted-foreground/50 hover:text-foreground rounded transition-colors"
                  title="Add block"
                >
                  <Plus size={14} />
                </button>
                <div className="relative">
                  <button
                    onClick={() => setShowMenu(showMenu === block.id ? null : block.id)}
                    className="p-0.5 text-muted-foreground/50 hover:text-foreground rounded cursor-grab transition-colors"
                    title="Menu"
                  >
                    <GripVertical size={14} />
                  </button>
                  {showMenu === block.id && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute left-0 top-full mt-1 w-44 bg-card border border-border rounded-lg shadow-lg z-20 py-1"
                    >
                      <button
                        onClick={() => {
                          setShowMenu(null);
                          setShowTypeMenu(showTypeMenu === block.id ? null : block.id);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-foreground hover:bg-muted transition-colors"
                      >
                        <Type size={14} />
                        Turn into...
                      </button>
                      <button
                        onClick={() => { moveBlock(block.id, "up"); setShowMenu(null); }}
                        className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-foreground hover:bg-muted transition-colors"
                      >
                        <ChevronUp size={14} />
                        Move up
                      </button>
                      <button
                        onClick={() => { moveBlock(block.id, "down"); setShowMenu(null); }}
                        className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-foreground hover:bg-muted transition-colors"
                      >
                        <ChevronDown size={14} />
                        Move down
                      </button>
                      <div className="border-t border-border my-1" />
                      <button
                        onClick={() => { removeBlock(block.id); setShowMenu(null); }}
                        className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </motion.div>
                  )}
                  {showTypeMenu === block.id && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute left-0 top-full mt-1 w-48 bg-card border border-border rounded-lg shadow-lg z-20 py-1 max-h-64 overflow-y-auto scrollbar-thin"
                    >
                      {(Object.entries(blockTypeConfig) as [BlockType, typeof blockTypeConfig[BlockType]][]).map(
                        ([type, config]) => (
                          <button
                            key={type}
                            onClick={() => {
                              updateBlock(block.id, {
                                type,
                                checked: type === "todo" ? false : undefined,
                              });
                              setShowTypeMenu(null);
                            }}
                            className={`w-full flex items-center gap-2 px-3 py-1.5 text-sm transition-colors ${
                              block.type === type
                                ? "text-primary bg-primary/5"
                                : "text-foreground hover:bg-muted"
                            }`}
                          >
                            <config.icon size={14} />
                            {config.label}
                          </button>
                        )
                      )}
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Block content */}
              <div className="flex-1 min-w-0">{renderBlockContent(block)}</div>
            </div>
          ))}

          {/* Add block button at bottom */}
          <button
            onClick={() => addBlockAfter(blocks[blocks.length - 1].id)}
            className="flex items-center gap-2 text-sm text-muted-foreground/50 hover:text-muted-foreground py-2 transition-colors"
          >
            <Plus size={14} />
            Add a block
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ThreadWikiPage;
