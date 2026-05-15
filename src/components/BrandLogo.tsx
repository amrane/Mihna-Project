import { Link } from "@tanstack/react-router";

interface BrandLogoProps {
  className?: string;
  link?: boolean;
  greenOnTransparent?: boolean;
}

export function BrandLogo({
  className = "",
  link = true,
  greenOnTransparent = false,
}: BrandLogoProps) {
  const wordmark = (
    <span
      dir="rtl"
      className={`font-logo text-2xl font-bold leading-none tracking-normal ${greenOnTransparent ? "text-brand drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]" : ""} ${className}`}
    >
      مِهنة
    </span>
  );

  return link ? (
    <Link to="/" aria-label="مِهنة home" className="inline-flex items-center">
      {wordmark}
    </Link>
  ) : (
    wordmark
  );
}
