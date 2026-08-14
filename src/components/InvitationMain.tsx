'use client';

import React, { useState, useEffect, useRef } from 'react';
import MusicPlayer from './MusicPlayer';
import Countdown from './Countdown';
import RSVPModal from './RSVPModal';
import GiftSection from './GiftSection';
import { RSVPData } from '@/lib/supabaseClient';
import { weddingConfig } from '@/lib/weddingConfig';

interface InvitationMainProps {
  initialRsvps: RSVPData[];
  onAddRSVP: (data: RSVPData) => Promise<RSVPData>;
}

export default function InvitationMain({ initialRsvps, onAddRSVP }: InvitationMainProps) {
  const [isOpened, setIsOpened] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRsvpOpen, setIsRsvpOpen] = useState(false);
  const [guestName, setGuestName] = useState('Nama Tamu');
  const [rsvps, setRsvps] = useState<RSVPData[]>(initialRsvps);
  const [doorsOpen, setDoorsOpen] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);
  const [slideKey, setSlideKey] = useState(0);

  const lastScrollTime = useRef(0);
  const touchStartY = useRef(0);
  const navListRef = useRef<HTMLUListElement>(null);
  const MAX_SLIDES = 9;

  const navigateToNextSlide = () => {
    setActiveSlide((prev) => {
      if (prev >= MAX_SLIDES) return prev;
      setSlideKey((k) => k + 1);
      return prev + 1;
    });
  };

  const navigateToPrevSlide = () => {
    setActiveSlide((prev) => {
      if (prev <= 1) return prev; // Cannot go back to slide 0 (opening)
      setSlideKey((k) => k + 1);
      return prev - 1;
    });
  };

  useEffect(() => {
    if (!isOpened) return; // Only allow scrolling if invitation is opened

    const handleWheel = (e: WheelEvent) => {
      // Prevent scrolling if the RSVP modal is open or the user is scrolling inside a specific div
      if (isRsvpOpen) return;
      
      const now = Date.now();
      if (now - lastScrollTime.current < 1200) return; // 1.2s cooldown

      if (e.deltaY > 50) {
        lastScrollTime.current = now;
        navigateToNextSlide();
      } else if (e.deltaY < -50) {
        lastScrollTime.current = now;
        navigateToPrevSlide();
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isRsvpOpen) return;
      
      const touchEndY = e.changedTouches[0].clientY;
      const deltaY = touchStartY.current - touchEndY;
      
      const now = Date.now();
      if (now - lastScrollTime.current < 1200) return;

      if (deltaY > 50) { // Swipe up (scroll down) -> Next
        lastScrollTime.current = now;
        navigateToNextSlide();
      } else if (deltaY < -50) { // Swipe down (scroll up) -> Prev
        lastScrollTime.current = now;
        navigateToPrevSlide();
      }
    };

    window.addEventListener('wheel', handleWheel);
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isOpened, isRsvpOpen]);

  // Precisely scroll the nav bar so the active item is centered, without over-shooting on edges
  useEffect(() => {
    const nav = navListRef.current;
    if (!nav) return;

    const activeEl = nav.children[activeSlide] as HTMLElement;
    if (!activeEl) return;

    const navWidth = nav.offsetWidth;
    const itemOffsetLeft = activeEl.offsetLeft;
    const itemWidth = activeEl.offsetWidth;
    const targetScroll = itemOffsetLeft - navWidth / 2 + itemWidth / 2;
    const maxScroll = nav.scrollWidth - navWidth;

    nav.scrollTo({
      left: Math.max(0, Math.min(targetScroll, maxScroll)),
      behavior: 'smooth',
    });
  }, [activeSlide]);

  useEffect(() => {
    if (!isOpened) {
      // State is already reset to false in the click handler, so it renders closed instantly.
      // We just need to trigger the opening animations after a short delay.
      const timer = setTimeout(() => {
        setDoorsOpen(true);
      }, 50); // Almost instant, just enough to trigger CSS transition
      // Content reveals slightly after doors start opening
      const contentTimer = setTimeout(() => {
        setContentVisible(true);
      }, 750);
      
      return () => { clearTimeout(timer); clearTimeout(contentTimer); };
    }
  }, [isOpened, slideKey]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const to = params.get('to');
      if (to) {
        setGuestName(to);
      }
    }
  }, []);

  const handleOpenInvitation = () => {
    setIsPlaying(true);
    setIsOpened(true);
    setActiveSlide(1);
    setSlideKey(k => k + 1); // Trigger entrance animations on the Quotes slide
  };

  const handleAddRSVPLocal = async (data: RSVPData) => {
    const saved = await onAddRSVP(data);
    setRsvps((prev) => [saved, ...prev]);
  };

  const navItemClass = (idx: number) => {
    return `satumomen_menu_item ${activeSlide === idx ? 'active' : ''}`;
  };

  const goToSlide = (idx: number) => {
    if (activeSlide === idx) return;
    setSlideKey(k => k + 1);
    setActiveSlide(idx);
  };

  return (
    <main id="app">
      <RSVPModal isOpen={isRsvpOpen} onClose={() => setIsRsvpOpen(false)} rsvps={rsvps} onAddRSVP={handleAddRSVPLocal} />
      
      <div id="workspace-container" className="position-fixed h-100 w-100" style={{ overflow: 'hidden' }}>
        <div id="panZoom" className="position-fixed h-100 w-100" style={{ top: 0, right: 0, bottom: 0, left: 0, transformOrigin: '50% 50%' }}>
          <div className="h-100 w-100 d-flex align-items-center justify-content-center">
            <div className={`canvas ${!isOpened ? 'not-open' : ''}`}>
              <MusicPlayer isPlaying={isPlaying} onToggle={(play) => setIsPlaying(play)} />
              <div id="satuMomen" data-guest={guestName} data-group="">
                <div className="satumomen_track">
                  <ul className="satumomen_list">
                    
                    {/* SLIDE 0: Cover */}
                    <li className="satumomen_slide satumomen_cover" style={{ display: isOpened && activeSlide !== 0 ? 'none' : 'block' }}>
                      <div className="container-mobile cover" style={{ backgroundImage: "url('/assets/bg.jpg')" }}>
                        <div key={slideKey} className="frame">
                          <img className={`frame-tl ${contentVisible ? 'reveal-tl' : 'opacity-0'}`} src="/assets/frame-tl.png" alt="frame" />
                          <img className={`frame-tr ${contentVisible ? 'reveal-tr' : 'opacity-0'}`} src="/assets/frame-tr.png" alt="frame" />
                          <img className={`frame-tl h-100 ${contentVisible ? 'reveal-left' : 'opacity-0'}`} src="/assets/mid-left.png" alt="frame" />
                          <img className={`frame-tr h-100 ${contentVisible ? 'reveal-right' : 'opacity-0'}`} src="/assets/mid-right.png" alt="frame" />
                          <img className={`frame-bl ${contentVisible ? 'reveal-bl' : 'opacity-0'}`} src="/assets/frame-bl.png" alt="frame" />
                          <img className={`frame-br ${contentVisible ? 'reveal-br' : 'opacity-0'}`} src="/assets/frame-br.png" alt="frame" />
                          <img 
                            src="/assets/door-left.png" 
                            alt="frame" 
                            fetchPriority="high"
                            style={{ 
                              display: 'block', 
                              position: 'absolute', 
                              top: 0, 
                              left: 0, 
                              height: '100%', 
                              width: '50%', 
                              zIndex: 99, 
                              transition: 'transform 1.7s ease-in-out',
                              transform: doorsOpen ? 'translateX(-100%)' : 'translateX(0)'
                            }} 
                          />
                          <img 
                            src="/assets/door-right.png" 
                            alt="frame" 
                            fetchPriority="high"
                            style={{ 
                              display: 'block', 
                              position: 'absolute', 
                              top: 0, 
                              right: 0, 
                              height: '100%', 
                              width: '50%', 
                              zIndex: 99, 
                              transition: 'transform 1.7s ease-in-out',
                              transform: doorsOpen ? 'translateX(100%)' : 'translateX(0)'
                            }} 
                          />
                        </div>
                        <div className="d-flex justify-content-center align-items-center" style={{ height: 'calc(100% + 60px)', width: 'calc(100% + 60px)', backgroundSize: 'cover', margin: '-30px', padding: '30px' }}>
                          <div style={{ width: '100%' }}>
                            <div className={`text-center editable mb-4 ${contentVisible ? 'reveal-top reveal-d1' : 'opacity-0'}`} style={{ fontSize: '20px' }}>{weddingConfig.resepsi.dayName}<br />{weddingConfig.resepsi.dateStr} {weddingConfig.resepsi.monthStr} {weddingConfig.resepsi.yearStr}</div>
                            <div className={`text-center mb-3 image-editable ${contentVisible ? 'reveal-scale reveal-d2' : 'opacity-0'}`}>
                              <img src="/assets/couple-graphic.png" width="200" height="200" loading="eager" fetchPriority="high" className="mx-auto d-block" style={{ width: '70%', height: 'auto' }} alt="couple" />
                            </div>
                            <div className={`text-center mb-5 ${contentVisible ? 'reveal-bottom reveal-d3' : 'opacity-0'}`}>
                              <div className="editable color-accent h3 mb-0 font-accent" style={{ fontSize: '40px' }}>{weddingConfig.groom.nickname} &amp; {weddingConfig.bride.nickname}</div>
                              <div className="editable" style={{ fontSize: '15px' }}>SAVE THE DATE</div>
                            </div>
                            <div className="text-center mx-auto" style={{ maxWidth: '300px' }}>
                              <div className={`text-center mb-3 p-2 ${contentVisible ? 'reveal-bottom reveal-d4' : 'opacity-0'}`}>
                                <div className="editable mb-1" style={{ fontSize: '14px' }}>Kepada Yth;<br />Bapak/Ibu/Saudara/i</div>
                                <div id="guestNameSlot" className="editable color-accent h5 font-weight-bold mb-1" style={{ fontSize: '16px' }}>{guestName}</div>
                              </div>
                              <button onClick={handleOpenInvitation} className={`btn-open-invitation btn btn-primary rounded-pill mb-4 ${contentVisible ? 'reveal-bottom reveal-d5' : 'opacity-0'}`} style={{ fontSize: '14px' }}>Open Invitation</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>

                    {/* SLIDE 1: Quotes */}
                    <li className="satumomen_slide" style={{ display: isOpened && activeSlide === 1 ? 'block' : 'none' }}>
                      <div className="container-mobile" style={{ backgroundImage: "url('/assets/bg.jpg')" }}>
                        <div key={slideKey} className="frame">
                          <img className="frame-tl reveal-tl" src="/assets/frame-tl.png" alt="frame" />
                          <img className="frame-tr reveal-tr" src="/assets/frame-tr.png" alt="frame" />
                          <img className="frame-tl h-100 reveal-left" src="/assets/mid-left.png" alt="frame" />
                          <img className="frame-tr h-100 reveal-right" src="/assets/mid-right.png" alt="frame" />
                          <img className="frame-bl reveal-bl" src="/assets/frame-bl.png" alt="frame" />
                          <img className="frame-br reveal-br" src="/assets/frame-br.png" alt="frame" />
                        </div>
                        <div key={slideKey} className="d-flex flex-column justify-content-center align-items-center" style={{ height: '100%' }}>
                          <div className="reveal-top reveal-d1 mb-4" style={{ border: '3px solid var(--inv-border)', padding: '0.1rem', borderRadius: '1.3rem' }}>
                            <div className="d-flex justify-content-center" style={{ border: '2px solid var(--inv-border)', borderRadius: '1rem', maxWidth: '65px', padding: '20px 5px' }}>
                              <div className="editable color-accent h3 mb-0 font-accent" style={{ fontSize: '40px', transform: 'translate(10px, -10px)' }}>{weddingConfig.groom.initial}</div>
                              <div className="editable color-accent h3 mb-0 font-accent" style={{ fontSize: '40px', transform: 'translate(-10px, 10px)' }}>{weddingConfig.bride.initial}</div>
                            </div>
                          </div>
                          <div className="reveal-bottom reveal-d2">
                            <div className="text-center" style={{ maxWidth: '250px' }}>
                              <div className="editable quotes mb-3" style={{ fontSize: '14.4px', lineHeight: 2 }}>
                                Dan di antara tanda-tanda kekuasaan-Nva ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya diantaramu rasa kasih dan sayang. Sesungguhnya pada yang demikian itu benar-benar terdapat tanda-tanda bagi kaum vang berfikir.
                              </div>
                              <div className="editable font-italic" style={{ fontSize: '14.4px' }}>(Ar-Rum: 21)</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>

                    {/* SLIDE 2: Mempelai */}
                    <li className="satumomen_slide" style={{ display: isOpened && activeSlide === 2 ? 'block' : 'none' }}>
                      <div className="container-mobile" style={{ backgroundImage: "url('/assets/bg.jpg')" }}>
                        <div key={slideKey} className="frame">
                          <img className="frame-tl reveal-tl" src="/assets/frame-tl.png" alt="frame" />
                          <img className="frame-tr reveal-tr" src="/assets/frame-tr.png" alt="frame" />
                          <img className="frame-tl h-100 reveal-left" src="/assets/mid-left.png" alt="frame" />
                          <img className="frame-tr h-100 reveal-right" src="/assets/mid-right.png" alt="frame" />
                          <img className="frame-bl reveal-bl" src="/assets/frame-bl.png" alt="frame" />
                          <img className="frame-br reveal-br" src="/assets/frame-br.png" alt="frame" />
                        </div>
                        <div key={slideKey} className="d-flex justify-content-center align-items-center" style={{ height: '100%' }}>
                          <div>
                            <div className="editable mb-2 text-center reveal-top reveal-d1 font-italic" style={{ fontSize: '14.4px' }}>Bismillahirrahmanirrahim</div>
                            <div className="editable text-center reveal-top reveal-d2" style={{ fontSize: '14.4px' }}>Dengan memohon Rahmat<br />dan Ridho Allah Subhanahu wa ta'ala kami bermaksud menyelenggarakan Ngunduh Mantu<br />Pernikahan Putra-Putri kami</div>
                            <div className="mt-4">
                              <div className="text-center reveal-left reveal-d3" style={{ position: 'relative' }}>
                                <div className="editable color-accent h4 mb-2 font-weight-bold" style={{ fontSize: '16px' }}>{weddingConfig.groom.fullName}</div>
                                <div className="editable" style={{ fontSize: '14.4px', whiteSpace: 'pre-wrap' }}>{weddingConfig.groom.parents}</div>
                              </div>
                              <div className="my-3 editable text-center color-accent reveal-scale reveal-d4 font-italic font-accent" style={{ fontSize: '14px', color: 'rgb(164, 124, 28)' }}>dengan</div>
                              <div className="text-center reveal-right reveal-d5" style={{ position: 'relative' }}>
                                <div className="editable color-accent h4 mb-2 font-weight-bold" style={{ fontSize: '16px' }}>{weddingConfig.bride.fullName}</div>
                                <div className="editable mb-1" style={{ fontSize: '14.4px', whiteSpace: 'pre-wrap' }}>{weddingConfig.bride.parents}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>

                    {/* SLIDE 3: Akad Nikah */}
                    <li className="satumomen_slide" style={{ display: isOpened && activeSlide === 3 ? 'block' : 'none' }}>
                      <div className="container-mobile" style={{ backgroundImage: "url('/assets/bg.jpg')" }}>
                        <div key={slideKey} className="frame">
                          <img className="frame-tl reveal-tl" src="/assets/frame-tl.png" alt="frame" />
                          <img className="frame-tr reveal-tr" src="/assets/frame-tr.png" alt="frame" />
                          <img className="frame-tl h-100 reveal-left" src="/assets/mid-left.png" alt="frame" />
                          <img className="frame-tr h-100 reveal-right" src="/assets/mid-right.png" alt="frame" />
                          <img className="frame-bl reveal-bl" src="/assets/frame-bl.png" alt="frame" />
                          <img className="frame-br reveal-br" src="/assets/frame-br.png" alt="frame" />
                        </div>
                        <div key={slideKey} className="d-flex justify-content-center align-items-center" style={{ height: '100%' }}>
                          <div style={{ width: '100%' }}>
                            <div className="text-center mb-3">
                              <div className="editable color-accent h4 mb-2 reveal-top reveal-d2 font-accent" style={{ fontSize: '30px' }}>Akad Nikah<br />sudah terlaksana pada :</div>
                              <div className="my-3 d-flex flex-row justify-content-center align-items-center reveal-scale reveal-d1">
                                <div className="editable" style={{ fontSize: '25px', width: '100px' }}>{weddingConfig.akad.dayName}</div>
                                <div style={{ borderLeft: '2px solid var(--inv-accent)', borderRight: '2px solid var(--inv-accent)' }} className="px-3">
                                  <div className="editable" style={{ fontSize: '38px', lineHeight: 1 }}>{weddingConfig.akad.dateStr}</div>
                                  <div className="editable" style={{ fontSize: '18px' }}>{weddingConfig.akad.yearStr}</div>
                                </div>
                                <div className="editable" style={{ fontSize: '25px', width: '100px' }}>{weddingConfig.akad.monthStr}</div>
                              </div>
                              <div className="editable reveal-top reveal-d2" style={{ fontSize: '18px' }}>{weddingConfig.akad.time}</div>
                            </div>
                            <div className="text-center">
                              <div className="editable font-accent color-accent reveal-bottom reveal-d3" style={{ fontSize: '18px' }}>Lokasi Acara</div>
                              <div className="editable font-weight-bold reveal-bottom reveal-d3" style={{ fontSize: '14.4px' }}>{weddingConfig.akad.locationName}</div>
                              <div className="editable mb-4 reveal-bottom reveal-d3" style={{ fontSize: '14.4px' }}>{weddingConfig.akad.address}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>

                    {/* SLIDE 4: Ngunduh Mantu */}
                    <li className="satumomen_slide" style={{ display: isOpened && activeSlide === 4 ? 'block' : 'none' }}>
                      <div className="container-mobile" style={{ backgroundImage: "url('/assets/bg.jpg')" }}>
                        <div key={slideKey} className="frame">
                          <img className="frame-tl reveal-tl" src="/assets/frame-tl.png" alt="frame" />
                          <img className="frame-tr reveal-tr" src="/assets/frame-tr.png" alt="frame" />
                          <img className="frame-tl h-100 reveal-left" src="/assets/mid-left.png" alt="frame" />
                          <img className="frame-tr h-100 reveal-right" src="/assets/mid-right.png" alt="frame" />
                          <img className="frame-bl reveal-bl" src="/assets/frame-bl.png" alt="frame" />
                          <img className="frame-br reveal-br" src="/assets/frame-br.png" alt="frame" />
                        </div>
                        <div key={slideKey} className="d-flex justify-content-center align-items-center" style={{ height: '100%' }}>
                          <div style={{ width: '100%' }}>
                            <div className="text-center mb-3">
                              <div className="editable color-accent h4 mb-2 reveal-top reveal-d2 font-accent" style={{ fontSize: '40px' }}>{weddingConfig.resepsi.title}</div>
                              <div className="my-3 d-flex flex-row justify-content-center align-items-center reveal-scale reveal-d1">
                                <div className="editable" style={{ fontSize: '25px', width: '100px' }}>{weddingConfig.resepsi.dayName}</div>
                                <div style={{ borderLeft: '2px solid var(--inv-accent)', borderRight: '2px solid var(--inv-accent)' }} className="px-3">
                                  <div className="editable" style={{ fontSize: '38px', lineHeight: 1 }}>{weddingConfig.resepsi.dateStr}</div>
                                  <div className="editable" style={{ fontSize: '18px' }}>{weddingConfig.resepsi.yearStr}</div>
                                </div>
                                <div className="editable" style={{ fontSize: '25px', width: '100px' }}>{weddingConfig.resepsi.monthStr}</div>
                              </div>
                              <div className="editable reveal-top reveal-d2" style={{ fontSize: '18px' }}>{weddingConfig.resepsi.time}</div>
                            </div>
                            <div className="text-center">
                              <div className="editable font-accent color-accent reveal-bottom reveal-d3" style={{ fontSize: '18px' }}>Lokasi Acara</div>
                              <div className="editable font-weight-bold reveal-bottom reveal-d3" style={{ fontSize: '18px' }}>{weddingConfig.resepsi.locationName}</div>
                              <div className="editable mb-4 reveal-bottom reveal-d3" style={{ fontSize: '14.4px' }}>{weddingConfig.resepsi.address}</div>
                              <a href={weddingConfig.resepsi.mapLink} target="_blank" className="link btn btn-primary rounded-pill reveal-bottom reveal-d3" rel="noreferrer noopener">Link Google Maps</a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>

                    {/* SLIDE 5: RSVP & Countdown */}
                    <li className="satumomen_slide" style={{ display: isOpened && activeSlide === 5 ? 'block' : 'none' }}>
                      <div className="container-mobile" style={{ backgroundImage: "url('/assets/bg.jpg')" }}>
                        <div key={slideKey} className="frame">
                          <img className="frame-tl reveal-tl" src="/assets/frame-tl.png" alt="frame" />
                          <img className="frame-tr reveal-tr" src="/assets/frame-tr.png" alt="frame" />
                          <img className="frame-tl h-100 reveal-left" src="/assets/mid-left.png" alt="frame" />
                          <img className="frame-tr h-100 reveal-right" src="/assets/mid-right.png" alt="frame" />
                          <img className="frame-bl reveal-bl" src="/assets/frame-bl.png" alt="frame" />
                          <img className="frame-br reveal-br" src="/assets/frame-br.png" alt="frame" />
                        </div>
                        <div key={slideKey} className="d-flex flex-column justify-content-center align-items-center" style={{ height: '100%' }}>
                          <div className="reveal-scale reveal-d1 mb-4" style={{ border: '3px solid var(--inv-border)', padding: '0.1rem', borderRadius: '1.3rem' }}>
                            <div className="d-flex justify-content-center" style={{ border: '2px solid var(--inv-border)', borderRadius: '1rem', maxWidth: '65px', padding: '20px 5px' }}>
                              <div className="editable color-accent h3 mb-0 font-accent" style={{ fontSize: '40px', transform: 'translate(10px, -10px)' }}>i</div>
                              <div className="editable color-accent h3 mb-0 font-accent" style={{ fontSize: '40px', transform: 'translate(-10px, 10px)' }}>h</div>
                            </div>
                          </div>
                          <div style={{ width: '100%' }}>
                            <div className="text-center color-accent h4 mb-4 editable reveal-top reveal-d2 font-accent" style={{ fontSize: '21.6px' }}>Menghitung Hari</div>
                            <div className="countdown-wrapper mx-auto mb-5 d-flex flex-column reveal-bottom reveal-d3" style={{ maxWidth: '280px', minWidth: '280px' }}>
                              <Countdown targetDate={weddingConfig.countdownTarget} />
                            </div>
                            <div>
                              <div className="text-center">
                                <div className="editable mb-4 reveal-bottom reveal-d3" style={{ fontSize: '12px' }}>Kirim ucapan untuk mempelai<br />dan konfirmasi kehadiran</div>
                                <button onClick={() => setIsRsvpOpen(true)} className="btn-rsvp btn btn-primary mx-auto rounded-pill mb-4 reveal-bottom reveal-d3" style={{ gap: '8px' }}>
                                  Kirim Ucapan RSVP
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>

                    {/* SLIDE 6: Maps */}
                    <li className="satumomen_slide" style={{ display: isOpened && activeSlide === 6 ? 'block' : 'none' }}>
                      <div className="container-mobile" style={{ backgroundImage: "url('/assets/bg.jpg')" }}>
                        <div key={slideKey} className="frame">
                          <img className="frame-tl reveal-tl" src="/assets/frame-tl.png" alt="frame" />
                          <img className="frame-tr reveal-tr" src="/assets/frame-tr.png" alt="frame" />
                          <img className="frame-tl h-100 reveal-left" src="/assets/mid-left.png" alt="frame" />
                          <img className="frame-tr h-100 reveal-right" src="/assets/mid-right.png" alt="frame" />
                          <img className="frame-bl reveal-bl" src="/assets/frame-bl.png" alt="frame" />
                          <img className="frame-br reveal-br" src="/assets/frame-br.png" alt="frame" />
                        </div>
                        <div key={slideKey} className="d-flex justify-content-center align-items-center" style={{ height: '100%' }}>
                          <div style={{ width: '100%' }}>
                            <div className="editable text-center color-accent mb-3 reveal-top reveal-d2 font-italic" style={{ fontSize: '42px' }}>Maps</div>
                            <div>
                              <div className="p-1 mb-3 reveal-scale reveal-d4" style={{ borderRadius: '2.5rem', overflow: 'hidden', position: 'relative', border: '4px solid var(--inv-base)' }}>
                                <div className="image-editable reveal-top reveal-d2" style={{ width: '100%', margin: 'auto', borderRadius: '2rem', overflow: 'hidden', paddingBottom: '70%', position: 'relative', border: '2px solid var(--inv-base)' }}>
                                  <img src="/assets/maps-preview.jpg" loading="lazy" width="300" height="210" className="w-100 h-100" style={{ position: 'absolute', objectFit: 'cover' }} alt="maps" />
                                </div>
                              </div>
                              <div className="text-center reveal-bottom reveal-d3">
                                <div className="editable color-accent font-weight-bold" style={{ fontSize: '20px' }}>{weddingConfig.resepsi.locationName}</div>
                                <div className="editable mb-3 font-italic" style={{ fontSize: '15px' }}>{weddingConfig.resepsi.address}</div>
                                <a href={weddingConfig.resepsi.mapLink} target="_blank" rel="nofollow noreferrer noopener" className="link btn btn-primary mb-4 reveal-bottom reveal-d3" style={{ borderRadius: '0.3rem' }}>Petunjuk Ke Lokasi</a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>

                    {/* SLIDE 7: Gift */}
                    <li className="satumomen_slide" style={{ display: isOpened && activeSlide === 7 ? 'block' : 'none' }}>
                      <div className="container-mobile" style={{ backgroundImage: "url('/assets/bg.jpg')" }}>
                        <div key={slideKey} className="frame">
                          <img className="frame-tl reveal-tl" src="/assets/frame-tl.png" alt="frame" />
                          <img className="frame-tr reveal-tr" src="/assets/frame-tr.png" alt="frame" />
                          <img className="frame-tl h-100 reveal-left" src="/assets/mid-left.png" alt="frame" />
                          <img className="frame-tr h-100 reveal-right" src="/assets/mid-right.png" alt="frame" />
                          <img className="frame-bl reveal-bl" src="/assets/frame-bl.png" alt="frame" />
                          <img className="frame-br reveal-br" src="/assets/frame-br.png" alt="frame" />
                        </div>
                        <div key={slideKey} className="d-flex justify-content-center align-items-center" style={{ height: '100%' }}>
                          <div style={{ width: '100%' }} className="text-center">
                            <div className="font-accent color-accent h4 mb-2 editable reveal-top reveal-d2" style={{ fontSize: '28.8px' }}>Tanda Kasih</div>
                            <div className="editable mb-4 reveal-top reveal-d2" style={{ fontSize: '14.4px' }}>Terima kasih telah menambah semangat kegembiraan pernikahan kami dengan kehadiran dan hadiah indah Anda.</div>
                            <GiftSection />
                          </div>
                        </div>
                      </div>
                    </li>

                    {/* SLIDE 8: Contact Person */}
                    <li className="satumomen_slide" style={{ display: isOpened && activeSlide === 8 ? 'block' : 'none' }}>
                      <div className="container-mobile" style={{ backgroundImage: "url('/assets/bg.jpg')" }}>
                        <div key={slideKey} className="frame">
                          <img className="frame-tl reveal-tl" src="/assets/frame-tl.png" alt="frame" />
                          <img className="frame-tr reveal-tr" src="/assets/frame-tr.png" alt="frame" />
                          <img className="frame-tl h-100 reveal-left" src="/assets/mid-left.png" alt="frame" />
                          <img className="frame-tr h-100 reveal-right" src="/assets/mid-right.png" alt="frame" />
                          <img className="frame-bl reveal-bl" src="/assets/frame-bl.png" alt="frame" />
                          <img className="frame-br reveal-br" src="/assets/frame-br.png" alt="frame" />
                        </div>
                        <div key={slideKey} className="d-flex justify-content-center align-items-center" style={{ height: '100%' }}>
                          <div>
                            <div className="font-accent text-center color-accent h4 mb-2 editable reveal-top reveal-d2">Contact Person</div>
                            <div className="editable mb-4 text-center reveal-bottom reveal-d3" style={{ fontSize: '14.4px' }}>Hubungi Contact Person kami jika ada hal<br />yang ingin ditanyakan.</div>
                            
                            <div className="text-center reveal-bottom reveal-d3 mb-4">
                              <div className="image-editable reveal-bottom reveal-d3" style={{ height: '100px', width: '100px', margin: 'auto', borderRadius: '100%', overflow: 'hidden', marginBottom: '10px' }}>
                                <img src={weddingConfig.contacts[0].photo} loading="lazy" width="100" height="100" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={weddingConfig.contacts[0].name} />
                              </div>
                              <div className="editable color-accent h4 mb-2 reveal-bottom reveal-d3 font-accent" style={{ fontSize: '21.6px' }}>{weddingConfig.contacts[0].name}</div>
                              <a className="link btn btn-primary rounded-pill reveal-bottom reveal-d3" href={weddingConfig.contacts[0].waLink} target="_blank" rel="noreferrer noopener">WA {weddingConfig.contacts[0].phone}</a>
                            </div>

                            <div className="text-center reveal-bottom reveal-d3">
                              <div className="image-editable reveal-bottom reveal-d3" style={{ height: '100px', width: '100px', margin: 'auto', borderRadius: '100%', overflow: 'hidden', marginBottom: '10px' }}>
                                <img src={weddingConfig.contacts[1].photo} loading="lazy" width="100" height="100" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={weddingConfig.contacts[1].name} />
                              </div>
                              <div className="editable color-accent h4 mb-2 reveal-bottom reveal-d3 font-accent" style={{ fontSize: '21.6px' }}>{weddingConfig.contacts[1].name}</div>
                              <a className="link btn btn-primary rounded-pill reveal-bottom reveal-d3" href={weddingConfig.contacts[1].waLink} target="_blank" rel="noreferrer noopener">WA {weddingConfig.contacts[1].phone}</a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>

                    {/* SLIDE 9: Thanks */}
                    <li className="satumomen_slide" style={{ display: isOpened && activeSlide === 9 ? 'block' : 'none' }}>
                      <div className="container-mobile" style={{ backgroundImage: "url('/assets/bg.jpg')" }}>
                        <div key={slideKey} className="frame">
                          <img className="frame-tl reveal-tl" src="/assets/frame-tl.png" alt="frame" />
                          <img className="frame-tr reveal-tr" src="/assets/frame-tr.png" alt="frame" />
                          <img className="frame-tl h-100 reveal-left" src="/assets/mid-left.png" alt="frame" />
                          <img className="frame-tr h-100 reveal-right" src="/assets/mid-right.png" alt="frame" />
                          <img className="frame-bl reveal-bl" src="/assets/frame-bl.png" alt="frame" />
                          <img className="frame-br reveal-br" src="/assets/frame-br.png" alt="frame" />
                        </div>
                        <div key={slideKey} className="watermark d-flex flex-column align-items-center justify-content-center" style={{ height: '100%' }}>
                          <div style={{ border: '3px solid var(--inv-border)', padding: '0.1rem', borderRadius: '1.3rem' }} className="reveal-scale reveal-d1 mb-4">
                            <div className="d-flex justify-content-center" style={{ border: '2px solid var(--inv-border)', borderRadius: '1rem', maxWidth: '65px', padding: '20px 5px' }}>
                              <div className="editable color-accent h3 mb-0 font-accent" style={{ fontSize: '40px', transform: 'translate(10px, -10px)' }}>{weddingConfig.groom.initial}</div>
                              <div className="editable color-accent h3 mb-0 font-accent" style={{ fontSize: '40px', transform: 'translate(-10px, 10px)' }}>{weddingConfig.bride.initial}</div>
                            </div>
                          </div>

                          <div style={{ width: '100%' }}>
                            <div className="text-center">
                              <div className="editable mb-3 reveal-top reveal-d2" style={{ fontSize: '14px' }}>Merupakan suatu kebahagiaan dan kehormatan bagi kami, apabila Bapak/Ibu/Saudara/i, berkenan hadir dan memberikan do'a restu kepada kedua mempelai.</div>
                              <div className="editable font-italic reveal-top reveal-d2" style={{ fontSize: '14px' }}>Hormat Kami Yang Mengundang</div>
                              <div className="editable h4 color-accent reveal-top reveal-d2 font-accent" style={{ fontSize: '30px' }}>{weddingConfig.groom.nickname} &amp; {weddingConfig.bride.nickname}</div>
                            </div>
                          </div>
                          
                          <div className="mt-5 text-center">
                            <p className="mb-1 reveal-bottom reveal-d3 small animate__delay-1s">Made With ♥ by</p>
                            <div className="reveal-bottom reveal-d3 animate__delay-1s">
                              <a className="d-block mx-auto font-weight-bold color-accent font-accent" href="#" target="_blank" rel="noopener noreferrer" style={{ fontSize: '24px', textDecoration: 'none' }}>
                                Linvitation station
                              </a>
                            </div>
                            <div className="wm-music mt-3 text-center reveal-bottom reveal-d3 animate__delay-1s" style={{ fontSize: '60%' }}>
                              <div style={{ opacity: 0.5 }}><strong>Music:</strong></div>
                              <div style={{ opacity: 0.5 }}>Java instrument</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>

                <div id="smMenu" className="satumomen_menu" style={{ display: isOpened ? 'block' : 'none' }}>
                  <ul ref={navListRef} className="satumomen_menu_list">
                    <li className={navItemClass(0)} onClick={() => { 
                      if (activeSlide === 0) return;
                      setDoorsOpen(false); 
                      setContentVisible(false); 
                      setSlideKey(k => k + 1); 
                      setIsOpened(false); 
                      setActiveSlide(0); 
                    }}>
                      <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.144 20.782v-3.067c0-.777.632-1.408 1.414-1.413h2.875c.786 0 1.423.633 1.423 1.413v3.058c0 .674.548 1.222 1.227 1.227h1.96a3.46 3.46 0 0 0 2.444-1 3.41 3.41 0 0 0 1.013-2.422V9.866c0-.735-.328-1.431-.895-1.902l-6.662-5.29a3.115 3.115 0 0 0-3.958.071L3.467 7.963A2.474 2.474 0 0 0 2.5 9.867v8.703C2.5 20.464 4.047 22 5.956 22h1.916c.327.002.641-.125.873-.354.232-.228.363-.54.363-.864h.036Z" fill="currentColor"></path></svg>
                      <span>Opening</span>
                    </li>
                    <li className={navItemClass(1)} onClick={() => goToSlide(1)}>
                      <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg"><path opacity=".4" d="M16.191 2H7.81C4.77 2 3 3.78 3 6.83v10.33C3 20.26 4.77 22 7.81 22h8.381C19.28 22 21 20.26 21 17.16V6.83C21 3.78 19.28 2 16.191 2" fill="currentColor"></path><path fillRule="evenodd" clipRule="evenodd" d="M8.08 6.65v.01a.78.78 0 0 0 0 1.56h2.989c.431 0 .781-.35.781-.791a.781.781 0 0 0-.781-.779H8.08Zm7.84 6.09H8.08a.78.78 0 0 1 0-1.561h7.84a.781.781 0 0 1 0 1.561Zm0 4.57H8.08c-.3.04-.59-.11-.75-.36a.795.795 0 0 1 .75-1.21h7.84c.399.04.7.38.7.79 0 .399-.301.74-.7.78Z" fill="currentColor"></path></svg>
                      <span>Quotes</span>
                    </li>
                    <li className={navItemClass(2)} onClick={() => goToSlide(2)}>
                      <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg"><path opacity=".4" d="M11.776 21.837a36.258 36.258 0 0 1-6.328-4.957 12.668 12.668 0 0 1-3.03-4.805C1.278 8.535 2.603 4.49 6.3 3.288A6.282 6.282 0 0 1 12.007 4.3a6.291 6.291 0 0 1 5.706-1.012c3.697 1.201 5.03 5.247 3.893 8.787a12.67 12.67 0 0 1-3.013 4.805 36.58 36.58 0 0 1-6.328 4.957l-.25.163-.24-.163Z" fill="currentColor"></path><path d="m12.01 22-.234-.163a36.316 36.316 0 0 1-6.337-4.957 12.667 12.667 0 0 1-3.048-4.805c-1.13-3.54.195-7.586 3.892-8.787a6.296 6.296 0 0 1 5.728 1.023V22ZM18.23 10a.719.719 0 0 1-.517-.278.818.818 0 0 1-.167-.592c.022-.702-.378-1.341-.994-1.59-.391-.107-.628-.53-.53-.948.093-.41.477-.666.864-.573a.384.384 0 0 1 .138.052c1.236.476 2.036 1.755 1.973 3.155a.808.808 0 0 1-.23.56.708.708 0 0 1-.537.213Z" fill="currentColor"></path></svg>
                      <span>Mempelai</span>
                    </li>
                    <li className={navItemClass(3)} onClick={() => goToSlide(3)}>
                      <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M3 16.87V9.257h18v7.674C21 20.07 19.024 22 15.863 22H8.127C4.996 22 3 20.03 3 16.87Zm4.96-2.46a.822.822 0 0 1-.85-.799c0-.46.355-.84.81-.861.444 0 .81.351.82.8a.822.822 0 0 1-.78.86Zm4.06 0a.822.822 0 0 1-.85-.799c0-.46.356-.84.81-.861.445 0 .81.351.82.8a.822.822 0 0 1-.78.86Zm4.03 3.68a.847.847 0 0 1-.82-.85.831.831 0 0 1 .81-.849h.01c.465 0 .84.38.84.849 0 .47-.375.85-.84.85Zm-4.88-.85c.02.46.395.821.85.8a.821.821 0 0 0 .78-.859.817.817 0 0 0-.82-.801.855.855 0 0 0-.81.86Zm-4.07 0c.02.46.395.821.85.8a.821.821 0 0 0 .78-.859.817.817 0 0 0-.82-.801.855.855 0 0 0-.81.86Zm8.14-3.639c0-.46.356-.83.81-.84.445 0 .8.359.82.8a.82.82 0 0 1-.79.849.814.814 0 0 1-.84-.799v-.01Z" fill="currentColor"></path><path opacity=".4" d="M3.003 9.257c.013-.587.063-1.752.156-2.127.474-2.11 2.084-3.45 4.386-3.64h8.911c2.282.2 3.912 1.55 4.386 3.64.092.365.142 1.539.155 2.127H3.003Z" fill="currentColor"></path><path d="M8.305 6.59c.435 0 .76-.329.76-.77V2.771A.748.748 0 0 0 8.306 2c-.435 0-.76.33-.76.771V5.82c0 .441.325.77.76.77ZM15.695 6.59c.425 0 .76-.329.76-.77V2.771a.754.754 0 0 0-.76-.771c-.435 0-.76.33-.76.771V5.82c0 .441.325.77.76.77Z" fill="currentColor"></path></svg>
                      <span>Akad</span>
                    </li>
                    <li className={navItemClass(4)} onClick={() => goToSlide(4)}>
                      <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M3 16.87V9.257h18v7.674C21 20.07 19.024 22 15.863 22H8.127C4.996 22 3 20.03 3 16.87Zm4.96-2.46a.822.822 0 0 1-.85-.799c0-.46.355-.84.81-.861.444 0 .81.351.82.8a.822.822 0 0 1-.78.86Zm4.06 0a.822.822 0 0 1-.85-.799c0-.46.356-.84.81-.861.445 0 .81.351.82.8a.822.822 0 0 1-.78.86Zm4.03 3.68a.847.847 0 0 1-.82-.85.831.831 0 0 1 .81-.849h.01c.465 0 .84.38.84.849 0 .47-.375.85-.84.85Zm-4.88-.85c.02.46.395.821.85.8a.821.821 0 0 0 .78-.859.817.817 0 0 0-.82-.801.855.855 0 0 0-.81.86Zm-4.07 0c.02.46.395.821.85.8a.821.821 0 0 0 .78-.859.817.817 0 0 0-.82-.801.855.855 0 0 0-.81.86Zm8.14-3.639c0-.46.356-.83.81-.84.445 0 .8.359.82.8a.82.82 0 0 1-.79.849.814.814 0 0 1-.84-.799v-.01Z" fill="currentColor"></path><path opacity=".4" d="M3.003 9.257c.013-.587.063-1.752.156-2.127.474-2.11 2.084-3.45 4.386-3.64h8.911c2.282.2 3.912 1.55 4.386 3.64.092.365.142 1.539.155 2.127H3.003Z" fill="currentColor"></path><path d="M8.305 6.59c.435 0 .76-.329.76-.77V2.771A.748.748 0 0 0 8.306 2c-.435 0-.76.33-.76.771V5.82c0 .441.325.77.76.77ZM15.695 6.59c.425 0 .76-.329.76-.77V2.771a.754.754 0 0 0-.76-.771c-.435 0-.76.33-.76.771V5.82c0 .441.325.77.76.77Z" fill="currentColor"></path></svg>
                      <span>Ngunduh</span>
                    </li>
                    <li className={navItemClass(5)} onClick={() => goToSlide(5)}>
                      <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg"><path opacity=".4" d="M12.02 2C6.21 2 2 6.74 2 12c0 1.68.49 3.41 1.35 4.99.16.26.18.59.07.9l-.67 2.24c-.15.54.31.94.82.78l2.02-.6c.55-.18.98.05 1.491.36 1.46.86 3.279 1.3 4.919 1.3 4.96 0 10-3.83 10-10C22 6.65 17.7 2 12.02 2Z" fill="currentColor"></path><path fillRule="evenodd" clipRule="evenodd" d="M11.98 13.29c-.71-.01-1.28-.58-1.28-1.29 0-.7.58-1.28 1.28-1.27.71 0 1.28.57 1.28 1.28 0 .7-.57 1.28-1.28 1.28Zm-4.61 0c-.7 0-1.28-.58-1.28-1.28 0-.71.57-1.28 1.28-1.28.71 0 1.28.57 1.28 1.28 0 .7-.57 1.27-1.28 1.28Zm7.94-1.28c0 .7.57 1.28 1.28 1.28.71 0 1.28-.58 1.28-1.28 0-.71-.57-1.28-1.28-1.28-.71 0-1.28.57-1.28 1.28Z" fill="currentColor"></path></svg>
                      <span>RSVP</span>
                    </li>
                    <li className={navItemClass(6)} onClick={() => goToSlide(6)}>
                      <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M8.532 2.937a6.89 6.89 0 0 1 7.034.058C17.71 4.327 19.012 6.705 19 9.26c-.05 2.54-1.447 4.929-3.193 6.775a18.727 18.727 0 0 1-3.358 2.82 1.173 1.173 0 0 1-.408.144.82.82 0 0 1-.39-.119 18.515 18.515 0 0 1-4.839-4.547A9.28 9.28 0 0 1 5 9.134c-.001-2.562 1.347-4.928 3.532-6.197Zm1.262 7.258a2.378 2.378 0 0 0 2.198 1.497 2.339 2.339 0 0 0 1.683-.701c.446-.454.696-1.07.694-1.713a2.423 2.423 0 0 0-1.462-2.243 2.346 2.346 0 0 0-2.594.52 2.455 2.455 0 0 0-.519 2.64Z" fill="currentColor"></path></svg>
                      <span>Maps</span>
                    </li>
                    <li className={navItemClass(7)} onClick={() => goToSlide(7)}>
                      <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg"><path opacity=".4" d="M16.191 2H7.81C4.77 2 3 3.78 3 6.83v10.33C3 20.26 4.77 22 7.81 22h8.381C19.28 22 21 20.26 21 17.16V6.83C21 3.78 19.28 2 16.191 2" fill="currentColor"></path><path fillRule="evenodd" clipRule="evenodd" d="M8.08 6.65v.01a.78.78 0 0 0 0 1.56h2.989c.431 0 .781-.35.781-.791a.781.781 0 0 0-.781-.779H8.08Zm7.84 6.09H8.08a.78.78 0 0 1 0-1.561h7.84a.781.781 0 0 1 0 1.561Zm0 4.57H8.08c-.3.04-.59-.11-.75-.36a.795.795 0 0 1 .75-1.21h7.84c.399.04.7.38.7.79 0 .399-.301.74-.7.78Z" fill="currentColor"></path></svg>
                      <span>Gift</span>
                    </li>
                    <li className={navItemClass(8)} onClick={() => goToSlide(8)}>
                      <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg"><path opacity=".4" d="M12.02 2C6.21 2 2 6.74 2 12c0 1.68.49 3.41 1.35 4.99.16.26.18.59.07.9l-.67 2.24c-.15.54.31.94.82.78l2.02-.6c.55-.18.98.05 1.491.36 1.46.86 3.279 1.3 4.919 1.3 4.96 0 10-3.83 10-10C22 6.65 17.7 2 12.02 2Z" fill="currentColor"></path><path fillRule="evenodd" clipRule="evenodd" d="M11.98 13.29c-.71-.01-1.28-.58-1.28-1.29 0-.7.58-1.28 1.28-1.27.71 0 1.28.57 1.28 1.28 0 .7-.57 1.28-1.28 1.28Zm-4.61 0c-.7 0-1.28-.58-1.28-1.28 0-.71.57-1.28 1.28-1.28.71 0 1.28.57 1.28 1.28 0 .7-.57 1.27-1.28 1.28Zm7.94-1.28c0 .7.57 1.28 1.28 1.28.71 0 1.28-.58 1.28-1.28 0-.71-.57-1.28-1.28-1.28-.71 0-1.28.57-1.28 1.28Z" fill="currentColor"></path></svg>
                      <span>Contact</span>
                    </li>
                    <li className={navItemClass(9)} onClick={() => goToSlide(9)}>
                      <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg"><path opacity=".4" d="M16.34 2H7.67C4.28 2 2 4.38 2 7.92v8.17C2 19.62 4.28 22 7.67 22h8.67c3.39 0 5.66-2.38 5.66-5.91V7.92C22 4.38 19.73 2 16.34 2Z" fill="currentColor"></path><path d="M10.813 15.248a.872.872 0 0 1-.619-.256l-2.373-2.373a.874.874 0 1 1 1.237-1.238l1.755 1.755 4.128-4.128a.874.874 0 1 1 1.237 1.238l-4.746 4.746a.872.872 0 0 1-.619.256Z" fill="currentColor"></path></svg>
                      <span>Thanks</span>
                    </li>
                  </ul>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
