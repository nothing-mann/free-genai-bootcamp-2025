import { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}

const Modal = ({ isOpen, onClose, title, children, footer }: ModalProps) => {
  const { t } = useTranslation();
  
  if (!isOpen) return null;
  
  return createPortal(
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-base-100 p-6 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">{title}</h3>
          <button 
            onClick={onClose} 
            className="btn btn-sm btn-circle btn-ghost"
          >
            ✕
          </button>
        </div>
        
        <div className="mb-6">
          {children}
        </div>
        
        {footer && <div className="flex justify-end gap-2">{footer}</div>}
        
        {!footer && (
          <div className="flex justify-end gap-2">
            <button 
              onClick={onClose} 
              className="btn btn-ghost"
            >
              {t('common.buttons.cancel')}
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
