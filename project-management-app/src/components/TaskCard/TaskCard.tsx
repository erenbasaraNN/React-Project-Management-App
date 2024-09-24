// src/components/TaskCard/TaskCard.tsx

import React from 'react';
import styles from './TaskCard.module.css';
import { Task } from '../../types';

interface TaskCardProps {
    task: Task;
    onEdit: (task: Task) => void; // Düzenleme fonksiyonu
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit }) => (
    <div className={styles.card}>
        <h4 className={styles.title}>{task.title}</h4>
        <p className={styles.description}>{task.description}</p>
        <p className={styles.status}>Durum: {task.status}</p>
        <div className={styles.actions}>
            <button onClick={() => onEdit(task)} className={styles.editButton}>
                Düzenle
            </button>
        </div>
    </div>
);

export default TaskCard;
