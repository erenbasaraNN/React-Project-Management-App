// src/components/ProjectCard/ProjectCard.tsx

import React from 'react';
import {
    Card,
    CardContent,
    CardActions,
    Typography,
    Button,
    IconButton,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Project } from '../../types';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface ProjectCardProps {
    project: Project;
    onEdit: (project: Project) => void;
    onDelete: (projectId: string) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onEdit, onDelete }) => (
    <Card>
        <CardContent>
            <Typography variant="h5" component="div">
                {project.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
                {project.description}
            </Typography>
        </CardContent>
        <CardActions>
            <Button size="small" component={RouterLink} to={`/projects/${project.id}`}>
                View Details
            </Button>
            <IconButton color="primary" onClick={() => onEdit(project)}>
                <EditIcon />
            </IconButton>
            <IconButton color="secondary" onClick={() => onDelete(project.id)}>
                <DeleteIcon />
            </IconButton>
        </CardActions>
    </Card>
);

export default ProjectCard;
