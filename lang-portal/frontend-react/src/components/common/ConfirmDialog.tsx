import { useTranslation } from 'react-i18next';
import Modal from './Modal';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  confirmVariant?: 'primary' | 'secondary' | 'accent' | 'warning' | 'error';
  cancelText?: string;
}

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  confirmVariant = 'primary',
  cancelText,
}: ConfirmDialogProps) => {
  const { t } = useTranslation();
  
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };
  
  const footer = (
    <>
      <button 
        onClick={onClose} 
        className="btn btn-ghost"
      >
        {cancelText || t('common.buttons.cancel')}
      </button>
      <button 
        onClick={handleConfirm} 
        className={`btn btn-${confirmVariant}`}
      >
        {confirmText || t('common.buttons.confirm')}
      </button>
    </>
  );
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      footer={footer}
    >
      <p>{message}</p>
    </Modal>
  );
};

export default ConfirmDialog;
