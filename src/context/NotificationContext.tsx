"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { Notification } from "@/types/public/notification";
import NotificationToast from "@/components/common/NotificationToast";

interface NotificationContextProps {
  showToast: (notification: Notification) => void;
  hideToast: (id: number) => void;
  clearAllToasts: () => void;
}

const NotificationContext = createContext<NotificationContextProps>(
  {} as NotificationContextProps,
);

interface ToastNotification extends Notification {
  toastId: string;
}

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider = ({
  children,
}: NotificationProviderProps) => {
  const router = useRouter();
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const showToast = useCallback((notification: Notification) => {
    const toastId = `toast-${notification.id}-${Date.now()}`;
    const toastNotification: ToastNotification = {
      ...notification,
      toastId,
    };

    setToasts((prev) => [...prev, toastNotification]);
  }, []);

  const hideToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  const handleToastClick = useCallback(
    (notification: Notification) => {
      if (notification.data.action_url) {
        router.push(notification.data.action_url);
      }
    },
    [router],
  );

  const handleToastClose = useCallback((toastId: string) => {
    setToasts((prev) => prev.filter((toast) => toast.toastId !== toastId));
  }, []);

  return (
    <NotificationContext.Provider
      value={{ showToast, hideToast, clearAllToasts }}
    >
      {children}

      {/* Render toasts */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast, index) => (
          <div
            key={toast.toastId}
            style={{ transform: `translateY(${index * 10}px)` }}
          >
            <NotificationToast
              notification={toast}
              onClose={() => handleToastClose(toast.toastId)}
              onClick={() => handleToastClick(toast)}
            />
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotificationToast = () => useContext(NotificationContext);
