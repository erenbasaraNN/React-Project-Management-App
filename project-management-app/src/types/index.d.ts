// src/types/index.d.ts

export interface Project {
    id: string;
    name: string;
    description: string;
    ownerId: string;
    createdAt: Date;
}

export interface Task {
    id: string;
    title: string;
    description: string;
    status: string;
    priority: string;
    startDate?: string;
    endDate?: string;
    projectId: string;
    ownerId: string;
    assignees?: string[];
    createdAt: Date;
    lastUpdatedBy?: string;
    lastUpdatedAt?: Date;
    statusGroup?: string;
}

export interface Comment {
    id: string;
    text: string;
    author: string | null;
    createdAt: Date;
    taskId: string;
}
