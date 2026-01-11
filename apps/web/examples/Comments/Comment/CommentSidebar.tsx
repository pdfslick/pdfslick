import type { Comment as CommentModel } from "../storage/models/Comment";
import { useState } from "react";
import { VscClose, VscChevronDown } from "react-icons/vsc";

type CommentSidebarProps = {
    comments: CommentModel[];
    isOpen: boolean;
    onSelectComment: (commentId: string | null) => void;
};

type SortOption = "date" | "page";

export default function CommentSidebar({ comments, isOpen, onSelectComment }: CommentSidebarProps) {
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
                <div key={comment.comment_id} className={`border-b border-black-200 p-2 cursor-pointer hover:bg-gray-200 ${selectedCommentId === comment.comment_id ? "bg-gray-200" : "bg-white"}`} onClick={() => handleSelectComment(comment.comment_id)}>
                    <h1 className="text-sm font-medium">User: {comment.user_name}</h1>
                    <h2 className="text-sm font-small">Comment: {comment.contents}</h2>
                    <p className="text-xs text-gray-500">Created at: {comment.created_at}</p>
                </div>
            ))}
        </div>
    );
}