import type { Comment as CommentModel } from "../storage/models/Comment";
import { useState } from "react";
import { VscClose, VscChevronDown, VscTrash } from "react-icons/vsc";

type CommentSidebarProps = {
    comments: CommentModel[];
    isOpen: boolean;
    onSelectComment: (commentId: string | null) => void;
    onDeleteComment: (commentId: string) => void;
    onReplyComment: (commentId: string) => void;
};

type SortOption = "date" | "page";

function getInitials(name: string) {
    if (!name) return "";
    const parts = name.split(" ");
    const initials = parts.map(part => part[0]?.toUpperCase()).join("");
    return initials.slice(0, 2); // Limit to 2 characters
}

export default function CommentSidebar({ comments, isOpen, onSelectComment, onDeleteComment, onReplyComment }: CommentSidebarProps) {
    const [selectedCommentId, setSelectedCommentId] = useState<string | null>(null);
    // For dropdown menu
    const [sortBy, setSortBy] = useState<SortOption>("page");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
        <div className="comments-panel">

            <VscClose className="comments-panel-close" />
            <h1 className="w-32 h-7 justify-start text-xl font-normal font-['Inter']" style={{ color: '#100F0F' }}>Comments</h1>
            
            <div className="mt-6 mb-4 flex items-center gap-2">
                <div className="text-base" style={{ color: '#45556C' }}>Sort by:</div>
                
                {/* Dropdown menu */}
                <div className="relative ml-2">
                    <button
                        className="w-40 h-8 bg-white rounded-sm border border-[#CAD5E2] flex items-center justify-between px-2 hover:bg-gray-50"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                        <span className="text-sm font-light font-['Inter'] text-neutral-500 capitalize">{sortBy}</span>
                        <VscChevronDown className="w-3 h-3" style={{ color: '#696969' }} />
                    </button>
                    {isDropdownOpen && (
                        <div className="absolute top-full mt-1 w-40 bg-white rounded-sm border border-[#CAD5E2] shadow-lg z-10">
                            <button
                                className="w-full px-3 py-1 justify-start text-neutral-500 text-sm font-light font-['Inter'] text-left hover:bg-gray-100"
                                onClick={() => {
                                    setSortBy("date");
                                    setIsDropdownOpen(false);
                                }}
                            >
                                Date
                            </button>
                            <button
                                className="w-full px-3 py-1 justify-start text-neutral-500 text-sm font-light font-['Inter'] text-left hover:bg-gray-100"
                                onClick={() => {
                                    setSortBy("page");
                                    setIsDropdownOpen(false);
                                }}
                            >
                                Page
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {comments.map((comment) => (
                <div key={comment.comment_id} className={`bg-white rounded shadow-[0px_3px_2px_0px_rgba(0,0,0,0.05)] border-[1.50px] border-slate-300 p-3 mb-2 cursor-pointer hover:bg-gray-50 ${selectedCommentId === comment.comment_id ? "bg-gray-50" : "bg-white"}`} onClick={() => handleSelectComment(comment.comment_id)}>
                    <div className="comment-header">
                        <div className="comment-author">
                            <div 
                                className="comment-author-avatar flex items-center justify-center bg-gray-300 text-white font-bold rounded-full mr-3" 
                                style={{ width: "40px", height: "40px" }}
                            >
                                {getInitials(comment.user_name)}
                            </div>
                            <div>
                                <div className="comment-authorname cursor-text">{comment.user_name}</div>
                                <div className="comment-date cursor-text">{new Date(comment.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} {new Date(comment.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false })}</div>
                            </div>
                        </div>
                        {selectedCommentId === comment.comment_id && (
                            <div className="comment-actions">
                                <VscTrash 
                                    onClick={(e) => { e.stopPropagation(); onDeleteComment(comment.comment_id); }} 
                                    className="comment-icon" 
                                />
                            </div>
                        )}
                    </div>
                    <div className="comment-divider w-full"></div>
                    <div className="comment-content cursor-text">
                        {selectedCommentId === comment.comment_id ? comment.contents : comment.contents.slice(0, 75) + (comment.contents.length > 75 ? '...' : '')}
                    </div>
                    {selectedCommentId === comment.comment_id && (
                        <div className="comment-footer">
                            <div 
                                onClick={(e) => { e.stopPropagation(); onReplyComment(comment.comment_id); }}
                                className="comment-btn-container"
                            >
                                <span className="comment-btn-text">Reply</span>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}