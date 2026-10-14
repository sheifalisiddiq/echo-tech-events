"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

export function Preloader() {
  const [visible, setVisible] = useState(true);
  const reduce = useReducedMotion();
  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(false), reduce ? 250 : 1650);
    return () => window.clearTimeout(timer);
  }, [reduce]);
  return (
    <AnimatePresence>
      {visible && (
        <motion.div className="preloader" exit={{ opacity: 0 }} transition={{ duration: 0.45 }}>
          <div className="preloader-mark" aria-hidden="true">
            <motion.span initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.1, ease: [0.2, 0.8, 0.2, 1] }} />
          </div>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
            Engineering the moment
          </motion.p>
          <span className="preloader-count">DXB / UAE</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
