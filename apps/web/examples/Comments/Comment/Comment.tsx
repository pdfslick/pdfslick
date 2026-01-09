import { useState } from "react";
import { CgCloseO } from "react-icons/cg";
import { Comment as CommentModel } from "../storage/models/Comment";

type CommentProps = {
    isOpened: boolean;
    annotationId: string;
    onClose: () => void;
    onSubmit: (newComment: CommentModel) => void;
};

export default function Comment({ isOpened, annotationId, onClose, onSubmit }: CommentProps) {
    const [userName, setUserName] = useState("");
    const [comment, setComment] = useState("");

    function handleClose() {
        onClose();
        setComment("");
        setUserName("");
    }

    function handleSubmit() {
        const newComment: CommentModel = {
            comment_id: crypto.randomUUID(),
            annotation_id: annotationId,
            user_name: userName,
            contents: comment,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };

        onSubmit(newComment); 
        setComment("");
        handleClose();
    }
    
  return (
    <div className={`comment-box flex flex-col p-4 ${ 
        isOpened ? 'visible' : 'invisible'
      }`}>
        <div className="flex justify-between items-center mb-4">
            <div className="comment-title">Add a comment</div>
            <CgCloseO className="comment-close cursor-pointer" onClick={handleClose} />
        </div>
        <input 
            className="comment-name-input mb-2" 
            type="text" 
            value={userName} 
            onChange={(e) => setUserName(e.target.value)} 
            onKeyDown={(e) => {
                if (e.key === " ") {
                    e.stopPropagation();
                }
            }} 
            placeholder="Your name..." 
        />
        <textarea className="comment-input mb-4" value={comment} onChange={(e) => setComment(e.target.value)} onKeyDown={(e) => { e.stopPropagation(); if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(); } }} placeholder="Type here..." />
        <div className="flex justify-end">
            <div className="comment-btn-container" onClick={handleSubmit}>
                <div className="comment-btn" />
                <div className="comment-btn-text">Save</div>
            </div>
        </div>
  </div>
  )

}