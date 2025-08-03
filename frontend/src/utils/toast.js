import { useState, useEffect } from 'react';
import './toast.css'; // We'll create this next

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, duration = 3000) => {
    const id = Date.now();
    setToasts([...toasts, { id, message }]);
    
    setTimeout(() => {
      setToasts(currentToasts => currentToasts.filter(toast => toast.id !== id));
    }, duration);
  };

  return (
    <>
      {children}
      <div className="toast-container">
        {toasts.map(toast => (
          <div key={toast.id} className="toast">
            {toast.message}
          </div>
        ))}
      </div>
    </>
  );
};

export const useToast = () => {
  const [toast, setToast] = useState(null);

  const showToast = (message) => {
    setToast({ message });
    setTimeout(() => setToast(null), 3000);
  };

  return { toast, showToast };
};

export const showToast = (message) => {
  // This is a simplified version that works without context
  const toastElement = document.createElement('div');
  toastElement.className = 'toast';
  toastElement.textContent = message;
  document.body.appendChild(toastElement);
  
  setTimeout(() => {
    toastElement.classList.add('fade-out');
    setTimeout(() => document.body.removeChild(toastElement), 300);
  }, 3000);
};