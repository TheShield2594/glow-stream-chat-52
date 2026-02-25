import { useState, useEffect } from "react";

function formatRelative(timestamp: string): string {
  // Parse "Today at H:MM PM" format
  const match = timestamp.match(/Today at (\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!match) return timestamp;

  let hours = parseInt(match[1]);
  const minutes = parseInt(match[2]);
  const ampm = match[3].toUpperCase();

  if (ampm === "PM" && hours !== 12) hours += 12;
  if (ampm === "AM" && hours === 12) hours = 0;

  const now = new Date();
  const msgDate = new Date();
  msgDate.setHours(hours, minutes, 0, 0);

  const diffMs = now.getTime() - msgDate.getTime();
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 0) return timestamp;
  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  return timestamp;
}

export function useRelativeTime(timestamp: string) {
  const [display, setDisplay] = useState(() => formatRelative(timestamp));

  useEffect(() => {
    setDisplay(formatRelative(timestamp));
    const id = setInterval(() => setDisplay(formatRelative(timestamp)), 30000);
    return () => clearInterval(id);
  }, [timestamp]);

  return display;
}
