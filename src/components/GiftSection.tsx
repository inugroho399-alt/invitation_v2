'use client';

import React, { useState } from 'react';
import { weddingConfig } from '@/lib/weddingConfig';

export default function GiftSection() {
  const [activeTab, setActiveTab] = useState<'cashless' | 'gift' | null>(null);

  const accounts = weddingConfig.cashlessAccounts;

  return (
    <>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={() => setActiveTab(activeTab === 'cashless' ? null : 'cashless')}
          className="btn-gift btn btn-block btn-primary rounded-pill reveal-bottom reveal-d3"
          style={{ maxWidth: '150px', margin: 'auto', fontSize: '14.4px' }}
        >
          Cashless
        </button>
        <button
          onClick={() => setActiveTab(activeTab === 'gift' ? null : 'gift')}
          className="btn-gift btn btn-block btn-primary rounded-pill reveal-bottom reveal-d3"
          style={{ maxWidth: '150px', margin: 'auto', fontSize: '14.4px' }}
        >
          Kirim Kado
        </button>
      </div>

      {activeTab === 'cashless' && (
        <div className="gift-container mt-3 p-4 rounded reveal-scale reveal-d4">
          <div className="d-flex">
            <div className="mx-auto">
              {accounts.map((acc, index) => (
                <div key={index} className={`d-flex align-items-center ${index === 0 ? 'mb-3' : ''}`}>
                  <div style={{ width: '80px', overflow: 'hidden' }} className="image-editable">
                    <img src={acc.logo} style={{ width: '100%', height: '100%', objectFit: 'contain' }} alt={acc.bank} />
                  </div>
                  <div className="text-left pl-2">
                    <div className="editable account-number font-weight-bold h5 mb-0" style={{ fontSize: '18px' }}>{acc.number}</div>
                    <div className="editable" style={{ fontSize: '14.4px' }}>{acc.bank} : {acc.name}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'gift' && (
        <div className="gift-container mt-3 p-4 rounded reveal-scale reveal-d4">
          <div className="text-center mb-2">
            <div className="editable font-weight-bold h5 color-accent mb-2">Kirim Kado</div>
            <div className="editable mb-0" style={{ fontSize: '14.4px', whiteSpace: 'pre-wrap' }}>
              Anda dapat mengirim kado ke:<br />
              {weddingConfig.giftAddress}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
