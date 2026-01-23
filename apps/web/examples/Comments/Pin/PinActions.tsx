import CommentOverlay from "../Comment/CommentOverlay";
import PinDeleteButton from "./PinDeleteButton";
import { useComments } from "../context/CommentsContext";

type PinActionsProps = {
    handleClose: () => void;
    handleAddComment: () => void;
    handleDeletePin: () => void;
    annotationId: string;
};

export default function PinActions({ handleClose, handleAddComment, handleDeletePin, annotationId }: PinActionsProps) {
    const { comments, onDeleteComment } = useComments();
    const annotationComments = comments.filter(comment => comment.annotation_id === annotationId);

    return (
        <div>
            <PinDeleteButton onDelete={handleDeletePin} />
            <CommentOverlay 
                comments={annotationComments} 
                onClose={handleClose} 
                onDelete={onDeleteComment} 
                onAddComment={handleAddComment}
            />
        </div>
    );
}
