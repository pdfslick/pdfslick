import { useState } from "react";
import { Comment as CommentModel } from "../storage/models/Comment";

type CommentProps = {
    isOpenend: boolean;
    annotationId: string;
    onClose: () => void;
    onSubmit: (newComment: CommentModel) => void;
};

export default function Comment({ isOpenend, annotationId, onClose, onSubmit }: CommentProps) {
    const [userName] = useState("Henk Janssen");
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
    <div className={`fixed left-4 top-4 bg-gray-800 z-10 p-3 rounded shadow-lg ${
        isOpenend ? 'visible' : 'invisible'
      }`}>
        <div className="flex justify-between items-center">
            <p className="text-white text-xs">{userName}</p>
            <p onClick={handleClose} className="cursor-pointer">❌</p>
        </div>
        <div className="flex flex-col">
            <input type="text" className="border border-slate-300 rounded p-2" value={comment} onChange={(e) => setComment(e.target.value)} onKeyDown={(e) => e.stopPropagation()} />
            <button className="bg-gray-600 hover:bg-gray-500 text-white mt-2 rounded" onClick={handleSubmit}>Submit</button>
        </div>
  </div>
  )

}