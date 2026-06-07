import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { CopyLinear, TickCircleLinear } from "../icons";
import InstallCmdCard from "./InstallCmdCard";
import "./Installation.css";

function Installation() {
    const [copiedCode, setCopiedCode] = useState(false);
  const [version, setVersion] = useState("");
  const [activeSection, setActiveSection] = useState("install");
  const { pathname } = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    if (saved !== null) return JSON.parse(saved);
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

    useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["install", "usage", "props"];
      const scrollPosition = window.scrollY + 150;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetBottom = offsetTop + element.offsetHeight;

          if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

    const copyCodeBlock = () => {
    const code = `import { NoteTextLinear } from "mx-icons";

function App() {
  return <NoteTextLinear size={24} color="#292D32" />
}`;
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  useEffect(() => {
    fetch("https://registry.npmjs.org/mx-icons")
      .then((response) => response.json())
      .then((data) => {
        const latestVersion =
          data?.distTags?.latest || data?.["dist-tags"]?.latest || "";
        setVersion(latestVersion);
      })
      .catch((err) => console.error("Failed to load version", err));
  }, []);

  return (
    <div className="installation-page">
      <nav className="site-nav">
        <div className="site-nav-inner">
          <Link to="/" className="site-nav-logo">
            <img src="/mx-icons.png" alt="" />
            mxicons
            {version && (
              <span className="version-badge" style={{ marginLeft: "0.35rem" }}>
                v{version}
              </span>
            )}
          </Link>

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
              href="https://github.com/ig-imanish/mx-icons"
              target="_blank"
              rel="noopener noreferrer"
              className="site-nav-link"
            >
              GitHub
            </a>
          </div>

          <div className="site-nav-actions">
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
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
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

      <div className="docs-container">
        <main className="docs-content">
          <h1 className="page-title">Installation Guide</h1>
          <p className="page-description">
            How to install and use MX Icons in your React project.
          </p>

          <section id="install" className="docs-section">
            <h2>Install</h2>
            <p>Choose your preferred package manager to install MX Icons:</p>
            <InstallCmdCard />
          </section>

          <section id="usage" className="docs-section">
            <h2>Usage</h2>
            <div className="usage-card">
              <div className="usage-header">
                <div className="usage-title">Quick Start</div>
                <div className="usage-description">
                  Import icons from mx-icons and use them as React components.
                </div>
              </div>
              <div className="usage-content">
                <div className="usage-code-container">
                  <button
                    type="button"
                    className="copy-btn"
                    onClick={copyCodeBlock}
                    aria-label="Copy code"
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      zIndex: 10,
                    }}
                  >
                    {copiedCode ? (
                      <TickCircleLinear size={18} color="currentColor" />
                    ) : (
                      <CopyLinear size={18} color="currentColor" />
                    )}
                  </button>
                  <pre>
                    <code>
                      <span className="keyword">import</span>{" "}
                      <span className="punctuation">{"{"}</span>{" "}
                      <span className="component">NoteTextLinear</span>{" "}
                      <span className="punctuation">{"}"}</span>{" "}
                      <span className="keyword">from</span>{" "}
                      <span className="string">&quot;mx-icons&quot;</span>;
                      {"\n\n"}
                      <span className="keyword">function</span>{" "}
                      <span className="component">App</span>(){" "}
                      <span className="punctuation">{"{"}</span>
                      {"\n  "}
                      <span className="keyword">return</span>{" "}
                      <span className="tag">&lt;NoteTextLinear</span>{" "}
                      <span className="attr-name">size</span>
                      <span className="punctuation">={"{"}</span>
                      <span className="number">24</span>
                      <span className="punctuation">{"}"}</span>{" "}
                      <span className="attr-name">color</span>
                      <span className="punctuation">=&quot;</span>
                      <span className="string">#292D32</span>
                      <span className="punctuation">&quot;</span>{" "}
                      <span className="tag">/&gt;</span>
                      {"\n"}
                      <span className="punctuation">{"}"}</span>
                    </code>
                  </pre>
                </div>
              </div>
            </div>
          </section>

          <section id="props" className="docs-section">
            <h2>Props &amp; Customization</h2>
            <p>
              All icon components accept the following props for customization:
            </p>
            <div className="table-container">
              <table className="props-table">
                <thead>
                  <tr>
                    <th>Prop</th>
                    <th>Type</th>
                    <th>Default</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <code>size</code>
                    </td>
                    <td>
                      <code>number | string</code>
                    </td>
                    <td>
                      <code>24</code>
                    </td>
                    <td>Icon width and height (px or any CSS unit)</td>
                  </tr>
                  <tr>
                    <td>
                      <code>color</code>
                    </td>
                    <td>
                      <code>string</code>
                    </td>
                    <td>
                      <code>&quot;#292D32&quot;</code>
                    </td>
                    <td>Icon color (any CSS color)</td>
                  </tr>
                  <tr>
                    <td>
                      <code>className</code>
                    </td>
                    <td>
                      <code>string</code>
                    </td>
                    <td>
                      <code>&quot;&quot;</code>
                    </td>
                    <td>Additional CSS classes</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <div className="back-button-container">
            <Link to="/" className="back-button">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Back to Icons
            </Link>
          </div>
        </main>

        <aside className="docs-toc">
          <div className="toc-sticky">
            <h3>On this page</h3>
            <ul>
              <li>
                <a
                  href="#install"
                  className={activeSection === "install" ? "active" : ""}
                >
                  Install
                </a>
              </li>
              <li>
                <a
                  href="#usage"
                  className={activeSection === "usage" ? "active" : ""}
                >
                  Usage
                </a>
              </li>
              <li>
                <a
                  href="#props"
                  className={activeSection === "props" ? "active" : ""}
                >
                  Props
                </a>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default Installation;