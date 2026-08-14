'use client';

import React, { useEffect, useState, Suspense } from 'react';
import InvitationMain from '@/components/InvitationMain';
import { rsvpService, RSVPData } from '@/lib/supabaseClient';
import { weddingConfig } from '@/lib/weddingConfig';

function InvitationLoader() {
  const [rsvps, setRsvps] = useState<RSVPData[]>([]);
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    // Fetch in background, DO NOT block initial render based on network
    const loadData = async () => {
      try {
        const data = await rsvpService.getRSVPs();
        setRsvps(data);
      } catch (err) {
        console.error('Failed to load RSVPs:', err);
      }
    };
    loadData();

    // Show elegant loader for 600ms for a snappy, premium intro feel
    const timer = setTimeout(() => setShowLoader(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const handleAddRSVP = async (data: RSVPData) => {
    return rsvpService.addRSVP(data);
  };

  if (showLoader) {
    return (
      <div className="w-full min-h-screen bg-[#2b1b19] flex flex-col justify-center items-center text-[#B6A38B] gap-6">
        <div className="relative flex justify-center items-center w-24 h-24">
          <div className="absolute inset-0 border-[3px] border-[#B6A38B] rounded-full animate-ping opacity-20"></div>
          <div className="absolute inset-2 border-[2px] border-[#B6A38B] rounded-full animate-pulse opacity-50"></div>
          <div className="font-accent text-3xl font-bold tracking-widest text-center" style={{ textShadow: '0 0 15px rgba(182, 163, 139, 0.5)' }}>
            {weddingConfig.groom.initial}&{weddingConfig.bride.initial}
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <p className="font-accent tracking-widest text-lg animate-pulse">Menyiapkan Undangan</p>
          <div className="flex gap-1">
            <span className="w-2 h-2 bg-[#B6A38B] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
            <span className="w-2 h-2 bg-[#B6A38B] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
            <span className="w-2 h-2 bg-[#B6A38B] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
          </div>
        </div>
      </div>
    );
  }

  return <InvitationMain initialRsvps={rsvps} onAddRSVP={handleAddRSVP} />;
}

export default function Home() {
  return (
    <Suspense fallback={<div className="w-full min-h-screen bg-[#2b1b19]" />}>
      <InvitationLoader />
    </Suspense>
  );
}
