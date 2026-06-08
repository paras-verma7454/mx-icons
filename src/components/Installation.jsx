import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CopyLinear from "../icons/components/copy/CopyLinear.jsx";
import TickCircleLinear from "../icons/components/tick-circle/TickCircleLinear.jsx";
import InstallCmdCard from "./InstallCmdCard";
import "./Installation.css";
import useDarkMode from "../hooks/useDarkMode";
import Navbar from "./Navbar";
import Footer from "./Footer";

function Installation() {
  const [copiedCode, setCopiedCode] = useState(false);
  const [version, setVersion] = useState("");
  const [activeSection, setActiveSection] = useState("install");
  const currentYear = new Date().getFullYear();

  const { isDarkMode, toggleDarkMode } = useDarkMode();

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
      <Navbar
        logoText="mxicons"
        version={version}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
      />

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
              Back to Home
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

      <Footer currentYear={currentYear} />
    </div>
  );
}

export default Installation;
