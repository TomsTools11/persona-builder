import BrandLockup from "./BrandLockup";

export default function AppFooter() {
  return (
    <footer className="ss-footer">
      <div className="ss-container">
        <div className="ss-footer-grid">
          <div>
            <BrandLockup variant="footer" />
            <p
              style={{
                marginTop: 14,
                fontSize: 13,
                color: "var(--text-secondary)",
                lineHeight: 1.55,
                maxWidth: 280,
              }}
            >
              A tiny utility from s3 labs. Turn a website or research notes into
              clear, actionable user personas.
            </p>
          </div>
          <div>
            <h4>Product</h4>
            <ul>
              <li>
                <a href="#features">Features</a>
              </li>
              <li>
                <a href="#how">How it works</a>
              </li>
              <li>
                <a href="#faq">FAQ</a>
              </li>
            </ul>
          </div>
          <div>
            <h4>More</h4>
            <ul>
              <li>
                <a href="#">S3 Labs</a>
              </li>
              <li>
                <a href="#">DropDoc</a>
              </li>
              <li>
                <a href="#">Github</a>
              </li>
            </ul>
          </div>
          <div>
            <h4>Legal</h4>
            <ul>
              <li>
                <a href="#">Terms</a>
              </li>
              <li>
                <a href="#">Privacy</a>
              </li>
              <li>
                <a href="#">Acceptable use</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="colophon">
          <span>© 2026 s3 labs</span>
          <span>
            made with <span style={{ color: "var(--danger)" }}>♥</span> by Tom in
            Milwaukee, WI
          </span>
        </div>
      </div>
    </footer>
  );
}
