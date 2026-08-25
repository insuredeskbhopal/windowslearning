import React from "react";

interface BrandLogoProps {
  className?: string;
  size?: number;
}

export default function BrandLogo({ className = "", size = 26 }: BrandLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Brand Logo"
    >
      {/* Overlapping organic loops matching the reference aesthetic */}
      <path
        d="M10 11C7.23858 11 5 13.2386 5 16C5 18.7614 7.23858 21 10 21H18C20.7614 21 23 18.7614 23 16C23 13.2386 20.7614 11 18 11H10Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.9"
      />
      <path
        d="M14 11C14 8.23858 16.2386 6 19 6H22C24.7614 6 27 8.23858 27 11C27 13.7614 24.7614 16 22 16H18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.8"
      />
      <path
        d="M18 21C18 23.7614 15.7614 26 13 26H10C7.23858 26 5 23.7614 5 21"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.5"
      />
    </svg>
  );
}
