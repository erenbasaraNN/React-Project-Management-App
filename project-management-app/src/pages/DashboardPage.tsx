// src/pages/DashboardPage.tsx

import React, { useEffect, useState } from 'react';
import { collection, addDoc, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../services/firebase';

import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

import ProjectCard from '../components/ProjectCard';
import { Project } from '../types';

const DashboardPage: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [projectName, setProjectName] = useState<string>('');
    const [projectDescription, setProjectDescription] = useState<string>('');

    // Access the user from the Redux store
    const user = useSelector((state: RootState) => state.user);

    useEffect(() => {
        const fetchProjects = async () => {
            if (user.uid) {
                const q = query(collection(db, 'projects'), where('ownerId', '==', user.uid));
                const querySnapshot = await getDocs(q);
                const projectsData: Project[] = querySnapshot.docs.map((doc) => ({
                    ...(doc.data() as Project),
                    id: doc.id,
                }));
                setProjects(projectsData);
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
                // Optionally, fetch projects again to update the list
            } catch (error) {
                console.error('Error creating project:', error);
            }
        } else {
            // Handle the case where the user is not authenticated
            console.error('User is not authenticated');
        }
    };

    return (
        <div>
            <h2>Dashboard</h2>
            <form onSubmit={handleCreateProject}>
                <input
                    type='text'
                    placeholder='Project Name'
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    required
                />
                <textarea
                    placeholder='Project Description'
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                    required
                />
                <button type='submit'>Create Project</button>
            </form>
            <div>
                {projects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                ))}
            </div>
        </div>
    );
};

export default DashboardPage;
