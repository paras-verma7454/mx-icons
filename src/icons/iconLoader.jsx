/**
 * Dynamic icon loader utilities.
 * Contains JSX (for the fallback icon), so the file is .jsx.
 * Only exports non-component functions (no components are exported from here).
 */

const componentCache = new Map();

/**
 * Convert slug + variant into the actual component file name.
 * Examples:
 *   slug="add", variant="linear" → "AddLinear"
 *   slug="3d-cube-scan", variant="bold" → "3dCubeScanBold"
 */
function getComponentFileName(slug, variant) {
  const base = slug
    .split("-")
    .map((part) => {
      if (/^\d/.test(part)) {
        return part;
      }
      return part.charAt(0).toUpperCase() + part.slice(1);
    })
    .join("");

  const variantCapitalized = variant.charAt(0).toUpperCase() + variant.slice(1);
  return `${base}${variantCapitalized}`;
}

export function getCachedIconComponent(slug, variant = "linear") {
  const key = `${slug}:${variant}`;
  return componentCache.get(key) || null;
}

/**
 * Dynamically load a single icon component.
 * Returns a Promise that resolves to the React component.
 * Results are cached so subsequent renders are instant.
 */
export async function loadIconComponent(slug, variant = "linear") {
  const key = `${slug}:${variant}`;
  if (componentCache.has(key)) {
    return componentCache.get(key);
  }

  const fileName = getComponentFileName(slug, variant);

  try {
    const mod = await import(`./components/${slug}/${fileName}.jsx`);
    const Component = mod.default;
    componentCache.set(key, Component);
    return Component;
  } catch (err) {
    console.warn(`[loadIcon] Failed to load ${fileName} for slug=${slug}`, err);
    const Fallback = ({ size = 24, color = "currentColor", className = "" }) => (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        className={className}
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v4M12 16h.01" />
      </svg>
    );
    componentCache.set(key, Fallback);
    return Fallback;
  }
}
