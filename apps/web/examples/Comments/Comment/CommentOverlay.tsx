import { Comment as CommentModel } from "../storage/models/Comment";
import { VscTrash } from "react-icons/vsc";
import { CgCloseO } from "react-icons/cg";
import { FaReply } from "react-icons/fa";

function getInitials(name: string) {
    if (!name) return "";
    const parts = name.split(" ");
    const initials = parts.map(part => part[0]?.toUpperCase()).join("");
    return initials.slice(0, 2); // Limit to 2 characters
}

type CommentOverlayProps = {
    comments: CommentModel[] | null;
    onClose: () => void;
    onDelete: (commentId: string) => void;
    onAddComment: () => void;
};

export default function CommentOverlay({ comments, onClose, onDelete, onAddComment }: CommentOverlayProps) {
    if (!comments || comments.length === 0) return null;

    const sortedComments = [...comments].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

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
            {sortedComments.map((comment, index) => (
                <div key={comment.comment_id}>
                    <div className="comment-header">
                        <div className="comment-author">
                            {/* Avatar with initials */}
                            <div 
                                className="comment-author-avatar flex items-center justify-center bg-gray-300 text-white font-bold rounded-full" 
                                style={{ width: "40px", height: "40px" }}
                            >
                                {getInitials(comment.user_id)} {/* TODO: fix this to be the user id or name */}
                            </div>
                            <div>
                                <div className="comment-authorname cursor-text flex items-center gap-2">
                                    {comment.user_id} {/* TODO: fix this to be the user */}
                                    {index > 0 && <FaReply className="text-gray-500 -rotate-275 text-xs" />}
                                </div>
                                <div className="comment-date cursor-text">{new Date(comment.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} {new Date(comment.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false })}</div>
                            </div>
                        </div>
                        <div className="comment-actions">
                            <VscTrash 
                                onClick={(e) => { e.stopPropagation(); handleDelete(comment.comment_id); }} 
                                className="comment-icon text-xl cursor-pointer" 
                            />
                            {index === 0 && (
                                <CgCloseO 
                                    onClick={(e) => { e.stopPropagation(); handleClose(); }} 
                                    className="comment-icon text-xl cursor-pointer" 
                                />
                            )}
                        </div>
                    </div>
                    <div className="comment-divider"></div>
                    <div className="comment-content cursor-text">
                        {comment.contents}
                    </div>
                    {index < sortedComments.length - 1 && <div className="my-2 -mx-4 w-[calc(100%+2rem)] border-t border-gray-300"></div>}
                </div>
            ))}
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