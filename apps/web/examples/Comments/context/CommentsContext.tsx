import { createContext, useContext, ReactNode } from "react";
import { Comment } from "../storage/models/Comment";

type CommentsContextType = {
    comments: Comment[];
    onDeleteComment: (commentId: string) => void;
};

const CommentsContext = createContext<CommentsContextType | undefined>(undefined);

type CommentsProviderProps = {
    children: ReactNode;
    comments: Comment[];
    onDeleteComment: (commentId: string) => void;
};

export function CommentsProvider({ children, comments, onDeleteComment }: CommentsProviderProps) {
    return (
        <CommentsContext.Provider value={{ comments, onDeleteComment }}>
            {children}
        </CommentsContext.Provider>
    );
}

export function useComments() {
    const context = useContext(CommentsContext);
    if (context === undefined) {
        throw new Error("useComments must be used within a CommentsProvider");
    }
    return context;
}