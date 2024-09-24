// src/components/common/Button.tsx

import React from 'react';
import styles from './Button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({ variant = 'primary', children, ...props }) => (
    <button className={`${styles.button} ${styles[variant]}`} {...props}>
        {children}
    </button>
);

export default Button;
