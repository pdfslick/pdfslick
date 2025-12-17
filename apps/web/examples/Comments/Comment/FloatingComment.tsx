import { useState } from "react";
import { Comment as CommentModel } from "../storage/models/Comment";

type FloatingCommentProps = {
    comments: CommentModel[] | null;
};

export default function FloatingComment({ comments }: FloatingCommentProps) {
    if (!comments) return null;
    const [isOpen, setIsOpen] = useState(false);
    const [isDeleted, setIsDeleted] = useState(false);

    function handleClose() {
        setIsOpen(false);
    }

    function handleDelete() {
        setIsDeleted(true);
    }

  return (
    <div>
        <div className="fixed left-4 top-4 bg-gray-800 z-10 p-3 rounded shadow-lg text-white">
            <div onClick={handleClose} className="cursor-pointer">X Close</div>
            <div onClick={handleDelete} className="cursor-pointer">Delete</div>
            {comments.map((comment) => (
                <div key={comment.comment_id}>
                    <p>{comment.contents}</p>
                </div>
            ))}
        </div>
    </div>
    
  )

}