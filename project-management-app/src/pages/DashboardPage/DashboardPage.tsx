// src/pages/DashboardPage/DashboardPage.tsx

import React, { useState, useEffect } from 'react';
import {
    Grid,
    Typography,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import {
    collection,
    query,
    where,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    Timestamp,
} from 'firebase/firestore';
import { db, auth } from '../../services/firebase';
import { Project } from '../../types';
import ProjectCard from '../../components/ProjectCard/ProjectCard';
import AppLayout from '../../components/layouts/AppLayout';
import Button from '../../components/common/Button';

const DashboardPage: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [projectName, setProjectName] = useState('');
    const [projectDescription, setProjectDescription] = useState('');
    const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);

    const user = useSelector((state: RootState) => state.user);

    const fetchProjects = async () => {
        if (user.uid) {
            setLoading(true);
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
            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        fetchProjects();
    }, [user.uid]);

    const handleCreateOrUpdateProject = async () => {
        const currentUser = auth.currentUser;
        if (!currentUser) return;

        try {
            if (projectToEdit) {
                // Update existing project
                await updateDoc(doc(db, 'projects', projectToEdit.id), {
                    name: projectName,
                    description: projectDescription,
                });
            } else {
                // Create new project
                await addDoc(collection(db, 'projects'), {
                    name: projectName,
                    description: projectDescription,
                    ownerId: currentUser.uid,
                    createdAt: Timestamp.now(),
                });
            }
            setProjectName('');
            setProjectDescription('');
            setIsModalOpen(false);
            setProjectToEdit(null);
            fetchProjects();
        } catch (error) {
            console.error('Error saving project:', error);
        }
    };

    const handleDeleteProject = async (projectId: string) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            try {
                await deleteDoc(doc(db, 'projects', projectId));
                fetchProjects();
            } catch (error) {
                console.error('Error deleting project:', error);
            }
        }
    };

    return (
        <AppLayout>
            <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                <Typography variant="h4">Your Projects</Typography>
                <Button onClick={() => setIsModalOpen(true)}>New Project</Button>
            </Grid>
            {loading ? (
                <CircularProgress />
            ) : (
                <Grid container spacing={3}>
                    {projects.map((project) => (
                        <Grid item xs={12} sm={6} md={4} key={project.id}>
                            <ProjectCard
                                project={project}
                                onEdit={(project) => {
                                    setProjectToEdit(project);
                                    setProjectName(project.name);
                                    setProjectDescription(project.description);
                                    setIsModalOpen(true);
                                }}
                                onDelete={handleDeleteProject}
                            />
                        </Grid>
                    ))}
                </Grid>
            )}
            <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>{projectToEdit ? 'Edit Project' : 'New Project'}</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Project Name"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Project Description"
                        value={projectDescription}
                        onChange={(e) => setProjectDescription(e.target.value)}
                        fullWidth
                        margin="normal"
                        multiline
                        rows={4}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
                    <Button onClick={handleCreateOrUpdateProject}>
                        {projectToEdit ? 'Update' : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>
        </AppLayout>
    );
};

export default DashboardPage;
