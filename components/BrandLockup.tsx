type Variant = "nav" | "footer";

export default function BrandLockup({ variant = "nav" }: { variant?: Variant }) {
  const dims = variant === "footer" ? { width: 250, height: 75 } : { width: 200, height: 60 };
  return (
    <a
      href="/"
      className="brand-lockup"
      onClick={(e) => {
        if (variant === "footer") e.preventDefault();
      }}
      aria-label="Personas"
    >
      <img
        src="/persona-logo.png"
        alt="Personas"
        className="brand-mark-img"
        style={{ width: `${dims.width}px`, height: `${dims.height}px` }}
      />
    </a>
  );
}
