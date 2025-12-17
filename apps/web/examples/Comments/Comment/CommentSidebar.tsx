import type { Comment as CommentModel } from "../storage/models/Comment";

type CommentSidebarProps = {
    comments: CommentModel[];
    isOpen: boolean;
};

export default function CommentSidebar({ comments, isOpen }: CommentSidebarProps) {
    if (!isOpen) return null;
    return (
        <div className="bg-gray-100 p-2 rounded-md shadow-md max-h-64 overflow-y-auto">
            <h1 className="text-large font-medium">Comments</h1>
                {comments.map((comment) => (
                    <div key={comment.comment_id} className="border-b border-black-200 p-2">
                        <h1 className="text-sm font-medium">User: {comment.user_id}</h1>
                        <h2 className="text-sm font-small">Comment: {comment.contents}</h2>
                        <p className="text-xs text-gray-500">Created at: {comment.created_at}</p>
                    </div>
                ))}
        </div>
    );
}