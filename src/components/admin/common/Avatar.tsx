"use client";

import { getInitials, generateAvatarColor } from "@/utils/admin";

interface AvatarProps {
  src?: string;
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
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
