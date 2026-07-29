import type { ReactNode } from "react";

const P = { fill: "none", stroke: "currentColor", strokeWidth: 1.6 } as const;

export const Icons = {
  user: (
    <svg viewBox="0 0 24 24" {...P}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5" />
    </svg>
  ),
  clock: (
    <svg viewBox="0 0 24 24" {...P}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  ),
  server: (
    <svg viewBox="0 0 24 24" {...P}>
      <rect x="3" y="4" width="18" height="7" rx="1.5" />
      <rect x="3" y="13" width="18" height="7" rx="1.5" />
      <circle cx="7.5" cy="7.5" r=".9" fill="currentColor" />
      <circle cx="7.5" cy="16.5" r=".9" fill="currentColor" />
    </svg>
  ),
  box: (
    <svg viewBox="0 0 24 24" {...P}>
      <path d="M12 2 21 7v10l-9 5-9-5V7l9-5z" />
      <path d="M3.2 7.3 12 12l8.8-4.7M12 12v9.5" />
    </svg>
  ),
  chip: (
    <svg viewBox="0 0 24 24" {...P}>
      <rect x="6" y="6" width="12" height="12" rx="1.5" />
      <path d="M10 2v4M14 2v4M10 18v4M14 18v4M2 10h4M2 14h4M18 10h4M18 14h4" />
    </svg>
  ),
  mail: (
    <svg viewBox="0 0 24 24" {...P}>
      <rect x="3" y="5" width="18" height="14" rx="1.5" />
      <path d="m3.5 6.5 8.5 6 8.5-6" />
    </svg>
  ),
  grad: (
    <svg viewBox="0 0 24 24" {...P}>
      <path d="M2 9.5 12 5l10 4.5L12 14 2 9.5z" />
      <path d="M6.5 11.7V16c0 1.4 2.5 2.8 5.5 2.8s5.5-1.4 5.5-2.8v-4.3M21 10v5" />
    </svg>
  ),
  heart: (
    <svg viewBox="0 0 24 24" {...P}>
      <path d="M12 20.5S4 15 4 9.6C4 6.8 6.2 5 8.5 5c1.6 0 3 .8 3.5 2 .5-1.2 1.9-2 3.5-2C17.8 5 20 6.8 20 9.6c0 5.4-8 10.9-8 10.9z" />
    </svg>
  ),
} satisfies Record<string, ReactNode>;

export type IconName = keyof typeof Icons;

export function Section({
  icon,
  children,
  tone,
}: {
  icon: IconName;
  children: ReactNode;
  tone?: "mag" | "grn" | "amb";
}) {
  return (
    <div className={`sect ${tone ? `sect-${tone}` : ""}`}>
      {Icons[icon]}
      <span className="txt">{children}</span>
    </div>
  );
}
