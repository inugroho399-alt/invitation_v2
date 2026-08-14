'use client';

import React, { useState } from 'react';
import { RSVPData } from '@/lib/supabaseClient';

interface RSVPModalProps {
  isOpen: boolean;
  onClose: () => void;
  rsvps: RSVPData[];
  onAddRSVP: (data: RSVPData) => Promise<void>;
}

export default function RSVPModal({ isOpen, onClose, rsvps, onAddRSVP }: RSVPModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    attendance: 'Hadir',
    comment: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.comment) return;

    setIsSubmitting(true);
    try {
      await onAddRSVP(formData);
      setFormData({ name: '', attendance: 'Hadir', comment: '' });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="modal-backdrop fade show" style={{ display: 'block' }}></div>
      <div className="modal fade show" id="rsvpModal" tabIndex={-1} role="dialog" style={{ display: 'block', overflowY: 'auto' }}>
        <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '580px', width: '92%', margin: '1.5rem auto' }}>
          <div className="modal-content p-4" style={{ backgroundColor: '#2b1b19', border: '1px solid var(--inv-border)', borderRadius: '1.2rem', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', width: '100%' }}>
            
            <div className="text-center mb-4">
              <h5 className="font-accent color-accent" style={{ fontSize: '26px' }}>Kirim Ucapan RSVP</h5>
            </div>

            <form onSubmit={handleSubmit} className="mb-4">
              <div className="form-group mb-3">
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Nama" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group mb-3">
                <select 
                  className="form-control"
                  value={formData.attendance}
                  onChange={(e) => setFormData({ ...formData, attendance: e.target.value })}
                >
                  <option value="Hadir">Hadir</option>
                  <option value="Tidak Hadir">Tidak Hadir</option>
                </select>
              </div>
              <div className="form-group mb-3">
                <textarea 
                  className="form-control" 
                  rows={3} 
                  placeholder="Komentar atau Ucapan"
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  required
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary btn-block rounded-pill w-100 py-2 font-weight-bold" disabled={isSubmitting} style={{ fontSize: '15px' }}>
                {isSubmitting ? 'Mengirim...' : 'Kirim'}
              </button>
            </form>

            <div className="comments-section" style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {rsvps.map((rsvp, idx) => (
                <div key={idx} className="comment-item p-3 mb-2 rounded" style={{ border: '1px solid var(--inv-border)', backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <strong className="color-accent">{rsvp.name}</strong>
                    <span className="badge badge-primary bg-primary text-white" style={{ fontSize: '10px' }}>{rsvp.attendance}</span>
                  </div>
                  <p className="mb-1" style={{ fontSize: '14px', color: 'var(--inv-base)' }}>{rsvp.comment}</p>
                  <small style={{ color: 'var(--menu-inactive)', fontSize: '11px' }}>
                    {rsvp.created_at ? new Date(rsvp.created_at).toLocaleDateString('id-ID') : ''}
                  </small>
                </div>
              ))}
            </div>

            {/* Tombol X Tutup di Bawah */}
            <div className="d-flex justify-content-center mt-4">
              <button 
                onClick={onClose} 
                type="button" 
                className="btn btn-close-modal"
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(182, 163, 139, 0.2)',
                  border: '1.5px solid var(--inv-border)',
                  color: 'var(--inv-base)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
                }}
                aria-label="Tutup"
              >
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" width="24px" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
