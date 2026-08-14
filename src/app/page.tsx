'use client';

import React, { useEffect, useState, Suspense } from 'react';
import InvitationMain from '@/components/InvitationMain';
import { rsvpService, RSVPData } from '@/lib/supabaseClient';
import { weddingConfig } from '@/lib/weddingConfig';

function InvitationLoader() {
  const [rsvps, setRsvps] = useState<RSVPData[]>([]);

  useEffect(() => {
    // Fetch in background, DO NOT block initial render
    const loadData = async () => {
      try {
        const data = await rsvpService.getRSVPs();
        setRsvps(data);
      } catch (err) {
        console.error('Failed to load RSVPs:', err);
      }
    };
    loadData();
  }, []);

  const handleAddRSVP = async (data: RSVPData) => {
    return rsvpService.addRSVP(data);
  };

  return <InvitationMain initialRsvps={rsvps} onAddRSVP={handleAddRSVP} />;
}

export default function Home() {
  return (
    <Suspense fallback={<div className="w-full min-h-screen bg-[#2b1b19]" />}>
      <InvitationLoader />
    </Suspense>
  );
}
