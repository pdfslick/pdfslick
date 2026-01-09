import CommentOverlay from "../Comment/CommentOverlay";
import PinDeleteButton from "./PinDeleteButton";
import { Comment } from "../storage/models/Comment";

type PinActionsProps = {
    handleClose: () => void;
    handleAddComment: () => void;
    handleDeletePin: () => void;
    handleDeleteComment: (commentId: string) => void;
    annotationId: string;
    comments: Comment[];
};

export default function PinActions({ handleClose, handleAddComment, handleDeletePin, handleDeleteComment, comments }: PinActionsProps) {
    return (
        <div>
            <PinDeleteButton onDelete={handleDeletePin} />
            <CommentOverlay 
                comments={comments} 
                onClose={handleClose} 
                onDelete={handleDeleteComment} 
                onAddComment={handleAddComment}
            />
        </div>
    );
}
