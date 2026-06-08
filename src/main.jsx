import { StrictMode, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";

// Lazy load the installation/docs page so its code is in a separate chunk
const Installation = lazy(() => import("./components/Installation.jsx"));

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route
          path="/installation"
          element={
            <Suspense fallback={<div style={{ padding: 40, textAlign: "center", opacity: 0.6 }}>Loading…</div>}>
              <Installation />
            </Suspense>
          }
        />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
