// src/components/ConnectionStatus.tsx
import { useEffect, useState } from "react";
import { checkHealth } from "../services/apiService";

export default function ConnectionStatus() {
  const [status, setStatus] = useState<"online" | "offline" | "connecting">("connecting");

  useEffect(() => {
    let isMounted = true;

    const checkConnection = async () => {
      try {
        const isHealthy = await checkHealth();
        if (isMounted) {
          setStatus(isHealthy ? "online" : "offline");
        }
      } catch {
        if (isMounted) {
          setStatus("offline");
        }
      }
    };

    // Initial check
    checkConnection();
    
    // Check every 30 seconds
    const interval = setInterval(checkConnection, 30000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const statusConfig = {
    online: {
      className: "bg-green-100 text-green-800 border-green-200",
      icon: "🟢",
      text: "Connected",
    },
    offline: {
      className: "bg-red-100 text-red-800 border-red-200",
      icon: "🔴",
      text: "Offline",
    },
    connecting: {
      className: "bg-yellow-100 text-yellow-800 border-yellow-200",
      icon: "🟡",
      text: "Connecting...",
    },
  };

  const config = statusConfig[status];

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className={`px-3 py-2 rounded-lg text-sm font-medium border shadow-sm ${config.className}`}>
        <span className="flex items-center gap-2">
          <span>{config.icon}</span>
          {config.text}
        </span>
      </div>
    </div>
  );
}