// Tooltip.tsx
import { useState, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  delay?: number;
  vertical?: "top" | "bottom"; // top or bottom
  horizontal?: "left" | "right"; // left, right
  offsetX?: number | string; // horizontal offset
  offsetY?: number | string; // vertical offset
}

export default function Tooltip({
  content,
  children,
  delay = 0,
  offsetX = 0,
  offsetY = 0,
}: TooltipProps) {
  const [visible, setVisible] = useState(false);
  let timeout: NodeJS.Timeout;

  const showTooltip = () => {
    timeout = setTimeout(() => setVisible(true), delay);
  };

  const hideTooltip = () => {
    clearTimeout(timeout);
    setVisible(false);
  };

  // calculate absolute positioning
  const style: React.CSSProperties = {};

  if (typeof offsetY === "number") {
    // style.top = `${offsetY}px`;
    style.top = `calc(100% + ${offsetY}px)`;
  } else if (typeof offsetY === "string") {
    style.top = `calc(100% + ${offsetY})`;
  }

  if (typeof offsetX === "number") {
    style.left = `${offsetX}px`;
  } else if (typeof offsetX === "string") {
    style.left = `calc(${offsetX})`;
  }

  // simple animation based on vertical
  // const initial = { opacity: 0, y: vertical === "top" ? -5 : 5 };
  const initial = { opacity: 0, y: -5 };
  const animate = { opacity: 1, y: 0 };
  // const exit = { opacity: 0, y: vertical === "top" ? -5 : 5 };
  const exit = { opacity: 0, y: -5 };

  return (
    <div
      style={{ display: "inline-block", position: "relative" }}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
    >
      {children}

      <AnimatePresence>
        {visible && (
          <motion.div
            initial={initial}
            animate={animate}
            exit={exit}
            transition={{ duration: 0.2 }}
            style={{
              position: "absolute",
              zIndex: 999,
              pointerEvents: "none",
              whiteSpace: "nowrap",
              background: "black",
              color: "white",
              padding: "5px 10px",
              borderRadius: "4px",
              ...style,
            }}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
