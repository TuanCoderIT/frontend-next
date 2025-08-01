"use client";

import { getInitials, generateAvatarColor } from "@/utils/admin";

interface AvatarProps {
  src?: string;
  name: string;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl";
  className?: string;
}

export default function Avatar({
  src,
  name,
  size = "md",
  className = "",
}: AvatarProps) {
  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
    xl: "w-16 h-16 text-lg",
    "2xl": "w-20 h-20 text-xl",
    "3xl": "w-24 h-24 text-2xl",
    "4xl": "w-28 h-28 text-3xl",
    "5xl": "w-32 h-32 text-4xl",
  };

  const avatarColor = generateAvatarColor(name);

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`${sizeClasses[size]} rounded-full object-cover ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} ${avatarColor} rounded-full flex items-center justify-center 
                 font-semibold text-white ${className}`}
    >
      {getInitials(name)}
    </div>
  );
}
