import { useMemo, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./App.css";
import {
  icons as ICONS,
  CopyLinear,
  TickCircleLinear,
  GithubLinear,
  NewTwitterLinear,
} from "./icons";
import { matchesAlias } from "./icons/aliases";
import InstallCmdCard from "./components/InstallCmdCard";

const GITHUB_REPO_OWNER = "ig-imanish";
const GITHUB_REPO_NAME = "mx-icons";
const GITHUB_API_URL = `https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}`;
const GITHUB_REPO_URL = `https://github.com/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}`;
const GITHUB_ISSUE_URL = `${GITHUB_REPO_URL}/issues/new`;

function App() {
  const [query, setQuery] = useState("");
  const [copiedIcon, setCopiedIcon] = useState(null);
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [iconSize, setIconSize] = useState(24);
  const [iconColor, setIconColor] = useState("#292D32");
  const [activeVariant, setActiveVariant] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [gitStars, setgitStars] = useState("");
  const [gitForks, setgitForks] = useState("");
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    const isManual = localStorage.getItem("darkModeManual") === "true";

    if (saved !== null && isManual) {
      return JSON.parse(saved);
    }

    return (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    );
  });

  const iconsPerPage = 120;
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const fetchGitHubStats = async () => {
      try {
        const response = await fetch(GITHUB_API_URL);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        const formatCount = (value) => {
          if (value >= 1000) {
            return Math.floor(value / 1000) + "k";
          }
          return value;
        };
        setgitStars(formatCount(data?.stargazers_count ?? 0));
        setgitForks(formatCount(data?.forks_count ?? 0));
      } catch (error) {
        console.error("Failed to load GitHub stats:", error);
      }
    };
    fetchGitHubStats();
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  useEffect(() => {
    if (!window.matchMedia) return;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemThemeChange = (e) => {
      const isManual = localStorage.getItem("darkModeManual") === "true";
      if (!isManual) {
        setIsDarkMode(e.matches);
      }
    };
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleSystemThemeChange);
      return () => {
        mediaQuery.removeEventListener("change", handleSystemThemeChange);
      };
    } else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleSystemThemeChange);
      return () => {
        mediaQuery.removeListener(handleSystemThemeChange);
      };
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    localStorage.setItem("darkModeManual", "true");
  };

  const allVariants = useMemo(() => {
    if (!ICONS || ICONS.length === 0) return [];
    const variantSet = new Set();
    ICONS.forEach((group) => {
      group.variants?.forEach((v) => variantSet.add(v.variant));
    });
    return ["all", ...Array.from(variantSet).sort()];
  }, []);

  const flatIcons = useMemo(() => {
    const list = [];
    if (activeVariant === "all") {
      ICONS.forEach((group) => {
        group.variants?.forEach((variantIcon) => {
          list.push({
            groupName: group.name,
            groupSlug: group.slug,
            ...variantIcon,
          });
        });
      });
    } else {
      ICONS.forEach((group) => {
        const variantIcon = group.variants?.find(
          (v) => v.variant === activeVariant,
        );
        if (variantIcon) {
          list.push({
            groupName: group.name,
            groupSlug: group.slug,
            ...variantIcon,
          });
        }
      });
    }
    return list;
  }, [activeVariant]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return flatIcons;
    return flatIcons.filter((icon) => {
      const matchesDirectSearch =
        icon.slug?.toLowerCase().includes(q) ||
        icon.componentName?.toLowerCase().includes(q) ||
        icon.groupName?.toLowerCase().includes(q) ||
        icon.groupSlug?.toLowerCase().includes(q);
      const matchesAliasSearch = matchesAlias(
        icon.groupSlug || icon.slug || "",
        q,
      );
      return matchesDirectSearch || matchesAliasSearch;
    });
  }, [query, flatIcons]);

  const totalPages = Math.ceil(filtered.length / iconsPerPage);
  const paginatedIcons = useMemo(() => {
    const startIndex = (currentPage - 1) * iconsPerPage;
    const endIndex = startIndex + iconsPerPage;
    return filtered.slice(startIndex, endIndex);
  }, [filtered, currentPage, iconsPerPage]);

  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(1);
  }

  async function copyCode(code) {
    let copied = false;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(code);
        copied = true;
      }
    } catch (e) {
      console.error("clipboard api copy failed", e);
    }
    if (!copied) {
      const textarea = document.createElement("textarea");
      textarea.value = code;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.top = "-9999px";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      try {
        copied = document.execCommand("copy");
      } catch (e) {
        console.error("fallback copy failed", e);
      } finally {
        document.body.removeChild(textarea);
      }
    }
    if (copied) {
      setCopiedIcon("code");
      setTimeout(() => setCopiedIcon(null), 1500);
    } else {
      console.error("copy failed");
    }
  }

  function openIconModal(icon) {
    setSelectedIcon(icon);
    setIconSize(24);
    setIconColor(isDarkMode ? "#f8fafc" : "#292D32");
  }

  function closeIconModal() {
    setSelectedIcon(null);
  }

  const handleReset = () => {
    setQuery("");
    setActiveVariant("all");
    setCurrentPage(1);
  };

  return (
    <div className="app">
      <nav className="site-nav">
        <div className="site-nav-inner">
          <button
            type="button"
            className="site-nav-logo"
            onClick={handleReset}
            aria-label="Reset search and filters"
          >
            <img src="/mx-icons.png" alt="" />
            mxicons
          </button>

          <div className="site-nav-links">
            <Link
              to="/"
              className={`site-nav-link ${pathname === "/" ? "active" : ""}`}
            >
              Gallery
            </Link>
            <Link
              to="/installation"
              className={`site-nav-link ${pathname === "/installation" ? "active" : ""}`}
            >
              Get Started
            </Link>
            <a
              href={GITHUB_REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="site-nav-link"
              aria-label="GitHub repository"
            >
              GitHub
            </a>
          </div>

          <div className="site-nav-actions">
            <a
              href="https://www.npmjs.com/package/mx-icons"
              target="_blank"
              rel="noopener noreferrer"
              className="site-nav-icon-btn"
              aria-label="npm package"
              title="npm"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M1.763 0C.786 0 0 .786 0 1.763v20.474C0 23.214.786 24 1.763 24h20.474c.977 0 1.763-.786 1.763-1.763V1.763C24 .786 23.214 0 22.237 0H1.763zM5.13 5.323l13.837.019-.009 13.836h-3.464l.004-10.436h-3.456L12.04 19.17H5.113L5.13 5.323z" />
              </svg>
            </a>
            <a
              href={GITHUB_REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="site-nav-icon-btn"
              aria-label="GitHub"
              title={`${gitStars} stars · ${gitForks} forks`}
            >
              <GithubLinear color="currentColor" height={16} width={16} />
            </a>
            <button
              type="button"
              className="site-nav-icon-btn"
              onClick={toggleDarkMode}
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  width="16"
                  height="16"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.79" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  width="16"
                  height="16"
                  aria-hidden="true"
                >
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      <div className="page-wrap">
        <header className="hero">
          {/* <div className="hero-eyebrow">
            <span>Open Source · MIT</span>
            <span>
              {ICONS.length.toLocaleString()} icons
              {version ? ` · v${version}` : ""}
            </span>
          </div>*/}

          <div className="hero-brand" style={{ marginTop: "40px" }}>
            <img src="/mx-icons.png" alt="" className="hero-logo" />
            <h1 className="hero-title">mxicons</h1>
          </div>

          <p className="hero-tagline">
            Open source, beautiful icons for React projects. Hand-crafted SVG
            components with multiple style variants — linear, bold, bulk, and
            more. Tree-shakable, customizable, and ready for your app or design
            system.
          </p>

          <p className="hero-contribute">
            Have an icon to contribute?{" "}
            <a
              href={GITHUB_ISSUE_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              Submit it here
            </a>
          </p>

          <div className="hero-install">
            <InstallCmdCard />
          </div>

          <div className="hero-actions">
            <a
              className="action-button primary"
              href={GITHUB_REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              Contribution
            </a>
            <Link to="/installation" className="action-button secondary">
              Get Started
            </Link>
            <a
              className="action-button secondary"
              href="https://twitter.com/intent/tweet?text=Excited%20to%20share%20MX%20Icons%20%0A-%20Open%20source%0A-%20Awesome%20icons%0A%0ALink%20%3A%20https%3A%2F%2Fmx-icons.vercel.app%0A%0A%40mx_icons"
              target="_blank"
              rel="noopener noreferrer"
            >
              <NewTwitterLinear color="currentColor" height={16} width={16} />
              Share
            </a>
          </div>
        </header>

        <div className="gallery-controls">
          <div className="gallery-controls-row">
            <label className="search-wrapper" htmlFor="icon-search">
              <span className="search-prefix" aria-hidden="true">
                /
              </span>
              <span className="search-label">Search Icons</span>
              <input
                id="icon-search"
                className="search-input"
                type="text"
                placeholder={`search ${filtered.length.toLocaleString()} icons...`}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search icons by name or keywords"
              />
            </label>

            <div
              className="variant-tabs"
              role="tablist"
              aria-label="Icon style variants"
            >
              {allVariants.map((variant) => (
                <button
                  key={variant}
                  type="button"
                  role="tab"
                  aria-selected={activeVariant === variant}
                  className={`variant-tab ${activeVariant === variant ? "active" : ""}`}
                  onClick={() => setActiveVariant(variant)}
                >
                  {variant.charAt(0).toUpperCase() + variant.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* <p className="gallery-meta">
          {query
            ? `${filtered.length.toLocaleString()} matches for "${query}"`
            : `${filtered.length.toLocaleString()} icons · ${variantLabel} style · click any to customize`}
        </p>*/}

        {totalPages > 1 && (
          <div className="pagination">
            <div className="pagination-group">
              <button
                type="button"
                className="pagination-button"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span className="pagination-info">
                Page {currentPage} of {totalPages}
              </span>
              <button
                type="button"
                className="pagination-button"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="no-results">
            <p>No icons found matching &ldquo;{query}&rdquo;</p>
          </div>
        ) : (
          <div className="icons-grid">
            {paginatedIcons.map((icon) => (
              <button
                key={icon.slug}
                type="button"
                className="icon-card"
                onClick={() => openIconModal(icon)}
                title={`Customize ${icon.componentName}`}
                aria-label={`Customize ${icon.componentName}`}
              >
                <div className="icon-display">
                  <icon.Component
                    size={32}
                    color={isDarkMode ? "#f8fafc" : "currentColor"}
                  />
                </div>
                <div className="icon-name">{icon.componentName}</div>
              </button>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="pagination">
            <div className="pagination-group">
              <button
                type="button"
                className="pagination-button"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span className="pagination-info">
                Page {currentPage} of {totalPages}
              </span>
              <button
                type="button"
                className="pagination-button"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {selectedIcon && (
          <div className="modal-overlay" onClick={closeIconModal}>
            <div
              className="modal-card"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="icon-modal-title"
            >
              <button
                type="button"
                className="modal-close"
                onClick={closeIconModal}
                aria-label="Close icon details"
              >
                <span className="modal-close-icon" aria-hidden="true" />
              </button>

              <div className="modal-header">
                <h2 id="icon-modal-title" className="modal-title">
                  {selectedIcon.componentName}
                </h2>
              </div>

              <div className="modal-customizer">
                <div className="modal-preview">
                  <selectedIcon.Component size={iconSize} color={iconColor} />
                </div>

                <div className="modal-controls">
                  <div className="control-group">
                    <label htmlFor="icon-size-control">
                      Size <strong>{iconSize}px</strong>
                    </label>
                    <input
                      id="icon-size-control"
                      type="range"
                      min="8"
                      max="96"
                      value={iconSize}
                      onChange={(e) => setIconSize(Number(e.target.value))}
                    />
                  </div>

                  <div className="control-group">
                    <label htmlFor="icon-color-control">
                      Color <strong>{iconColor}</strong>
                    </label>
                    <input
                      id="icon-color-control"
                      type="color"
                      value={iconColor}
                      onChange={(e) => setIconColor(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-code">
                <h3>How to use</h3>
                <pre>
                  <button
                    type="button"
                    className={`code-copy-btn ${copiedIcon === "code" ? "copied" : ""}`}
                    data-tooltip="Copy to clipboard"
                    onClick={() =>
                      copyCode(
                        `import {\n  ${selectedIcon.componentName}\n} from 'mx-icons'\n\n<${selectedIcon.componentName}\n  size={${iconSize}}\n  color="${iconColor}"\n/>`,
                      )
                    }
                    aria-label="Copy code"
                  >
                    {copiedIcon === "code" ? (
                      <TickCircleLinear size={16} color="currentColor" />
                    ) : (
                      <CopyLinear size={16} color="currentColor" />
                    )}
                  </button>
                  <code>
                    <span className="keyword">import</span>
                    <span className="punctuation"> {"{"}</span>
                    {"\n  "}
                    <span className="component-name">
                      {selectedIcon.componentName}
                    </span>
                    {"\n"}
                    <span className="punctuation">{"} "}</span>
                    <span className="keyword">from</span>
                    <span className="prop-value"> &apos;mx-icons&apos;</span>
                    {"\n\n"}
                    <span className="punctuation">{"<"}</span>
                    <span className="component-name">
                      {selectedIcon.componentName}
                    </span>
                    {"\n  "}
                    <span className="prop-name">size</span>
                    <span className="punctuation">={"{"}</span>
                    <span className="prop-value">{iconSize}</span>
                    <span className="punctuation">{"}"}</span>
                    {"\n  "}
                    <span className="prop-name">color</span>
                    <span className="punctuation">=</span>
                    <span className="prop-value">&quot;{iconColor}&quot;</span>
                    {"\n"}
                    <span className="punctuation">{"/>"}</span>
                  </code>
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>

      <footer className="footer">
        <div className="footer-content">
          <Link to="/" className="footer-brand-link" aria-label="mxicons home">
            <img src="/mx-icons.png" alt="" className="footer-brand-icon" />
            <span className="footer-brand-name">mxicons</span>
          </Link>

          <p className="footer-tagline">
            Open source, beautiful icons for React projects.
          </p>

          <nav className="footer-links" aria-label="Footer">
            <Link to="/">Gallery</Link>
            <Link to="/installation">Get Started</Link>
            <a href={GITHUB_REPO_URL} target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            <a
              href="https://www.npmjs.com/package/mx-icons"
              target="_blank"
              rel="noopener noreferrer"
            >
              npm
            </a>
          </nav>

          <div className="footer-bottom">
            <p className="footer-copyright">
              © {currentYear} MX Icons · Released under the MIT License
            </p>
            <div className="footer-social">
              <a
                href={GITHUB_REPO_URL}
                aria-label="GitHub"
                target="_blank"
                rel="noopener noreferrer"
                title={`${gitStars} stars`}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
              <a
                href="https://x.com/mx_icons"
                aria-label="Twitter"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
