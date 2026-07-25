import { useEffect, useState } from "react";

function getTimeUntilEndOfDay() {
  const now = new Date();
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);

  const diff = Math.max(0, end.getTime() - now.getTime());
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { hours, minutes, seconds };
}

export function useEndOfDayCountdown() {
  const [timeLeft, setTimeLeft] = useState(getTimeUntilEndOfDay);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeUntilEndOfDay());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return timeLeft;
}
