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
    const [comment, setComment] = useState("");

    function handleClose() {
        onClose();
        setComment("");
    }

    function handleSubmit() {
        const newComment: CommentModel = {
            comment_id: crypto.randomUUID(),
            annotation_id: annotationId,
            user_id: "null", //TODO: Get the user_id from the user that is logged in.
            contents: comment,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };

        onSubmit(newComment); 
        setComment("");
        handleClose();
    }
    
  return (
    <div className={`comment-box ${ 
        isOpened ? 'visible' : 'invisible'
      }`}>
        <div className="comment-title">Add a comment</div>
        <CgCloseO className="comment-close" onClick={handleClose} />
        <textarea className="comment-input" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Type here..." />
        <div className="comment-save" onClick={handleSubmit} />
        <div className="comment-save-text">Save</div>
  </div>
  )

}