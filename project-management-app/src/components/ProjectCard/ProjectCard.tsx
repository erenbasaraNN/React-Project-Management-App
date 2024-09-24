// src/components/ProjectCard/ProjectCard.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import styles from './ProjectCard.module.css';
import { Project } from '../../types';

interface ProjectCardProps {
    project: Project;
    onEdit: (project: Project) => void; // Düzenleme fonksiyonu
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onEdit }) => (
    <div className={styles.card}>
        <h3 className={styles.title}>{project.name}</h3>
        <p className={styles.description}>{project.description}</p>
        <div className={styles.actions}>
            <Link to={`/projects/${project.id}`} className={styles.link}>
                Detayları Görüntüle
            </Link>
            <button onClick={() => onEdit(project)} className={styles.editButton}>
                Düzenle
            </button>
        </div>
    </div>
);

export default ProjectCard;
