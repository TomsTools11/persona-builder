import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number; sw?: number };

function Icon({
  size = 14,
  sw = 1.6,
  children,
  ...rest
}: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={sw}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...rest}
    >
      {children}
    </svg>
  );
}

export const I = {
  Globe: (p: IconProps) => (
    <Icon {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
    </Icon>
  ),
  Arrow: (p: IconProps) => (
    <Icon {...p}>
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </Icon>
  ),
  ArrowLeft: (p: IconProps) => (
    <Icon {...p}>
      <path d="M19 12H5" />
      <path d="m11 18-6-6 6-6" />
    </Icon>
  ),
  Spinner: (p: IconProps) => (
    <Icon {...p}>
      <path d="M21 12a9 9 0 1 1-3.5-7.1" />
    </Icon>
  ),
  Check: (p: IconProps) => (
    <Icon {...p}>
      <path d="M4 12.5 9 17.5 20 6.5" />
    </Icon>
  ),
  Circle: (p: IconProps) => (
    <Icon {...p}>
      <circle cx="12" cy="12" r="9" />
    </Icon>
  ),
  X: (p: IconProps) => (
    <Icon {...p}>
      <path d="M6 6 18 18" />
      <path d="M18 6 6 18" />
    </Icon>
  ),
  Refresh: (p: IconProps) => (
    <Icon {...p}>
      <path d="M3 12a9 9 0 0 1 15.5-6.3L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-15.5 6.3L3 16" />
      <path d="M3 21v-5h5" />
    </Icon>
  ),
  Download: (p: IconProps) => (
    <Icon {...p}>
      <path d="M12 4v12" />
      <path d="m6 11 6 6 6-6" />
      <path d="M5 20h14" />
    </Icon>
  ),
  External: (p: IconProps) => (
    <Icon {...p}>
      <path d="M13 5h6v6" />
      <path d="M19 5 11 13" />
      <path d="M19 14v4a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h4" />
    </Icon>
  ),
  Users: (p: IconProps) => (
    <Icon {...p}>
      <circle cx="9" cy="9" r="3.2" />
      <path d="M3 19a6 6 0 0 1 12 0" />
      <circle cx="17" cy="8.5" r="2.5" />
      <path d="M14 19a6 6 0 0 1 7-5.9" />
    </Icon>
  ),
  Layers: (p: IconProps) => (
    <Icon {...p}>
      <path d="M12 3 3 8l9 5 9-5-9-5Z" />
      <path d="m3 13 9 5 9-5" />
    </Icon>
  ),
  Document: (p: IconProps) => (
    <Icon {...p}>
      <path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
      <path d="M14 3v5h5" />
      <path d="M9 13h7" />
      <path d="M9 17h7" />
    </Icon>
  ),
  Search: (p: IconProps) => (
    <Icon {...p}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m20 20-4-4" />
    </Icon>
  ),
  Wand: (p: IconProps) => (
    <Icon {...p}>
      <path d="m3 21 12-12" />
      <path d="M14 3v3" />
      <path d="M18 4v3" />
      <path d="M21 7v3" />
      <path d="M16 11h3" />
      <path d="m17 16 1 2 2 1-2 1-1 2-1-2-2-1 2-1z" />
    </Icon>
  ),
  Plus: (p: IconProps) => (
    <Icon {...p}>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </Icon>
  ),
  Quote: (p: IconProps) => (
    <Icon {...p}>
      <path d="M7 7h4v4H7zM7 11c0 3 1 5 4 6" />
      <path d="M15 7h4v4h-4zM15 11c0 3 1 5 4 6" />
    </Icon>
  ),
  Target: (p: IconProps) => (
    <Icon {...p}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </Icon>
  ),
};
