import CommentOverlay from "../Comment/CommentOverlay";
import { getCommentsFromAnnotation } from "../storage/localStorage";
import PinDeleteButton from "./PinDeleteButton";

type PinActionsProps = {
    handleClose: () => void;
    handleAddComment: () => void;
    handleDeletePin: (annotationId: string) => void;
    handleDeleteComment: (commentId: string) => void;
    setSelectedPinId: (annotationId: string | null) => void;
    selectedPinId: string | null;
    annotationId: string;
};

export default function PinActions({ handleClose, handleAddComment, handleDeletePin, handleDeleteComment, setSelectedPinId, selectedPinId, annotationId }: PinActionsProps) {
    return (
        <div>
        {selectedPinId === annotationId && (
            <div>
                <PinDeleteButton handleDeletePin={handleDeletePin} setSelectedPinId={setSelectedPinId} annotationId={annotationId} />
                <CommentOverlay comments={getCommentsFromAnnotation(annotationId)} onClose={() => handleClose()} onDelete={(commentId: string) => handleDeleteComment(commentId)} onAddComment={() => handleAddComment()}/>
            </div>
        )}
        </div>
    )}
