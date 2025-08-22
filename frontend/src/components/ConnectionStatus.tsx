import { useEffect, useState } from "react";

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL ||
  (import.meta.env.DEV
    ? "http://localhost:8000"
    : "https://your-azure-container-app-url.azurecontainerapps.io");

export default function ConnectionStatus() {
  const [status, setStatus] = useState<"online" | "offline" | "connecting">(
    "connecting"
  );

  useEffect(() => {
    let isMounted = true;

    const checkConnection = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/health`);
        if (!isMounted) return;
        if (response.ok) {
          setStatus("online");
        } else {
          setStatus("offline");
        }
      } catch {
        if (isMounted) setStatus("offline");
      }
    };

    checkConnection();
    const interval = setInterval(checkConnection, 30000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="fixed top-4 right-4">
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium ${
          status === "online"
            ? "bg-green-100 text-green-700"
            : status === "offline"
            ? "bg-red-100 text-red-700"
            : "bg-yellow-100 text-yellow-700"
        }`}
      >
        {status === "online"
          ? "🟢 Connected"
          : status === "offline"
          ? "🔴 Offline"
          : "🟡 Connecting..."}
      </span>
    </div>
  );
}
