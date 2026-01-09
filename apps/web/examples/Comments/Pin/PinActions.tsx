import CommentOverlay from "../Comment/CommentOverlay";
import { getCommentsFromAnnotation } from "../storage/localStorage";
import PinDeleteButton from "./PinDeleteButton";

type PinActionsProps = {
    handleClose: () => void;
    handleAddComment: () => void;
    handleDeletePin: () => void;
    handleDeleteComment: (commentId: string) => void;
    annotationId: string;
};

export default function PinActions({ handleClose, handleAddComment, handleDeletePin, handleDeleteComment, annotationId }: PinActionsProps) {
    return (
        <div>
            <PinDeleteButton onDelete={handleDeletePin} />
            <CommentOverlay 
                comments={getCommentsFromAnnotation(annotationId)} 
                onClose={handleClose} 
                onDelete={handleDeleteComment} 
                onAddComment={handleAddComment}
            />
        </div>
    );
}
