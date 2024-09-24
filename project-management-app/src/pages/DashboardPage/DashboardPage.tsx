// src/pages/DashboardPage/DashboardPage.tsx

import React, { useState, useEffect } from 'react';
import styles from './DashboardPage.module.css';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { collection, query, where, getDocs, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { Project } from '../../types';
import ProjectCard from '../../components/ProjectCard/ProjectCard';
import AppLayout from '../../components/layouts/AppLayout';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const DashboardPage: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [projectName, setProjectName] = useState('');
    const [projectDescription, setProjectDescription] = useState('');
    const [loading, setLoading] = useState(true);

    const user = useSelector((state: RootState) => state.user);

    useEffect(() => {
        const fetchProjects = async () => {
            if (user.uid) {
                try {
                    const q = query(collection(db, 'projects'), where('ownerId', '==', user.uid));
                    const querySnapshot = await getDocs(q);
                    const projectsData: Project[] = querySnapshot.docs.map((doc) => ({
                        ...(doc.data() as Project),
                        id: doc.id,
                        createdAt: doc.data().createdAt.toDate(),
                    }));
                    setProjects(projectsData);
                } catch (error) {
                    console.error('Error fetching projects:', error);
                    // Handle error
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchProjects();
    }, [user.uid]);

    const handleCreateProject = async (e: React.FormEvent) => {
        e.preventDefault();
        if (user.uid) {
            try {
                await addDoc(collection(db, 'projects'), {
                    name: projectName,
                    description: projectDescription,
                    ownerId: user.uid,
                    createdAt: Timestamp.now(),
                });
                setProjectName('');
                setProjectDescription('');
                setIsModalOpen(false);
                // Refresh project list
                setLoading(true);
                const q = query(collection(db, 'projects'), where('ownerId', '==', user.uid));
                const querySnapshot = await getDocs(q);
                const projectsData: Project[] = querySnapshot.docs.map((doc) => ({
                    ...(doc.data() as Project),
                    id: doc.id,
                    createdAt: doc.data().createdAt.toDate(),
                }));
                setProjects(projectsData);
            } catch (error) {
                console.error('Error creating project:', error);
                // Handle error
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <AppLayout>
            <div className={styles.header}>
                <h2>Your Projects</h2>
                <Button onClick={() => setIsModalOpen(true)}>New Project</Button>
            </div>
            {loading ? (
                <LoadingSpinner />
            ) : (
                <div className={styles.projectList}>
                    {projects.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                    ))}
                </div>
            )}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <h3>Create New Project</h3>
                <form onSubmit={handleCreateProject}>
                    <Input
                        label="Project Name"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        required
                    />
                    <Input
                        label="Project Description"
                        value={projectDescription}
                        onChange={(e) => setProjectDescription(e.target.value)}
                        required
                    />
                    <Button type="submit">Create Project</Button>
                </form>
            </Modal>
        </AppLayout>
    );
};

export default DashboardPage;
