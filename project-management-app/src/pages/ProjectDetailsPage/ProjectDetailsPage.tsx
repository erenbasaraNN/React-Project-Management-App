// src/pages/ProjectDetailsPage/ProjectDetailsPage.tsx

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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material';
import { useParams } from 'react-router-dom';
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
import { db, auth } from '../../services/firebase';
import { Task } from '../../types';
import AppLayout from '../../components/layouts/AppLayout';
import Button from '../../components/common/Button';
import EditIcon from '@mui/icons-material/Edit';


const ProjectDetailsPage: React.FC = () => {
  const { id: projectId } = useParams<{ id: string }>();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskStatus, setTaskStatus] = useState('Yapılacak');
  const [taskPriority, setTaskPriority] = useState('Normal');
  const [taskStartDate, setTaskStartDate] = useState('');
  const [taskEndDate, setTaskEndDate] = useState('');
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [groups, setGroups] = useState<string[]>(['Yapılacak', 'Yapılıyor', 'Tamamlandı']);
  const [users, setUsers] = useState<any[]>([]);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const fetchTasks = async () => {
    if (projectId) {
      setLoading(true);
      try {
        const q = query(collection(db, 'tasks'), where('projectId', '==', projectId));
        const querySnapshot = await getDocs(q);
        const tasksData: Task[] = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            ...(data as Task),
            id: doc.id,
            createdAt: data.createdAt.toDate(),
            lastUpdatedAt: data.lastUpdatedAt ? data.lastUpdatedAt.toDate() : null,
          };
        });
        console.log('Görevler:', tasksData); // Görevleri konsola yazdırın
        setTasks(tasksData);
      } catch (error) {
        console.error('Görevler getirilirken hata oluştu:', error);
      } finally {
        setLoading(false);
      }
      console.log('Proje ID:', projectId);
    }
  };


  const fetchUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const usersData = querySnapshot.docs.map((doc) => ({
        ...(doc.data()),
        id: doc.id,
      }));
      setUsers(usersData);
    } catch (error) {
      console.error('Kullanıcılar getirilirken hata oluştu:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, [projectId]);

  const handleCreateOrUpdateTask = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser || !projectId) return;

    try {
      if (taskToEdit) {
        // Update existing task
        await updateDoc(doc(db, 'tasks', taskToEdit.id), {
          title: taskTitle,
          description: taskDescription,
          status: taskStatus,
          priority: taskPriority,
          startDate: taskStartDate,
          endDate: taskEndDate,
          lastUpdatedBy: currentUser.displayName || 'Unknown',
          lastUpdatedAt: Timestamp.now(),
        });
      } else {
        // Create new task
        await addDoc(collection(db, 'tasks'), {
          title: taskTitle,
          description: taskDescription,
          status: taskStatus,
          priority: taskPriority,
          startDate: taskStartDate,
          endDate: taskEndDate,
          projectId: projectId,
          ownerId: currentUser.uid,
          assignees: [],
          createdAt: Timestamp.now(),
          lastUpdatedBy: currentUser.displayName || 'Unknown',
          lastUpdatedAt: Timestamp.now(),
        });
      }
      setTaskTitle('');
      setTaskDescription('');
      setTaskStatus('Yapılacak');
      setTaskPriority('Normal');
      setTaskStartDate('');
      setTaskEndDate('');
      setIsModalOpen(false);
      setTaskToEdit(null);
      await fetchTasks();
    } catch (error) {
      console.error('Görev kaydedilirken hata oluştu:', error);
    }
  };

  const handleEditTask = (task: Task) => {
    setTaskToEdit(task);
    setTaskTitle(task.title);
    setTaskDescription(task.description);
    setTaskStatus(task.status);
    setTaskPriority(task.priority);
    setTaskStartDate(task.startDate || '');
    setTaskEndDate(task.endDate || '');
    setIsModalOpen(true);
  };

  const handleGroupNameChange = (index: number, newName: string) => {
    const newGroups = [...groups];
    newGroups[index] = newName;
    setGroups(newGroups);
  };

  const handleAssignUsers = (task: Task) => {
    setSelectedTask(task);
    setSelectedUsers(task.assignees || []);
    setIsAssignModalOpen(true);
  };

  const handleSaveAssignees = async () => {
    if (selectedTask) {
      try {
        await updateDoc(doc(db, 'tasks', selectedTask.id), {
          assignees: selectedUsers,
        });
        setIsAssignModalOpen(false);
        setSelectedTask(null);
        setSelectedUsers([]);
        await fetchTasks();
      } catch (error) {
        console.error('Atama yapılırken hata oluştu:', error);
      }
    }
  };

  return (
      <AppLayout>
        <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Typography variant="h4">Proje Detayları</Typography>
          <Button onClick={() => setIsModalOpen(true)}>Yeni Görev</Button>
        </Grid>
        {loading ? (
            <CircularProgress />
        ) : (
            groups.map((groupName, index) => (
                <TableContainer component={Paper} sx={{ mb: 3 }} key={index}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell colSpan={7}>
                          <Typography
                              variant="h6"
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) =>
                                  handleGroupNameChange(index, e.currentTarget.textContent || '')
                              }
                          >
                            {groupName}
                          </Typography>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Görev Adı</TableCell>
                        <TableCell>Atananlar</TableCell>
                        <TableCell>Durum</TableCell>
                        <TableCell>Öncelik</TableCell>
                        <TableCell>Zaman Çizelgesi</TableCell>
                        <TableCell>Son Güncelleme</TableCell>
                        <TableCell>Aksiyonlar</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {tasks
                          .filter((task) => task.status === groupName)
                          .map((task) => (
                              <TableRow key={task.id}>
                                <TableCell>{task.title}</TableCell>
                                <TableCell>
                                  {task.assignees && task.assignees.length > 0
                                      ? task.assignees.join(', ')
                                      : 'Atama yapılmadı'}
                                  <IconButton onClick={() => handleAssignUsers(task)}>
                                    <EditIcon />
                                  </IconButton>
                                </TableCell>
                                <TableCell>
                                  <Typography
                                      sx={{
                                        backgroundColor:
                                            task.status === 'Yapılacak'
                                                ? 'gray'
                                                : task.status === 'Yapılıyor'
                                                    ? 'orange'
                                                    : 'green',
                                        color: 'white',
                                        borderRadius: 1,
                                        textAlign: 'center',
                                        padding: '4px 8px',
                                      }}
                                  >
                                    {task.status}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography
                                      sx={{
                                        backgroundColor:
                                            task.priority === 'Düşük'
                                                ? 'blue'
                                                : task.priority === 'Normal'
                                                    ? 'green'
                                                    : 'red',
                                        color: 'white',
                                        borderRadius: 1,
                                        textAlign: 'center',
                                        padding: '4px 8px',
                                      }}
                                  >
                                    {task.priority}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  {task.startDate && task.endDate
                                      ? `${task.startDate} - ${task.endDate}`
                                      : 'Belirtilmemiş'}
                                </TableCell>
                                <TableCell>
                                  {task.lastUpdatedBy} -{' '}
                                  {task.lastUpdatedAt?.toLocaleDateString('tr-TR')}
                                </TableCell>
                                <TableCell>
                                  <IconButton onClick={() => handleEditTask(task)}>
                                    <EditIcon />
                                  </IconButton>
                                </TableCell>
                              </TableRow>
                          ))}
                    </TableBody>
                  </Table>
                </TableContainer>
            ))
        )}
        {/* Görev Oluşturma/Düzenleme Modalı */}
        <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} fullWidth maxWidth="sm">
          <DialogTitle>{taskToEdit ? 'Görevi Düzenle' : 'Yeni Görev'}</DialogTitle>
          <DialogContent>
            <TextField
                label="Görev Başlığı"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Görev Açıklaması"
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                fullWidth
                margin="normal"
                multiline
                rows={4}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Durum</InputLabel>
              <Select
                  value={taskStatus}
                  onChange={(e) => setTaskStatus(e.target.value)}
                  variant="outlined"
              >
                <MenuItem value="Yapılacak">Yapılacak</MenuItem>
                <MenuItem value="Yapılıyor">Yapılıyor</MenuItem>
                <MenuItem value="Tamamlandı">Tamamlandı</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Öncelik</InputLabel>
              <Select
                  value={taskPriority}
                  onChange={(e) => setTaskPriority(e.target.value)}
                  variant="outlined"
              >
                <MenuItem value="Düşük">Düşük</MenuItem>
                <MenuItem value="Normal">Normal</MenuItem>
                <MenuItem value="Yüksek">Yüksek</MenuItem>
              </Select>
            </FormControl>
            <TextField
                label="Başlangıç Tarihi"
                type="date"
                value={taskStartDate}
                onChange={(e) => setTaskStartDate(e.target.value)}
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
            />
            <TextField
                label="Bitiş Tarihi"
                type="date"
                value={taskEndDate}
                onChange={(e) => setTaskEndDate(e.target.value)}
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsModalOpen(false)}>İptal</Button>
            <Button onClick={handleCreateOrUpdateTask}>
              {taskToEdit ? 'Güncelle' : 'Oluştur'}
            </Button>
          </DialogActions>
        </Dialog>
        {/* Kullanıcı Atama Modalı */}
        <Dialog
            open={isAssignModalOpen}
            onClose={() => setIsAssignModalOpen(false)}
            fullWidth
            maxWidth="sm"
        >
          <DialogTitle>Kullanıcı Atama</DialogTitle>
          <DialogContent>
            <FormControl fullWidth margin="normal">
              <InputLabel>Kullanıcılar</InputLabel>
              <Select
                  multiple
                  value={selectedUsers}
                  onChange={(e) => setSelectedUsers(e.target.value as string[])}
                  variant="outlined"
              >
                {users.map((user) => (
                    <MenuItem key={user.id} value={user.displayName}>
                      {user.displayName}
                    </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsAssignModalOpen(false)}>İptal</Button>
            <Button onClick={handleSaveAssignees}>Kaydet</Button>
          </DialogActions>
        </Dialog>
      </AppLayout>
  );
};

export default ProjectDetailsPage;
