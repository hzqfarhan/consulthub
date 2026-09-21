'use client';

import React, { useEffect } from 'react';
import { useConsultHub } from '@/lib/context';
import { X } from 'lucide-react';

export default function Modal() {
  const { modal, closeModal } = useConsultHub();

  useEffect(() => {
    if (modal.isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [modal.isOpen]);

  if (!modal.isOpen) return null;

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="modal-header">
          <h3 id="modal-title">{modal.title}</h3>
          <button
            type="button"
            className="btn-icon"
            onClick={closeModal}
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>
        <div className="modal-body">{modal.content}</div>
      </div>
    </div>
  );
}
