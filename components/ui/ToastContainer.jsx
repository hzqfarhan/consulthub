'use client';

import React from 'react';
import { useConsultHub } from '@/lib/context';
import { CheckCircle2, AlertCircle, Info, XCircle, X } from 'lucide-react';

export default function ToastContainer() {
  const { toasts, removeToast } = useConsultHub();

  if (toasts.length === 0) return null;

  return (
    <div id="toast-container" className="toast-container">
      {toasts.map((toast) => {
        let IconComponent = Info;
        if (toast.type === 'success') IconComponent = CheckCircle2;
        else if (toast.type === 'danger') IconComponent = XCircle;
        else if (toast.type === 'warning') IconComponent = AlertCircle;

        return (
          <div key={toast.id} className={`toast toast-${toast.type}`}>
            <IconComponent className="toast-icon" size={18} />
            <span className="toast-message">{toast.message}</span>
            <button
              type="button"
              className="toast-close"
              onClick={() => removeToast(toast.id)}
              aria-label="Close notification"
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
