import React from "react";
import { Loader2, RefreshCw, CircleDot, RotateCw } from "lucide-react";

type LoadingType = "spinner" | "dots" | "pulse" | "bars" | "rotate" | "bounce";
type LoadingSize = "sm" | "md" | "lg" | "xl";
type LoadingVariant =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "error"
  | "white";

interface LoadingProps {
  /** Văn bản hiển thị bên cạnh loading */
  text?: string;
  /** Loại animation loading */
  type?: LoadingType;
  /** Kích thước của loading */
  size?: LoadingSize;
  /** Màu sắc/variant của loading */
  variant?: LoadingVariant;
  /** Hiển thị loading toàn màn hình */
  fullScreen?: boolean;
  /** Hiển thị loading overlay */
  overlay?: boolean;
  /** CSS class tùy chỉnh */
  className?: string;
  /** CSS class cho container */
  containerClassName?: string;
  /** CSS class cho text */
  textClassName?: string;
  /** Hiển thị loading inline */
  inline?: boolean;
  /** Vô hiệu hóa text */
  hideText?: boolean;
}

const Loading: React.FC<LoadingProps> = ({
  text = "Loading",
  type = "spinner",
  size = "md",
  variant = "primary",
  fullScreen = false,
  overlay = false,
  className = "",
  containerClassName = "",
  textClassName = "",
  inline = false,
  hideText = false,
}) => {
  // Size configurations
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  };

  // Variant color configurations
  const variantClasses = {
    primary: "text-blue-600",
    secondary: "text-gray-600",
    success: "text-green-600",
    warning: "text-yellow-600",
    error: "text-red-600",
    white: "text-white",
  };

  // Animation components
  const SpinnerLoader = () => (
    <Loader2
      className={`${sizeClasses[size]} ${variantClasses[variant]} animate-spin`}
    />
  );

  const DotsLoader = () => (
    <div className="flex space-x-1">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`${
            size === "sm"
              ? "w-2 h-2"
              : size === "md"
              ? "w-3 h-3"
              : size === "lg"
              ? "w-4 h-4"
              : "w-5 h-5"
          } 
                     ${variantClasses[variant].replace(
                       "text-",
                       "bg-"
                     )} rounded-full animate-bounce`}
          style={{ animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </div>
  );

  const PulseLoader = () => (
    <div
      className={`${sizeClasses[size]} ${variantClasses[variant].replace(
        "text-",
        "bg-"
      )} rounded-full animate-pulse`}
    />
  );

  const BarsLoader = () => (
    <div className="flex space-x-1">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className={`${
            size === "sm"
              ? "w-1 h-4"
              : size === "md"
              ? "w-1 h-6"
              : size === "lg"
              ? "w-1.5 h-8"
              : "w-2 h-10"
          } 
                     ${variantClasses[variant].replace(
                       "text-",
                       "bg-"
                     )} animate-pulse`}
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );

  const RotateLoader = () => (
    <RefreshCw
      className={`${sizeClasses[size]} ${variantClasses[variant]} animate-spin`}
    />
  );

  const BounceLoader = () => (
    <div className="flex space-x-1">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`${
            size === "sm"
              ? "w-2 h-2"
              : size === "md"
              ? "w-3 h-3"
              : size === "lg"
              ? "w-4 h-4"
              : "w-5 h-5"
          } 
                     ${variantClasses[variant].replace(
                       "text-",
                       "bg-"
                     )} rounded-full`}
          style={{
            animation: `bounce 1.4s ease-in-out ${i * 0.16}s infinite both`,
          }}
        />
      ))}
    </div>
  );

  // Render appropriate loader
  const renderLoader = () => {
    switch (type) {
      case "spinner":
        return <SpinnerLoader />;
      case "dots":
        return <DotsLoader />;
      case "pulse":
        return <PulseLoader />;
      case "bars":
        return <BarsLoader />;
      case "rotate":
        return <RotateLoader />;
      case "bounce":
        return <BounceLoader />;
      default:
        return <SpinnerLoader />;
    }
  };

  // Container classes
  const getContainerClasses = () => {
    let classes = "flex items-center justify-center";

    if (inline) {
      classes += " inline-flex";
    } else if (fullScreen) {
      classes += " fixed inset-0 z-50";
      if (overlay) {
        classes += " bg-black/20 backdrop-blur-sm transition-all";
      }
    } else {
      classes += " w-full h-full min-h-[100px]";
    }

    return `${classes} ${containerClassName}`;
  };

  // Content classes
  const getContentClasses = () => {
    let classes = "flex items-center";

    if (inline) {
      classes += " gap-2";
    } else {
      classes += " flex-col gap-3";
    }

    return `${classes} ${className}`;
  };

  // Text classes
  const getTextClasses = () => {
    return `${textSizeClasses[size]} ${variantClasses[variant]} font-medium ${textClassName}`;
  };

  return (
    <div className={getContainerClasses()}>
      <div className={getContentClasses()}>
        {renderLoader()}
        {!hideText && text && <span className={getTextClasses()}>{text}</span>}
      </div>
    </div>
  );
};

// Pre-configured loading components for common use cases
export const PageLoading: React.FC<{ text?: string }> = ({
  text = "Loading page...",
}) => <Loading text={text} fullScreen overlay variant="white" size="lg" />;

export const ButtonLoading: React.FC<{ text?: string }> = ({
  text = "Loading...",
}) => <Loading text={text} inline size="sm" hideText />;

export const CardLoading: React.FC<{ text?: string }> = ({
  text = "Loading content...",
}) => <Loading text={text} type="pulse" variant="secondary" />;

export const FormLoading: React.FC<{ text?: string }> = ({
  text = "Submitting...",
}) => <Loading text={text} type="spinner" size="sm" inline variant="primary" />;

export const DataLoading: React.FC<{ text?: string }> = ({
  text = "Loading data...",
}) => <Loading text={text} type="dots" variant="primary" size="md" />;

export default Loading;
