// src/components/Sidebar/Sidebar.tsx

import React, { useState, useEffect } from 'react';
import {
    Drawer,
    List,
    ListItemButton,
    ListItemText,
    Divider,
    Toolbar,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { Project } from '../../types';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

const Sidebar: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const user = useSelector((state: RootState) => state.user);

    const fetchProjects = async () => {
        try {
            const q = query(collection(db, 'projects'), where('ownerId', '==', user.uid));
            const querySnapshot = await getDocs(q);
            const projectsData: Project[] = querySnapshot.docs.map((doc) => ({
                ...(doc.data() as Project),
                id: doc.id,
            }));
            setProjects(projectsData);
        } catch (error) {
            console.error('Projeler getirilirken hata oluştu:', error);
        }
    };

    useEffect(() => {
        if (user.uid) {
            fetchProjects();
        }
    }, [user.uid]);

    return (
        <Drawer variant="permanent" anchor="left">
            <Toolbar />
            <div style={{ width: 250 }}>
                <List>
                    <ListItemButton component={RouterLink} to="/dashboard">
                        <ListItemText primary="DASHBOARD" />
                    </ListItemButton>
                    <Divider />
                    <ListItemButton>
                        <ListItemText primary="PROJELER" />
                    </ListItemButton>
                    {projects.map((project) => (
                        <ListItemButton
                            key={project.id}
                            component={RouterLink}
                            to={`/projects/${project.id}`}
                        >
                            <ListItemText primary={project.name} />
                        </ListItemButton>
                    ))}
                </List>
            </div>
        </Drawer>
    );
};

export default Sidebar;
