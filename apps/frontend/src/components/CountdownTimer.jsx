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
    <div className="flex items-center justify-center space-x-3">
      {/* Days */}
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 md:w-16 md:h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border-2 border-white/30 shadow-lg">
          <span className="text-lg md:text-2xl font-bold text-white">
            {timeLeft.days}
          </span>
        </div>
        <span className="text-white text-sm md:text-base font-medium mt-2">Days</span>
      </div>

      {/* Separator */}
      <div className="text-white text-2xl font-bold">:</div>

      {/* Hours */}
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 md:w-16 md:h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border-2 border-white/30 shadow-lg">
          <span className="text-lg md:text-2xl font-bold text-white">
            {timeLeft.hours.toString().padStart(2, '0')}
          </span>
        </div>
        <span className="text-white text-sm md:text-base font-medium mt-2">Hours</span>
      </div>

      {/* Separator */}
      <div className="text-white text-2xl font-bold">:</div>

      {/* Minutes */}
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 md:w-16 md:h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border-2 border-white/30 shadow-lg">
          <span className="text-lg md:text-2xl font-bold text-white">
            {timeLeft.minutes.toString().padStart(2, '0')}
          </span>
        </div>
        <span className="text-white text-sm md:text-base font-medium mt-2">Minutes</span>
      </div>

      {/* Separator */}
      <div className="text-white text-2xl font-bold">:</div>

      {/* Seconds */}
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 md:w-16 md:h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border-2 border-white/30 shadow-lg">
          <span className="text-lg md:text-2xl font-bold text-white">
            {timeLeft.seconds.toString().padStart(2, '0')}
          </span>
        </div>
        <span className="text-white text-sm md:text-base font-medium mt-2">Seconds</span>
      </div>
    </div>
  );
} 