import type { Comment as CommentModel } from "../storage/models/Comment";
import { useState } from "react";
import { VscClose, VscChevronDown, VscTrash } from "react-icons/vsc";
import { FaReply } from "react-icons/fa";

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
    return initials.slice(0, 2); 
}

export default function CommentSidebar({ comments, isOpen, onSelectComment, onDeleteComment, onReplyComment }: CommentSidebarProps) {
    const [selectedCommentId, setSelectedCommentId] = useState<string | null>(null);
    // For dropdown menu
    const [sortBy, setSortBy] = useState<SortOption>("page");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const commentThreads = comments.reduce((acc, comment) => {
        if (!acc[comment.annotation_id]) {
            acc[comment.annotation_id] = [];
        }
        acc[comment.annotation_id].push(comment);
        return acc;
    }, {} as Record<string, CommentModel[]>);

    const sortedThreads = Object.entries(commentThreads).map(([annotationId, threadComments]) => {
        const sortedThread = [...threadComments].sort((a, b) => {
            if (sortBy === "date") {
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            } else {
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            }
        });
        return { annotationId, comments: sortedThread };
    }).sort((a, b) => {
        const aDate = new Date(a.comments[0].created_at);
        const bDate = new Date(b.comments[0].created_at);
        return bDate.getTime() - aDate.getTime();
    });

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

            {sortedThreads.map(({ annotationId, comments: threadComments }) => {
                const sortedThreadComments = [...threadComments].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
                const firstComment = sortedThreadComments[0];
                const isSelected = selectedCommentId && sortedThreadComments.some(c => c.comment_id === selectedCommentId);
                return (
                    <div key={annotationId} className={`bg-white rounded p-3 mb-2 cursor-pointer hover:bg-gray-50 ${isSelected ? "bg-gray-50 border-[3px] shadow-sm" : "bg-white border-[1.50px] border-slate-300 shadow-[0px_3px_2px_0px_rgba(0,0,0,0.05)]"}`} style={isSelected ? { borderColor: '#C0CEDE' } : {}} onClick={() => handleSelectComment(firstComment.comment_id)}>
                        <div className="comment-header">
                            <div className="comment-author comment-author-sidebar">
                                <div 
                                    className="comment-author-avatar flex items-center justify-center bg-gray-300 text-white font-bold rounded-full mr-3" 
                                    style={{ width: "40px", height: "40px" }}
                                >
                                    {getInitials(firstComment.user_name)}
                                </div>
                                <div>
                                    <div className="comment-authorname cursor-text">{firstComment.user_name}</div>
                                    <div className="comment-date cursor-text">{new Date(firstComment.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} {new Date(firstComment.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false })}</div>
                                </div>
                            </div>
                            {isSelected && (
                                <div className="comment-actions">
                                    <VscTrash 
                                        onClick={(e) => { e.stopPropagation(); onDeleteComment(firstComment.comment_id); }} 
                                        className="comment-icon" 
                                    />
                                </div>
                            )}
                        </div>
                        <div className="mx-4 h-0 border-t border-slate-300 mb-3"></div>
                        <div className="comment-content cursor-text">
                            {isSelected ? sortedThreadComments.map((c, idx) => (
                                <div key={c.comment_id}>
                                    {idx > 0 && (
                                        <>
                                            <div className="my-4 -mx-4 w-[calc(100%+1.5rem)] border-t border-gray-300"></div>
                                            <div className="comment-header">
                                                <div className="comment-author comment-author-sidebar">
                                                    <div 
                                                        className="comment-author-avatar flex items-center justify-center bg-gray-300 text-white font-bold rounded-full mr-3" 
                                                        style={{ width: "40px", height: "40px" }}
                                                    >
                                                        {getInitials(c.user_name)}
                                                    </div>
                                                    <div>
                                                        <div className="comment-authorname cursor-text flex items-center gap-2">
                                                            {c.user_name}
                                                            <FaReply className="text-gray-500 -rotate-275 text-xs" />
                                                        </div>
                                                        <div className="comment-date cursor-text">{new Date(c.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} {new Date(c.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false })}</div>
                                                    </div>
                                                </div>
                                                <div className="comment-actions">
                                                    <VscTrash 
                                                        onClick={(e) => { e.stopPropagation(); onDeleteComment(c.comment_id); }} 
                                                        className="comment-icon" 
                                                    />
                                                </div>
                                            </div>
                                            <div className="mx-4 h-0 border-t border-slate-300 mb-3"></div>
                                        </>
                                    )}
                                    <div>{c.contents}</div>
                                </div>
                            )) : firstComment.contents.slice(0, 75) + (firstComment.contents.length > 75 ? '...' : '')}
                        </div>
                        {isSelected && (
                            <div className="comment-footer">
                                <div 
                                    onClick={(e) => { e.stopPropagation(); onReplyComment(firstComment.comment_id); }}
                                    className="comment-btn-container"
                                >
                                    <span className="comment-btn-text">Reply</span>
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}