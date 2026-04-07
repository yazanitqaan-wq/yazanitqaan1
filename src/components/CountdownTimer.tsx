import React, { useState, useEffect } from 'react';
import { differenceInSeconds } from 'date-fns';

interface CountdownTimerProps {
  targetDate: string;
  onComplete?: () => void;
}

export default function CountdownTimer({ targetDate, onComplete }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const target = new Date(targetDate);
      const now = new Date();
      const diff = differenceInSeconds(target, now);

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        if (onComplete) onComplete();
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (3600 * 24)),
        hours: Math.floor((diff % (3600 * 24)) / 3600),
        minutes: Math.floor((diff % 3600) / 60),
        seconds: diff % 60,
      });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate, onComplete]);

  if (!timeLeft) return null;

  if (timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0) {
    return <div className="text-green-600 font-bold text-lg">الامتحان متاح الآن!</div>;
  }

  return (
    <div className="flex items-center justify-center gap-4 text-center" dir="ltr">
      <div className="flex flex-col items-center">
        <div className="bg-blue-600 text-white w-12 h-12 sm:w-16 sm:h-16 rounded-lg flex items-center justify-center text-xl sm:text-2xl font-bold shadow-md">
          {timeLeft.days.toString().padStart(2, '0')}
        </div>
        <span className="text-xs sm:text-sm text-gray-500 mt-1 font-medium">أيام</span>
      </div>
      <div className="text-2xl font-bold text-gray-400 mb-6">:</div>
      <div className="flex flex-col items-center">
        <div className="bg-blue-600 text-white w-12 h-12 sm:w-16 sm:h-16 rounded-lg flex items-center justify-center text-xl sm:text-2xl font-bold shadow-md">
          {timeLeft.hours.toString().padStart(2, '0')}
        </div>
        <span className="text-xs sm:text-sm text-gray-500 mt-1 font-medium">ساعات</span>
      </div>
      <div className="text-2xl font-bold text-gray-400 mb-6">:</div>
      <div className="flex flex-col items-center">
        <div className="bg-blue-600 text-white w-12 h-12 sm:w-16 sm:h-16 rounded-lg flex items-center justify-center text-xl sm:text-2xl font-bold shadow-md">
          {timeLeft.minutes.toString().padStart(2, '0')}
        </div>
        <span className="text-xs sm:text-sm text-gray-500 mt-1 font-medium">دقائق</span>
      </div>
      <div className="text-2xl font-bold text-gray-400 mb-6">:</div>
      <div className="flex flex-col items-center">
        <div className="bg-blue-600 text-white w-12 h-12 sm:w-16 sm:h-16 rounded-lg flex items-center justify-center text-xl sm:text-2xl font-bold shadow-md">
          {timeLeft.seconds.toString().padStart(2, '0')}
        </div>
        <span className="text-xs sm:text-sm text-gray-500 mt-1 font-medium">ثواني</span>
      </div>
    </div>
  );
}
