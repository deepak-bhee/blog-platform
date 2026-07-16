import { useEffect, useRef } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  loading = false,
  variant = 'danger', // 'danger' | 'warning'
}) => {
  const cancelRef = useRef(null);

  // Focus trap — focus cancel button when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => cancelRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-slide-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-4 mb-5">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
              variant === 'danger' ? 'bg-red-50' : 'bg-amber-50'
            }`}
          >
            <AlertTriangle
              className={`w-6 h-6 ${
                variant === 'danger' ? 'text-red-500' : 'text-amber-500'
              }`}
            />
          </div>
          <div>
            <h2 id="modal-title" className="text-lg font-display font-bold text-slate-900 mb-1">
              {title}
            </h2>
            <p className="text-slate-500 text-sm">{message}</p>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <button
            ref={cancelRef}
            onClick={onClose}
            disabled={loading}
            className="btn-secondary text-sm"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`inline-flex items-center gap-2 px-5 py-2.5 font-semibold rounded-xl transition-all duration-200 text-sm active:scale-95 disabled:opacity-60 ${
              variant === 'danger'
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-amber-500 hover:bg-amber-600 text-white'
            }`}
          >
            {loading && <LoadingSpinner size="sm" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
