import type { Comment as CommentModel } from "../storage/models/Comment";
import { useState } from "react";
import { CgCloseO } from "react-icons/cg";

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
        <div className="comments-panel p-6 overflow-y-auto">

            <CgCloseO className="comments-panel-close" />
            <h1 className="w-32 h-7 justify-start text-xl font-normal font-['Inter']" style={{ color: '#100F0F' }}>Comments</h1>
            
            <div className="mt-6 mb-4 flex items-center gap-2">
                <div className="text-base" style={{ color: '#45556C' }}>Sort by:</div>
                <div className="w-40 h-8 bg-white rounded-sm border border-[#CAD5E2] ml-2" />
            </div>

            {comments.map((comment) => (
                <div key={comment.comment_id} className={`border-b border-black-200 p-2 cursor-pointer hover:bg-gray-200 ${selectedCommentId === comment.comment_id ? "bg-gray-200" : "bg-white"}`} onClick={() => handleSelectComment(comment.comment_id)}>
                    <h1 className="text-sm font-medium">User: {comment.user_id}</h1>
                    <h2 className="text-sm font-small">Comment: {comment.contents}</h2>
                    <p className="text-xs text-gray-500">Created at: {comment.created_at}</p>
                </div>
            ))}
        </div>
    );
}