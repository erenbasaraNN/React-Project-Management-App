// src/components/TaskCard.tsx

import React, { useState, useEffect } from "react";
import {
    collection,
    addDoc,
    query,
    where,
    getDocs,
    Timestamp,
} from "firebase/firestore";
import { db, auth } from "../services/firebase";
import CommentComponent from "./Comment";
import { Task, Comment } from "../types";

interface TaskCardProps {
    task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [commentText, setCommentText] = useState<string>("");

    const fetchComments = async () => {
        try {
            const commentsRef = collection(db, "comments");
            const q = query(commentsRef, where("taskId", "==", task.id));
            const querySnapshot = await getDocs(q);
            const commentsData: Comment[] = querySnapshot.docs.map((doc) => {
                const data = doc.data();
                return {
                    id: doc.id,
                    text: data.text,
                    author: data.author,
                    createdAt: data.createdAt.toDate(), // Convert Timestamp to Date
                    taskId: data.taskId,
                };
            });
            setComments(commentsData);
        } catch (error) {
            console.error("Error fetching comments:", error);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [task.id]);

    const handleAddComment = async (e: React.FormEvent) => {
        e.preventDefault();
        const user = auth.currentUser;
        if (user) {
            try {
                await addDoc(collection(db, "comments"), {
                    text: commentText,
                    author: user.email,
                    taskId: task.id,
                    createdAt: Timestamp.now(),
                });
                setCommentText("");
                fetchComments();
            } catch (error) {
                console.error("Error adding comment:", error);
            }
        }
    };

    return (
        <div>
            {/* Existing TaskCard content */}
            <form onSubmit={handleAddComment}>
                <input
                    type="text"
                    placeholder="Add a comment"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    required
                />
                <button type="submit">Comment</button>
            </form>
            <div>
                {comments.map((comment) => (
                    <CommentComponent
                        key={comment.id}
                        text={comment.text}
                        author={comment.author}
                        createdAt={comment.createdAt}
                    />
                ))}
            </div>
        </div>
    );
};

export default TaskCard;
