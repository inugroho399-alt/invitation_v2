'use client';

import React, { useState, useEffect } from 'react';

interface CountdownProps {
  targetDate: string; // ISO format like '2025-05-12T09:00:00'
}

export default function Countdown({ targetDate }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTime = () => {
      const difference = +new Date(targetDate) - +new Date();
      let timeLeftData = { days: 0, hours: 0, minutes: 0, seconds: 0 };

      if (difference > 0) {
        timeLeftData = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }
      setTimeLeft(timeLeftData);
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  const formatNumber = (num: number) => {
    return num.toString().padStart(2, '0');
  };

  return (
    <div className="countdown text-center">
      <div className="countdown-item day bg-white" style={{ color: 'var(--inv-accent)', border: '1px solid var(--inv-accent)' }}>
        <div className="number">{formatNumber(timeLeft.days)}</div>
        <div className="text editable">Hari</div>
      </div>
      <div className="countdown-item hour bg-white" style={{ color: 'var(--inv-accent)', border: '1px solid var(--inv-accent)' }}>
        <div className="number">{formatNumber(timeLeft.hours)}</div>
        <div className="text editable">Jam</div>
      </div>
      <div className="countdown-item minute bg-white" style={{ color: 'var(--inv-accent)', border: '1px solid var(--inv-accent)' }}>
        <div className="number">{formatNumber(timeLeft.minutes)}</div>
        <div className="text editable">Menit</div>
      </div>
      <div className="countdown-item second bg-white" style={{ color: 'var(--inv-accent)', border: '1px solid var(--inv-accent)' }}>
        <div className="number">{formatNumber(timeLeft.seconds)}</div>
        <div className="text editable">Detik</div>
      </div>
    </div>
  );
}
