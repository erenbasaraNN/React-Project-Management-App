// src/components/TaskCard/TaskCard.tsx

import React from 'react';
import {
    Card,
    CardContent,
    CardActions,
    Typography,
    IconButton,
} from '@mui/material';
import { Task } from '../../types';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface TaskCardProps {
    task: Task;
    onEdit: (task: Task) => void;
    onDelete: (taskId: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete }) => (
    <Card>
        <CardContent>
            <Typography variant="h6">{task.title}</Typography>
            <Typography variant="body2" color="text.secondary">
                {task.description}
            </Typography>
            <Typography variant="caption" color="text.secondary">
                Status: {task.status}
            </Typography>
        </CardContent>
        <CardActions>
            <IconButton color="primary" onClick={() => onEdit(task)}>
                <EditIcon />
            </IconButton>
            <IconButton color="secondary" onClick={() => onDelete(task.id)}>
                <DeleteIcon />
            </IconButton>
        </CardActions>
    </Card>
);

export default TaskCard;
