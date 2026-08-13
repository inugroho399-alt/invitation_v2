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
      <div className="modal fade show" id="rsvpModal" tabIndex={-1} role="dialog" style={{ display: 'block' }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content p-4" style={{ height: '100%' }}>
            
            <div className="text-center mb-4">
              <h5 className="font-accent color-accent" style={{ fontSize: '24px' }}>Kirim Ucapan RSVP</h5>
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
              <button type="submit" className="btn btn-primary btn-block rounded-pill w-100" disabled={isSubmitting}>
                {isSubmitting ? 'Mengirim...' : 'Kirim'}
              </button>
            </form>

            <div className="comments-section" style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {rsvps.map((rsvp, idx) => (
                <div key={idx} className="comment-item p-3 mb-2 rounded" style={{ border: '1px solid var(--inv-border)', backgroundColor: 'var(--inv-bg)' }}>
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

            <button onClick={onClose} type="button" className="btn btn-close">
              <svg xmlns="http://www.w3.org/2000/svg" height="42px" width="42px" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
