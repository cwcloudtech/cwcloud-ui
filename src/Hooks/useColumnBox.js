import { useEffect, useState } from "react";

// Horizontal position ({ left, width }) of an element, kept up to date when it
// moves or resizes (window resize, either sidebar toggled). Used to align
// viewport-fixed bars (chat prompt, ticket reply) on the page's content column.
export function useColumnBox(ref) {
  const [box, setBox] = useState(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    const update = () => {
      const { left, width } = node.getBoundingClientRect();
      setBox((prev) => (prev && prev.left === left && prev.width === width ? prev : { left, width }));
    };
    update();
    const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(update) : null;
    observer?.observe(node);
    window.addEventListener("resize", update);
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [ref]);

  return box;
}
