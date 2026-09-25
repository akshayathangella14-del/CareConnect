import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { Logo } from '@/components';
import LoginForm from './LoginForm';
import styles from './LoginModal.module.css';

export default function LoginModal({ isOpen, onClose }) {
  useEffect(() => {
    if (!isOpen) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className={styles.overlay}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-modal-title"
    >
      <div className={styles.modal}>
        <button type="button" className={styles.close} onClick={onClose} aria-label="Close sign in">
          <X size={20} />
        </button>
        <div className={styles.logo}>
          <Logo size="sm" animated />
        </div>
        <h2 id="login-modal-title" className={styles.title}>Welcome back</h2>
        <p className={styles.subtitle}>Sign in to book verified home services in seconds.</p>
        <LoginForm onSuccess={onClose} />
      </div>
    </div>,
    document.body
  );
}
