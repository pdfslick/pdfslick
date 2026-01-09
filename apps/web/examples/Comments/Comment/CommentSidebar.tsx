import type { Comment as CommentModel } from "../storage/models/Comment";
import { useState } from "react";

type CommentSidebarProps = {
    comments: CommentModel[];
    isOpen: boolean;
    onSelectComment: (commentId: string | null) => void;
};

export default function CommentSidebar({ comments, isOpen, onSelectComment }: CommentSidebarProps) {
    const [selectedCommentId, setSelectedCommentId] = useState<string | null>(null);

    function handleSelectComment(commentId: string) {
        if (commentId === selectedCommentId) {
            setSelectedCommentId(null);
            onSelectComment(null);
            return;
        }

        setSelectedCommentId(commentId);
        onSelectComment(commentId);
    }

    if (!isOpen) return null;
    return (
        <div className="bg-gray-100 p-2 rounded-md shadow-md max-h-64 overflow-y-auto">
            <h1 className="text-large font-medium">Comments</h1>
                {comments.map((comment) => (
                    <div key={comment.comment_id} className={`border-b border-black-200 p-2 cursor-pointer hover:bg-gray-200 ${selectedCommentId === comment.comment_id ? "bg-gray-200" : "bg-white"}`} onClick={() => handleSelectComment(comment.comment_id)}>
                        <h1 className="text-sm font-medium">User: {comment.user_name}</h1>
                        <h2 className="text-sm font-small">Comment: {comment.contents}</h2>
                        <p className="text-xs text-gray-500">Created at: {comment.created_at}</p>
                    </div>  
                ))}
        </div>
    );
}