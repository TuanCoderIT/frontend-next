import Echo from "laravel-echo";
import Pusher from "pusher-js";

let echoInstance: Echo<any> | null = null;

export const getEcho = (): Echo<any> => {
  if (echoInstance) return echoInstance;

  if (typeof window === "undefined") {
    throw new Error("Echo can only be initialized on client side");
  }

  // BẮT BUỘC
  (window as any).Pusher = Pusher;

  const token = localStorage.getItem("token");

  echoInstance = new Echo({
    broadcaster: "reverb",
    key: process.env.NEXT_PUBLIC_REVERB_APP_KEY!,
    wsHost: process.env.NEXT_PUBLIC_REVERB_HOST || "localhost",
    wsPort: parseInt(process.env.NEXT_PUBLIC_REVERB_PORT || "8080"),
    wssPort: parseInt(process.env.NEXT_PUBLIC_REVERB_PORT || "8080"),
    forceTLS: process.env.NEXT_PUBLIC_REVERB_SCHEME === "https",
    enabledTransports: ["ws"],
    disableStats: true,
    // authEndpoint: `${process.env.NEXT_PUBLIC_API_URL}/broadcasting/auth`,
    authEndpoint: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/broadcasting/auth`,
    auth: {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    },
  });
  (window as any).Echo = echoInstance;

  return echoInstance;
};

export const disconnectEcho = (): void => {
  if (echoInstance) {
    echoInstance.disconnect();
    echoInstance = null;
  }
};
