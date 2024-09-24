// src/pages/ProjectDetailsPage.tsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { collection, addDoc, query, where, getDocs, Timestamp } from "firebase/firestore";
import { db } from "../../services/firebase.ts";
import { Task } from "../../types";
import TaskCard from "../../components/TaskCard/TaskCard.tsx";

const ProjectDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskTitle, setTaskTitle] = useState<string>("");

  useEffect(() => {
    const fetchTasks = async () => {
      const q = query(collection(db, "tasks"), where("projectId", "==", id));
      const querySnapshot = await getDocs(q);
      const tasksData: Task[] = querySnapshot.docs.map((doc) => ({
        ...(doc.data() as Task),
        id: doc.id, // Ensure 'id' is set from doc.id
      }));
      setTasks(tasksData);
    };

    fetchTasks();
  }, [id]);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "tasks"), {
        title: taskTitle,
        status: "To Do",
        projectId: id,
        createdAt: Timestamp.now(),
      });
      setTaskTitle("");
      // Refresh tasks list
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  return (
    <div>
      <h2>Project Tasks</h2>
      <form onSubmit={handleAddTask}>
        <input
          type="text"
          placeholder="Task Title"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          required
        />
        <button type="submit">Add Task</button>
      </form>
      <div>
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
};

export default ProjectDetailsPage;
