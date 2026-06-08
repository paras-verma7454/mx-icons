import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import GithubLinear from "../icons/components/github/GithubLinear.jsx";
import DarkModeToggle from "./DarkModeToggle";
import { GITHUB_REPO_URL } from "../constants";

export default function Navbar({
  onLogoClick,
  logoText = "mx-icons",
  version,
  showNpm = false,
  githubStats = null,
  isDarkMode,
  toggleDarkMode,
}) {
  const { pathname } = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const LogoElement = onLogoClick ? "button" : Link;
  const logoProps = onLogoClick
    ? {
        type: "button",
        onClick: onLogoClick,
        "aria-label": "Reset search and filters",
      }
    : { to: "/" };

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <nav className="site-nav">
      <div className="site-nav-inner">
        <LogoElement className="site-nav-logo" {...logoProps}>
          <img src="/mx-icons.png" alt="" />
          {logoText}
          {version && (
            <span className="version-badge" style={{ marginLeft: "0.35rem" }}>
              v{version}
            </span>
          )}
        </LogoElement>

        <div className="site-nav-links">
          <Link
            to="/"
            className={`site-nav-link ${pathname === "/" ? "active" : ""}`}
          >
            Home
          </Link>
          <Link
            to="/installation"
            className={`site-nav-link ${pathname === "/installation" ? "active" : ""}`}
          >
            Installation
          </Link>
        </div>

        <div className="site-nav-actions">
          {showNpm && (
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
          )}

          <a
            href={GITHUB_REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="site-nav-icon-btn"
            aria-label="GitHub"
            title={
              githubStats
                ? `${githubStats.stars} stars · ${githubStats.forks} forks`
                : undefined
            }
          >
            <GithubLinear color="currentColor" height={16} width={16} />
          </a>

          <button
            type="button"
            className="site-nav-icon-btn site-nav-hamburger"
            onClick={toggleMobileMenu}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18" aria-hidden="true">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>

          <DarkModeToggle isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
        </div>

        {mobileMenuOpen && (
          <div className="site-nav-mobile-menu">
            <Link
              to="/"
              className={`site-nav-link ${pathname === "/" ? "active" : ""}`}
              onClick={closeMobileMenu}
            >
              Home
            </Link>
            <Link
              to="/installation"
              className={`site-nav-link ${pathname === "/installation" ? "active" : ""}`}
              onClick={closeMobileMenu}
            >
              Installation
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
