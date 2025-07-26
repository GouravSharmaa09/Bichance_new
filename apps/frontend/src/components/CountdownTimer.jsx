import React, { useEffect, useState } from 'react';

function getNextWednesday8pm() {
  const now = new Date();
  const result = new Date(now);
  result.setHours(20, 0, 0, 0); // 8pm
  // 3 = Wednesday
  const day = now.getDay();
  let daysToAdd = (3 - day + 7) % 7;
  if (daysToAdd === 0 && now > result) daysToAdd = 7;
  result.setDate(now.getDate() + daysToAdd);
  return result;
}

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({days:0, hours:0, minutes:0, seconds:0});

  useEffect(() => {
    function update() {
      const target = getNextWednesday8pm();
      const now = new Date();
      const diff = target - now;
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setTimeLeft({ days, hours, minutes, seconds });
    }
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="text-2xl font-bold text-red-600">
      {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
    </span>
  );
} 