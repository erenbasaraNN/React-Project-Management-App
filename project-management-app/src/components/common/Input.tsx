// src/components/common/Input.tsx

import React from 'react';
import styles from './Input.module.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ label, ...props }, ref) => (
    <div className={styles.inputGroup}>
        <label className={styles.label}>{label}</label>
        <input className={styles.input} ref={ref} {...props} />
    </div>
));

export default Input;
