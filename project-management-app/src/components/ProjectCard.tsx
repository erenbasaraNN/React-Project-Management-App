// src/components/ProjectCard.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import { Project } from '../types';

interface ProjectCardProps {
    project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
    return (
        <div>
            <Link to={`/projects/${project.id}`}>
                <h3>{project.name}</h3>
            </Link>
            <p>{project.description}</p>
        </div>
    );
};

export default ProjectCard;
