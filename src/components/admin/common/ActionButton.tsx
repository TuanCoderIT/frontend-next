"use client";

import { Ban, CircleCheckBig, Eye, SquarePen, Trash2 } from "lucide-react";

interface ActionButtonProps {
  variant:
    | "view"
    | "edit"
    | "delete"
    | "activate"
    | "deactivate"
    | "publish"
    | "primary"
    | "secondary"
    | "danger";
  onClick: () => void;
  disabled?: boolean;
  size?: "sm" | "md";
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

export default function ActionButton({
  variant,
  onClick,
  disabled = false,
  size = "sm",
  icon,
  children,
}: ActionButtonProps) {
  const getButtonConfig = () => {
    const configs = {
      view: {
        icon: <Eye className={size === "sm" ? "w-4 h-4" : "w-5 h-5"} />,
        className:
          "text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 p-1.5 rounded-md transition-colors",
        title: "View",
      },
      edit: {
        icon: <SquarePen className={size === "sm" ? "w-4 h-4" : "w-5 h-5"} />,
        className: "text-green-600 hover:text-green-800 hover:bg-green-50",
        title: "Edit",
      },
      delete: {
        icon: <Trash2 className={size === "sm" ? "w-4 h-4" : "w-5 h-5"} />,
        className:
          "text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 p-1.5 rounded-md transition-colors",
        title: "Delete",
      },
      activate: {
        icon: (
          <CircleCheckBig className={size === "sm" ? "w-4 h-4" : "w-5 h-5"} />
        ),
        className:
          "text-green-600 hover:text-green-800 bg-green-50 hover:bg-green-100 p-1.5 rounded-md transition-colors",
        title: "Activate",
      },
      deactivate: {
        icon: <Ban className={size === "sm" ? "w-4 h-4" : "w-5 h-5"} />,
        className:
          "text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 p-1.5 rounded-md transition-colors",
        title: "Deactivate",
      },
      publish: {
        icon: (
          <svg
            className={size === "sm" ? "w-4 h-4" : "w-5 h-5"}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        ),
        className: "text-purple-600 hover:text-purple-800 hover:bg-purple-50",
        title: "Publish",
      },
      primary: {
        icon: icon || null,
        className: "bg-blue-600 text-white hover:bg-blue-700 px-4 py-2",
        title: "Primary Action",
      },
      secondary: {
        icon: icon || null,
        className: "text-gray-600 hover:text-gray-800 hover:bg-gray-50",
        title: "Secondary Action",
      },
      danger: {
        icon: icon || null,
        className: "text-red-600 hover:text-red-800 hover:bg-red-50",
        title: "Delete Action",
      },
    };

    return configs[variant as keyof typeof configs];
  };

  const config = getButtonConfig();
  const sizeClass = size === "sm" ? "p-2" : "p-2.5";

  // For custom variants with children
  if (
    children &&
    (variant === "primary" || variant === "secondary" || variant === "danger")
  ) {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`flex items-center space-x-2 rounded-lg transition-all duration-200 
                   ${config.className} 
                   ${
                     disabled
                       ? "opacity-50 cursor-not-allowed"
                       : "cursor-pointer"
                   }
                   focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-current`}
      >
        {icon && <span>{icon}</span>}
        {children && <span>{children}</span>}
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={config.title}
      className={`${sizeClass} rounded-lg transition-all duration-200 
                 ${config.className} 
                 ${
                   disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                 }
                 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-current`}
    >
      {config.icon}
    </button>
  );
}
