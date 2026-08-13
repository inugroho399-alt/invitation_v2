'use client';

import React, { useEffect, useState, Suspense } from 'react';
import InvitationMain from '@/components/InvitationMain';
import { rsvpService, RSVPData } from '@/lib/supabaseClient';

function InvitationLoader() {
  const [rsvps, setRsvps] = useState<RSVPData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await rsvpService.getRSVPs();
        setRsvps(data);
      } catch (err) {
        console.error('Failed to load RSVPs:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleAddRSVP = async (data: RSVPData) => {
    return rsvpService.addRSVP(data);
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-[#2b1b19] flex flex-col justify-center items-center text-[#B6A38B] gap-4">
        <div className="w-10 h-10 border-4 border-[#B6A38B] border-t-transparent rounded-full animate-spin" />
        <p className="font-accent tracking-widest text-sm animate-pulse">Memuat Undangan...</p>
      </div>
    );
  }

  return <InvitationMain initialRsvps={rsvps} onAddRSVP={handleAddRSVP} />;
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="w-full min-h-screen bg-[#2b1b19] flex flex-col justify-center items-center text-[#B6A38B] gap-4">
        <div className="w-10 h-10 border-4 border-[#B6A38B] border-t-transparent rounded-full animate-spin" />
        <p className="font-accent tracking-widest text-sm animate-pulse">Memuat Undangan...</p>
      </div>
    }>
      <InvitationLoader />
    </Suspense>
  );
}
