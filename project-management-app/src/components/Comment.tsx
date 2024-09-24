// src/components/Comment.tsx

import React from "react";

interface CommentProps {
    text: string;
    author: string | null;
    createdAt: Date;
}

const Comment: React.FC<CommentProps> = ({ text, author, createdAt }) => {
    return (
        <div>
            <p>{text}</p>
            <small>
                By {author || "Anonymous"} on {createdAt.toLocaleString()}
            </small>
        </div>
    );
};

export default Comment;
