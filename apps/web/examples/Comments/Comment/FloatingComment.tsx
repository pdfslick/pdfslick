import { useState } from "react";
import { Comment as CommentModel } from "../storage/models/Comment";
import { VscClose, VscComment, VscTrash } from "react-icons/vsc";

function getInitials(name: string) {
    if (!name) return "";
    const parts = name.split(" ");
    const initials = parts.map(part => part[0]?.toUpperCase()).join("");
    return initials.slice(0, 2); // Limit to 2 characters
}

type FloatingCommentProps = {
    comments: CommentModel[] | null;
    onClose: () => void;
    onDelete: (commentId: string) => void;
    onAddComment: () => void;
};

export default function FloatingComment({ comments, onClose, onDelete, onAddComment }: FloatingCommentProps) {
    if (!comments || comments.length === 0) return null;
    const [selectedCommentId] = useState<string | null>(comments[0]?.comment_id ?? null);
    const selectedComment = comments.find(c => c.comment_id === selectedCommentId) || comments[0];

    function handleClose() {
        onClose();
    }

    function handleDelete(commentId: string) {
        onDelete(commentId);
    }

    function handleAddComment() {
        onAddComment();
    }


    return (
        <div className="comment-box flex flex-col p-4">
            <div className="comment-header">
                <div className="comment-author">
                    {/* Avatar with initials */}
                    <div 
                        className="comment-author-avatar flex items-center justify-center bg-gray-300 text-white font-bold rounded-full" 
                        style={{ width: "40px", height: "40px" }}
                    >
                        {getInitials(selectedComment.user_name)}
                    </div>
                    <div>
                        <div className="comment-authorname cursor-text">{selectedComment.user_name}</div>
                        <div className="comment-date cursor-text">{new Date(selectedComment.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} {new Date(selectedComment.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false })}</div>
                    </div>
                </div>
                <div className="comment-actions">
                    <VscTrash 
                        onClick={(e) => { e.stopPropagation(); handleDelete(selectedCommentId ?? ""); }} 
                        className="comment-icon text-xl cursor-pointer" 
                    />
                    <VscClose 
                        onClick={(e) => { e.stopPropagation(); handleClose(); }} 
                        className="comment-icon text-xl cursor-pointer" 
                    />
                </div>
            </div>
            <div className="comment-divider"></div>
            <div className="comment-content cursor-text">
                {selectedComment?.contents ? selectedComment.contents.slice(0, 70) + (selectedComment.contents.length > 70 ? '...' : '') : ""}
            </div>
            <div className="comment-footer">
                <div 
                    onClick={(e) => { e.stopPropagation(); handleAddComment(); }}
                    className="comment-btn-container"
                >
                    <span className="comment-btn-text">Reply</span>
                </div>
            </div>
        </div>
    );
}