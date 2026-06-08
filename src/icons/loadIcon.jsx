/**
 * React component that lazy-loads and renders an icon from metadata.
 * Shows a lightweight skeleton while the chunk is being fetched.
 */
import { useState, useEffect } from "react";
import { loadIconComponent, getCachedIconComponent } from "./iconLoader.jsx";

export function LazyIcon({ slug, variant = "linear", size = 32, color, className = "", ...props }) {
  const [Component, setComponent] = useState(() => getCachedIconComponent(slug, variant));
  const [isLoading, setIsLoading] = useState(() => !getCachedIconComponent(slug, variant));

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    loadIconComponent(slug, variant).then((Loaded) => {
      if (!cancelled) {
        setComponent(() => Loaded);
        setIsLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [slug, variant]);

  const style = {
    width: size,
    height: size,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  };

  if (isLoading || !Component) {
    return (
      <div
        className={`icon-skeleton ${className}`}
        style={{
          ...style,
          background: "rgba(0,0,0,0.06)",
          borderRadius: 6,
        }}
        aria-hidden="true"
      />
    );
  }

  return <Component size={size} color={color} className={className} {...props} />;
}

