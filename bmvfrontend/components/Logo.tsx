import React from "react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  iconClassName?: string;
  textClassName?: string;
  showTagline?: boolean;
  variant?: "light" | "dark";
}

/**
 * Compact tilted ticket icon matching the reference image.
 * Rotated ticket in crimson red containing a white classic building outline.
 */
export function LogoIcon({ className, ...props }: React.ComponentPropsWithoutRef<"svg">) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("w-8 h-8 select-none", className)}
      {...props}
    >
      <g transform="rotate(-15 50 50)">
        {/* Ticket outline: rounded rectangle with circle cutouts on top & bottom sides */}
        <path
          d="M 33.5 17.5 
             H 44 A 6 6 0 0 0 56 17.5 
             H 66.5 
             A 6 6 0 0 1 72.5 23.5 
             V 76.5 
             A 6 6 0 0 1 66.5 82.5 
             H 56 A 6 6 0 0 0 44 82.5 
             H 33.5 
             A 6 6 0 0 1 27.5 76.5 
             V 23.5 
             A 6 6 0 0 1 33.5 17.5 Z"
          fill="#DC2626"
        />
        
        {/* Inside building icon (white columns and pediment) */}
        {/* Pediment (triangle) */}
        <path d="M 38 41 L 62 41 L 50 32 Z" fill="white" />
        {/* Architrave (beam) */}
        <rect x="39" y="42" width="22" height="3" rx="0.5" fill="white" />
        {/* 3 Columns */}
        <rect x="42.5" y="46" width="3" height="11" rx="0.5" fill="white" />
        <rect x="48.5" y="46" width="3" height="11" rx="0.5" fill="white" />
        <rect x="54.5" y="46" width="3" height="11" rx="0.5" fill="white" />
        {/* Base/Stylobate */}
        <rect x="38" y="58" width="24" height="3.5" rx="0.5" fill="white" />
      </g>
    </svg>
  );
}

/**
 * Modern Ticket Logo (Logo 2) with "Book My Venue" typography.
 * Layout fits headers, dashboards, and auth cards.
 */
export function LogoTicket({
  className,
  iconClassName,
  textClassName,
  showTagline = false,
  variant = "light",
}: LogoProps) {
  const isDark = variant === "dark";
  const textColorClass = isDark ? "text-white" : "text-[#1A1A19]";
  const taglineColorClass = isDark ? "text-[#E2E2DE]/75" : "text-[#70706e]";

  return (
    <div className={cn("flex flex-col items-start gap-0.5", className)}>
      <div className="flex items-center gap-2.5">
        <LogoIcon className={cn("w-9 h-9 shrink-0", iconClassName)} />
        <div className={cn("flex flex-col select-none", textClassName)}>
          <span className={cn("text-xl font-bold tracking-tight leading-tight font-sans", textColorClass)}>
            Book<span className="text-[#DC2626]">My</span>
          </span>
          <span className={cn("text-xl font-bold tracking-tight leading-none uppercase font-sans mt-[-2px]", textColorClass)}>
            Venue
          </span>
        </div>
      </div>
      {showTagline && (
        <div className="flex items-center gap-1.5 pl-1 mt-0.5 select-none">
          <span className="h-[1px] w-3 bg-[#DC2626]" />
          <span className={cn("text-[7.5px] uppercase font-extrabold tracking-widest font-sans", taglineColorClass)}>
            Book Your Perfect Venue
          </span>
          <span className="h-[1px] w-3 bg-[#DC2626]" />
        </div>
      )}
    </div>
  );
}

/**
 * Elegant Gazebo Logo (Logo 1) with script-style brand text.
 * Suitable for hero banners, landing page features, and footer sections.
 */
export function LogoGazebo({ className, iconClassName, textClassName, showTagline = false }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-3.5", className)}>
      <svg
        viewBox="0 0 120 90"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("w-14 h-14 shrink-0 text-[#DC2626] select-none", iconClassName)}
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Finial / Spire */}
        <path d="M 60,4 L 60,11" />
        <path d="M 57,11 Q 60,7 63,11 Z" fill="currentColor" />
        
        {/* Tier 1 Roof (Top cap) */}
        <path d="M 48,19 L 72,19 L 60,11 Z" fill="none" />
        
        {/* Tier 2 Roof (Main canopy) */}
        <path d="M 60,19 Q 36,29 15,37 M 60,19 Q 84,30 105,37" />
        <path d="M 15,37 Q 60,31 105,37" />
        {/* Canopy ribs */}
        <path d="M 60,19 Q 48,29 36,36" />
        <path d="M 60,19 Q 72,29 84,36" />
        <path d="M 60,19 L 60,32" />
        
        {/* Main horizontal support beam */}
        <path d="M 18,37 L 102,37" />

        {/* Pillars / Posts */}
        <path d="M 21,37 L 21,77" strokeWidth="2.5" />
        <path d="M 99,37 L 99,77" strokeWidth="2.5" />

        {/* Curtains */}
        {/* Left curtain drape */}
        <path d="M 21,37 C 21,49 23,53 27,53 C 31,53 30,67 29,77" />
        <path d="M 35,37 C 30,45 27,53 27,53 C 23,59 21,69 21,77" />
        <path d="M 25,53 L 29,53" strokeWidth="3" />

        {/* Right curtain drape */}
        <path d="M 99,37 C 99,59 97,53 93,53 C 89,53 90,67 91,77" />
        <path d="M 85,37 C 90,45 93,53 93,53 C 97,59 99,69 99,77" />
        <path d="M 95,53 L 91,53" strokeWidth="3" />

        {/* Table under gazebo */}
        <ellipse cx="60" cy="57" rx="14" ry="2.2" fill="currentColor" opacity="0.1" />
        <path d="M 46,57 L 74,57" strokeWidth="2.5" />
        <path d="M 60,57 L 60,73" />
        <path d="M 60,73 L 54,77 M 60,73 L 66,77" />

        {/* Left Chair */}
        <path d="M 32,62 L 42,62" />
        <path d="M 33,62 C 33,53 41,53 41,62" />
        <path d="M 35,62 L 33,77" />
        <path d="M 40,62 L 42,77" />

        {/* Right Chair */}
        <path d="M 78,62 L 88,62" />
        <path d="M 79,62 C 79,53 87,53 87,62" />
        <path d="M 81,62 L 79,77" />
        <path d="M 86,62 L 88,77" />
      </svg>
      <div className={cn("flex flex-col select-none", textClassName)}>
        <span className="text-xl font-bold tracking-tight text-[#DC2626] font-sans">
          Book My
        </span>
        <span className="text-2xl font-black tracking-normal text-[#DC2626] italic font-serif leading-none mt-[-2px] border-b-2 border-[#DC2626] pb-1">
          Venue
        </span>
      </div>
    </div>
  );
}
