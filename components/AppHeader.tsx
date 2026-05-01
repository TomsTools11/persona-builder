import BrandLockup from "./BrandLockup";
import { I } from "./Icons";

type Mode = "landing" | "process" | "output";

interface Props {
  mode?: Mode;
  onCancel?: () => void;
  onNew?: () => void;
}

export default function AppHeader({ mode = "landing", onCancel, onNew }: Props) {
  return (
    <header className="ss-header">
      <div className="ss-header-inner">
        <BrandLockup />

        {mode === "landing" && (
          <nav className="nav-links">
            <a href="#features">Features</a>
            <a href="#how">How it works</a>
            <a href="#faq">FAQ</a>
            <span className="nav-cta">v1.0 · by s3 labs</span>
          </nav>
        )}

        {mode === "process" && (
          <button className="cancel-link" onClick={onCancel}>
            <I.ArrowLeft size={14} /> Cancel
          </button>
        )}

        {mode === "output" && (
          <button className="cancel-link" onClick={onNew}>
            <I.Refresh size={14} /> New analysis
          </button>
        )}
      </div>
    </header>
  );
}
