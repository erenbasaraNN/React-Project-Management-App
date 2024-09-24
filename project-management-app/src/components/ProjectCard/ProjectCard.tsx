// src/components/ProjectCard/ProjectCard.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import styles from './ProjectCard.module.css';
import { Project } from '../../types';

interface ProjectCardProps {
    project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => (
    <div className={styles.card}>
        <h3 className={styles.title}>{project.name}</h3>
        <p className={styles.description}>{project.description}</p>
        <Link to={`/projects/${project.id}`} className={styles.link}>
            View Details
        </Link>
    </div>
);

export default ProjectCard;
