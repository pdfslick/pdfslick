import { useState } from "react";
import { Comment as CommentModel } from "../storage/models/Comment";
import { VscClose, VscTrash } from "react-icons/vsc";

type FloatingCommentProps = {
    comments: CommentModel[] | null;
    onClose: () => void;
    onDelete: (commentId: string) => void;
};

export default function FloatingComment({ comments, onClose, onDelete }: FloatingCommentProps) {
    if (!comments) return null;
    const [selectedCommentId] = useState<string | null>(comments[0]?.comment_id ?? null);

    function handleClose() {
        onClose();
    }

    function handleDelete(commentId: string) {
        onDelete(commentId);
    }

  return (
    <div>
        <div className="fixed left-4 top-4 bg-gray-800 z-10 p-3 rounded shadow-lg text-white">
            <div className="flex justify-between gap-4">
                <div onClick={(e) => { e.stopPropagation(); handleClose(); }} className="cursor-pointer">
                    <VscClose className="h-4 w-4" />
                </div>
                <div onClick={(e) => { e.stopPropagation(); handleDelete(selectedCommentId ?? ""); }} className="cursor-pointer">
                    <VscTrash className="h-4 w-4" onClick={() => handleDelete(selectedCommentId ?? "")} />
                </div>
            </div>
            {comments.map((comment) => (
                <div key={comment.comment_id}>
                    <h6 className="text-small m-4">{comment.contents}</h6>
                </div>
            ))}
        </div>
    </div>
    
  )

}