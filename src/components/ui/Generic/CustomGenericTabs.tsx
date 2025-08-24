"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

export type TabFabConfig = {
  text?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  fabVariant?: VariantProps<typeof fabVariants>
};

export type TabItem = {
  id: string;
  label: string; 
  icon?: React.ReactNode; 
  content: React.ReactNode;
  fab?: TabFabConfig;
};

export type TabsProps = {
  tabs: TabItem[];
  initialTabId?: string;
  onTabChange?: (tab: TabItem, index: number) => void;
  className?: string;
  showFab?: boolean;
  equalizeThreshold?: number; // if number of tabs <= threshold, divide width equally. Default: 5
  fabFixed?: boolean; // if false will be absolute inside the container
  fabAnchor?: {
    vertical?: "bottom" | "top";
    horizontal?: "right" | "left";
    offset?: number; // px
  };
  fabClassName?: string; // extra classes on float button
};

// =====================
// Helpers
// =====================
const fabVariants = cva(
  // base
  cn("group inline-flex items-center gap-2 p-2 rounded-full shadow-lg cursor-pointer",
    "focus-visible:outline-none focus-visible:ring-2 transition-transform active:scale-95"
  ),
  {
    variants: {
      color: {
        primary:
          "bg-blue-600 hover:bg-blue-700 focus-visible:ring-blue-500 text-white",
        secondary:
          "bg-zinc-800 hover:bg-zinc-900 focus-visible:ring-zinc-600 text-white",
        success:
          "bg-green-600 hover:bg-green-700 focus-visible:ring-green-500 text-white",
        danger:
          "bg-rose-600 hover:bg-rose-700 focus-visible:ring-rose-500 text-white",
        warning:
          "bg-amber-500 hover:bg-amber-600 focus-visible:ring-amber-400 text-black",
        neutral:
          "bg-gray-200 hover:bg-gray-300 focus-visible:ring-gray-300 text-gray-900",
      },
    },
    defaultVariants: {
      color: "primary",
    },
  }
);

// =====================
// Component
// =====================
export default function CustomGenericTabs({
  tabs,
  initialTabId,
  onTabChange,
  className,
  showFab,
  equalizeThreshold = 5,
  fabFixed = true,
  fabAnchor,
  fabClassName,
}: TabsProps) {
  const [activeId, setActiveId] = React.useState<string>(initialTabId ?? (tabs[0]?.id ?? ""));

  const activeIndex = React.useMemo(
    () => Math.max(0, tabs.findIndex((t) => t.id === activeId)),
    [tabs, activeId]
  );

  const activeTab = tabs[activeIndex] ?? tabs[0];
  const equalize = tabs.length <= equalizeThreshold; // fill 100% and distributes equally

  const shouldShowFab = React.useMemo(() => {
    if (typeof showFab === "boolean") return showFab;
    return tabs.some((t) => Boolean(t.fab));
  }, [showFab, tabs]);

  const handleChange = (nextId: string) => {
    setActiveId(nextId);
    const idx = Math.max(0, tabs.findIndex((t) => t.id === nextId));
    onTabChange?.(tabs[idx], idx);
  };

  // Default behaviour when fab dosen't have on click
  const fabOnClick = () => {
    const label = activeTab?.label ?? "(sem rótulo)";
    console.log(`FAB acionado na aba "${label}" (id=${activeTab?.id})`);
  };

  // FAB POS
  const v = fabAnchor?.vertical ?? "bottom";
  const h = fabAnchor?.horizontal ?? "right";
  const off = Math.max(0, fabAnchor?.offset ?? 24); // default 24px

  const fabStyle = {
    position: fabFixed ? ("fixed" as const) : ("absolute" as const),
    [v]: off,
    [h]: off,
  } as React.CSSProperties;

  return (
    <div
      className={cn(
        "w-full min-w-[320px]",
        className
      )}
    >
      {/* Tabs Header */}
      <div className="relative">
        {!equalize && (
          <>
            <div className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-background to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-background to-transparent" />
          </>
        )}

        <div
          role="tablist"
          aria-label="Tabs"
          className={cn(
            "px-2 sm:px-3 md:px-4 py-2",
            equalize
              ? "flex items-stretch gap-1"
              : "flex items-center gap-1 overflow-x-auto no-scrollbar snap-x"
          )}
        >
          {tabs.map((tab) => {
            const isActive = tab.id === activeId;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                aria-controls={`panel-${tab.id}`}
                id={`tab-${tab.id}`}
                onClick={() => handleChange(tab.id)}
                className={cn(
                  "relative inline-flex items-center gap-2",
                  "rounded-xl px-3 sm:px-4 py-2 text-sm font-medium",
                  "transition-colors cursor-pointer",
                  equalize ? "flex-1 basis-0 justify-center" : "shrink-0 snap-start",
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tab.icon && <span className="inline-flex items-center">{tab.icon}</span>}
                <span className="whitespace-nowrap">{tab.label}</span>
                {isActive && (
                  <motion.span
                    layoutId="tab-underline"
                    className="absolute -bottom-1 left-2 right-2 h-0.5 rounded-full bg-foreground"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>
        <div className="h-px w-full bg-border" />
      </div>

      {/* Content Panel */}
      <div className="relative p-3 sm:p-4 md:p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab?.id}
            role="tabpanel"
            id={`panel-${activeTab?.id}`}
            aria-labelledby={`tab-${activeTab?.id}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="min-h-[120px]"
          >
            {activeTab?.content}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dynamic FAB */}
      {shouldShowFab && (
        <div className={cn("pointer-events-none relative", fabFixed ? "z-[60]" : "z-10")}> 
          <div className={cn("pointer-events-auto")} style={fabStyle}>
            <button
              type="button"
              onClick={activeTab?.fab?.onClick ?? fabOnClick}
              className={cn(
                fabVariants(activeTab.fab?.fabVariant),
                fabClassName
              )}
            >
              {activeTab?.fab?.icon && (
                <span className="inline-flex items-center">{activeTab.fab.icon}</span>
              )}
              {activeTab?.fab?.text && (
                <span className="text-sm font-semibold tracking-wide">
                  {activeTab?.fab?.text}
                </span>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}