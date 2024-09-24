// src/pages/DashboardPage/DashboardPage.tsx

import React, { useState, useEffect } from 'react';
import styles from './DashboardPage.module.css';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import {
    collection,
    query,
    where,
    getDocs,
    addDoc,
    updateDoc,
    doc,
    Timestamp,
} from 'firebase/firestore';
import { db } from '../../services/firebase';
import { Project } from '../../types';
import ProjectCard from '../../components/ProjectCard/ProjectCard';
import AppLayout from '../../components/layouts/AppLayout';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { getAuth } from "firebase/auth";

const DashboardPage: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [projectName, setProjectName] = useState('');
    const [projectDescription, setProjectDescription] = useState('');
    const [loading, setLoading] = useState(true);
    const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);

    const user = useSelector((state: RootState) => state.user);

    const fetchProjects = async () => {
        if (user.uid) {
            setLoading(true);
            try {
                const q = query(
                    collection(db, 'projects'),
                    where('ownerId', '==', user.uid)
                );
                const querySnapshot = await getDocs(q);
                const projectsData: Project[] = querySnapshot.docs.map((doc) => ({
                    ...(doc.data() as Project),
                    id: doc.id,
                    createdAt: doc.data().createdAt.toDate(),
                }));
                setProjects(projectsData);
            } catch (error) {
                console.error('Projeler getirilirken hata oluştu:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        fetchProjects();
    }, [user.uid]);

    const handleCreateProject = async (e: React.FormEvent) => {
        e.preventDefault();
        const user = getAuth().currentUser; // Firebase Authentication'dan kullanıcıyı al
        if (user.uid) {
            try {
                await addDoc(collection(db, 'projects'), {
                    name: projectName,
                    description: projectDescription,
                    ownerId: user.uid, // Proje sahibinin UID'si
                    createdAt: Timestamp.now(),
                });
                setProjectName('');
                setProjectDescription('');
                setIsModalOpen(false);
                fetchProjects();
            } catch (error) {
                console.error('Proje oluşturulurken hata oluştu:', error);
            }
        }
    };

    const handleEditProject = (project: Project) => {
        setProjectToEdit(project);
        setProjectName(project.name);
        setProjectDescription(project.description);
        setIsEditModalOpen(true);
    };

    const handleUpdateProject = async (e: React.FormEvent) => {
        e.preventDefault();
        if (projectToEdit && user.uid) {
            try {
                await updateDoc(doc(db, 'projects', projectToEdit.id), {
                    name: projectName,
                    description: projectDescription,
                });
                setIsEditModalOpen(false);
                setProjectName('');
                setProjectDescription('');
                setProjectToEdit(null);
                fetchProjects();
            } catch (error) {
                console.error('Proje güncellenirken hata oluştu:', error);
            }
        }
    };

    return (
        <AppLayout>
            <div className={styles.header}>
                <h2>Projeleriniz</h2>
                <Button onClick={() => setIsModalOpen(true)}>Yeni Proje</Button>
            </div>
            {loading ? (
                <LoadingSpinner />
            ) : (
                <div className={styles.projectList}>
                    {projects.map((project) => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            onEdit={handleEditProject}
                        />
                    ))}
                </div>
            )}
            {/* Proje Oluşturma Modalı */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <h3>Yeni Proje Oluştur</h3>
                <form onSubmit={handleCreateProject}>
                    <Input
                        label="Proje Adı"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        required
                    />
                    <Input
                        label="Proje Açıklaması"
                        value={projectDescription}
                        onChange={(e) => setProjectDescription(e.target.value)}
                        required
                    />
                    <Button type="submit">Proje Oluştur</Button>
                </form>
            </Modal>
            {/* Proje Düzenleme Modalı */}
            {projectToEdit && (
                <Modal
                    isOpen={isEditModalOpen}
                    onClose={() => {
                        setIsEditModalOpen(false);
                        setProjectToEdit(null);
                        setProjectName('');
                        setProjectDescription('');
                    }}
                >
                    <h3>Proje Düzenle</h3>
                    <form onSubmit={handleUpdateProject}>
                        <Input
                            label="Proje Adı"
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                            required
                        />
                        <Input
                            label="Proje Açıklaması"
                            value={projectDescription}
                            onChange={(e) => setProjectDescription(e.target.value)}
                            required
                        />
                        <Button type="submit">Projeyi Güncelle</Button>
                    </form>
                </Modal>
            )}
        </AppLayout>
    );
};

export default DashboardPage;
