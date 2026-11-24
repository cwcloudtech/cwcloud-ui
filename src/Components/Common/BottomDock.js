import { useEffect, useRef, useState } from "react";
import { useColumnBox } from "../../Hooks/useColumnBox";
import styles from "./BottomDock.module.css";

// Bar pinned to the bottom of the viewport whatever the resolution or the page
// length (like the CWAI prompt bar), aligned on the column of `anchorRef`
// rather than on the whole window, so it never slides under the sidebars.
// A spacer of the same height keeps the end of the page reachable above it.
function BottomDock({ anchorRef, className = "", children }) {
  const box = useColumnBox(anchorRef);
  const dockRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const node = dockRef.current;
    if (!node || typeof ResizeObserver === "undefined") return undefined;
    const observer = new ResizeObserver(() => setHeight(node.offsetHeight));
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div style={{ height }} aria-hidden="true" />
      <div
        ref={dockRef}
        className={`${styles.dock} ${className}`}
        style={box ? { left: box.left, width: box.width } : undefined}
      >
        {children}
      </div>
    </>
  );
}

export default BottomDock;
