// src/components/TaskCard/TaskCard.tsx

import React from 'react';
import styles from './TaskCard.module.css';
import { Task } from '../../types';

interface TaskCardProps {
    task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => (
    <div className={styles.card}>
        <h4 className={styles.title}>{task.title}</h4>
        <p className={styles.status}>Status: {task.status}</p>
        {/* Include more task details or actions here */}
    </div>
);

export default TaskCard;
