import { useState } from "react";
import { Comment as CommentModel } from "../storage/models/Comment";
import { VscClose, VscComment, VscTrash } from "react-icons/vsc";

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
    <div className="comment-box h-38 p-4 z-10">
      <div className="comment-header">
        <div className="comment-author">
          <img 
            className="comment-author-avatar" 
            src="https://placehold.co/40x40" 
            alt="User avatar"
          />
          <div>
            <div className="comment-authorname">Albert Flores</div>
            <div className="comment-date">{new Date(selectedComment.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} {new Date(selectedComment.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false })}</div>
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
      <div className="comment-content">
        {selectedComment?.contents || ""}
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
  )

}