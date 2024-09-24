// src/pages/ProjectDetailsPage/ProjectDetailsPage.tsx

import React, { useState, useEffect } from 'react';
import styles from './ProjectDetailsPage.module.css';
import { useParams } from 'react-router-dom';
import { collection, query, where, getDocs, addDoc, updateDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { Task } from '../../types';
import AppLayout from '../../components/layouts/AppLayout';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import TaskCard from '../../components/TaskCard/TaskCard';
import { getAuth } from "firebase/auth";


const ProjectDetailsPage: React.FC = () => {
  const { id: projectId } = useParams<{ id: string }>();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskStatus, setTaskStatus] = useState('To Do');
  const [loading, setLoading] = useState(true);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  const fetchTasks = async () => {
    if (projectId) {
      setLoading(true);
      try {
        const q = query(collection(db, 'tasks'), where('projectId', '==', projectId));
        const querySnapshot = await getDocs(q);
        const tasksData: Task[] = querySnapshot.docs.map((doc) => ({
          ...(doc.data() as Task),
          id: doc.id,
          createdAt: doc.data().createdAt.toDate(),
        }));
        setTasks(tasksData);
      } catch (error) {
        console.error('Görevler getirilirken hata oluştu:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [projectId]);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = getAuth().currentUser; // Firebase Authentication'dan kullanıcıyı al
    if (projectId && user) {
      try {
        await addDoc(collection(db, 'tasks'), {
          title: taskTitle,
          description: taskDescription,
          status: taskStatus,
          projectId: projectId,
          ownerId: user.uid, // Görev oluşturucunun UID'sini ekliyoruz
          createdAt: Timestamp.now(),
        });
        setTaskTitle('');
        setTaskDescription('');
        setTaskStatus('To Do');
        setIsModalOpen(false);
        fetchTasks(); // Görevleri yeniden yükleyin
      } catch (error) {
        console.error('Görev oluşturulurken hata oluştu:', error);
      }
    }
  };

  const handleEditTask = (task: Task) => {
    setTaskToEdit(task);
    setTaskTitle(task.title);
    setTaskDescription(task.description);
    setTaskStatus(task.status);
    setIsEditModalOpen(true);
  };

  const handleUpdateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (taskToEdit) {
      try {
        await updateDoc(doc(db, 'tasks', taskToEdit.id), {
          title: taskTitle,
          description: taskDescription,
          status: taskStatus,
        });
        setIsEditModalOpen(false);
        setTaskTitle('');
        setTaskDescription('');
        setTaskStatus('To Do');
        setTaskToEdit(null);
        fetchTasks();
      } catch (error) {
        console.error('Görev güncellenirken hata oluştu:', error);
      }
    }
  };

  return (
      <AppLayout>
        <div className={styles.header}>
          <h2>Görevler</h2>
          <Button onClick={() => setIsModalOpen(true)}>Yeni Görev</Button>
        </div>
        {loading ? (
            <LoadingSpinner />
        ) : (
            <div className={styles.taskList}>
              {tasks.map((task) => (
                  <TaskCard key={task.id} task={task} onEdit={handleEditTask} />
              ))}
            </div>
        )}
        {/* Görev Oluşturma Modalı */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <h3>Yeni Görev Oluştur</h3>
          <form onSubmit={handleCreateTask}>
            <Input
                label="Görev Başlığı"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                required
            />
            <Input
                label="Görev Açıklaması"
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                required
            />
            <label className={styles.label}>Durum</label>
            <select
                className={styles.select}
                value={taskStatus}
                onChange={(e) => setTaskStatus(e.target.value)}
            >
              <option value="To Do">Yapılacak</option>
              <option value="In Progress">Devam Ediyor</option>
              <option value="Done">Tamamlandı</option>
            </select>
            <Button type="submit">Görev Oluştur</Button>
          </form>
        </Modal>
        {/* Görev Düzenleme Modalı */}
        {taskToEdit && (
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => {
                  setIsEditModalOpen(false);
                  setTaskToEdit(null);
                  setTaskTitle('');
                  setTaskDescription('');
                  setTaskStatus('To Do');
                }}
            >
              <h3>Görev Düzenle</h3>
              <form onSubmit={handleUpdateTask}>
                <Input
                    label="Görev Başlığı"
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    required
                />
                <Input
                    label="Görev Açıklaması"
                    value={taskDescription}
                    onChange={(e) => setTaskDescription(e.target.value)}
                    required
                />
                <label className={styles.label}>Durum</label>
                <select
                    className={styles.select}
                    value={taskStatus}
                    onChange={(e) => setTaskStatus(e.target.value)}
                >
                  <option value="To Do">Yapılacak</option>
                  <option value="In Progress">Devam Ediyor</option>
                  <option value="Done">Tamamlandı</option>
                </select>
                <Button type="submit">Görevi Güncelle</Button>
              </form>
            </Modal>
        )}
      </AppLayout>
  );
};

export default ProjectDetailsPage;
