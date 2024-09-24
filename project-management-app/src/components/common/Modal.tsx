// src/components/common/Modal.tsx

import React, { ReactNode } from 'react';
import ReactDOM from 'react-dom';
import styles from './Modal.module.css';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode; // Allow children to be passed to Modal
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeButton} onClick={onClose}>
                    &times;
                </button>
                {children}
            </div>
        </div>,
        document.getElementById('modal-root')!
    );
};

export default Modal;
