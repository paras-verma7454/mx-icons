import { useState } from "react";
import CopyLinear from "../icons/components/copy/CopyLinear.jsx";
import TickCircleLinear from "../icons/components/tick-circle/TickCircleLinear.jsx";
import "./InstallCmdCard.css";

const INSTALL_MANAGERS = ["npm", "pnpm"];

const INSTALL_COMMANDS = {
  npm: "npm install mx-icons",
  pnpm: "pnpm add mx-icons",
};

function InstallCmdCard({ className = "", defaultTab = "npm" }) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [copied, setCopied] = useState(false);

  const command = INSTALL_COMMANDS[activeTab];

  const copyCommand = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard can fail in insecure contexts
    }
  };

  return (
    <div className={`install-cmd-card ${className}`.trim()}>
      <div
        className="install-cmd-tabs"
        role="tablist"
        aria-label="Install package manager"
      >
        {INSTALL_MANAGERS.map((pm) => (
          <button
            key={pm}
            type="button"
            role="tab"
            aria-selected={activeTab === pm}
            className={`install-cmd-tab ${activeTab === pm ? "active" : ""}`}
            onClick={() => setActiveTab(pm)}
          >
            {pm}
          </button>
        ))}
      </div>

      <div
        className="install-cmd-panel"
        role="tabpanel"
        aria-label={`${activeTab} install command`}
      >
        <figure className="install-cmd-figure">
          <button
            type="button"
            className={`install-cmd-copy ${copied ? "copied" : ""}`}
            onClick={copyCommand}
            aria-label={copied ? "Copied" : "Copy command"}
          >
            {copied ? (
              <TickCircleLinear size={14} color="currentColor" />
            ) : (
              <CopyLinear size={14} color="currentColor" />
            )}
          </button>
          <div className="install-cmd-viewport">
            <pre>
              <code>
                <span className="line">{command}</span>
              </code>
            </pre>
          </div>
        </figure>
      </div>
    </div>
  );
}

export default InstallCmdCard;