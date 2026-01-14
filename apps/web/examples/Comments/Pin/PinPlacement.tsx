import { Annotation } from "../storage/models/Annotation";
import { Comment } from "../storage/models/Comment";
import Pin from "./Pin";
import CommentForm from "../Comment/CommentForm";
import PinActions from "./PinActions";

type PinPlacementProps = {
    annotation: Annotation;
    isSelected: boolean;
    isCommentOpen: boolean;
    onSelect: () => void;
    onDeselect: () => void;
    onRemove: () => void;
    onCommentClose: () => void;
    onCommentSubmit: (comment: Comment) => void;
    onDeletePin: () => void;
    onAddComment: () => void;
};

export default function PinPlacement({ annotation, isSelected, isCommentOpen, onSelect, onDeselect, onRemove, onCommentClose, onCommentSubmit, onDeletePin, onAddComment }: PinPlacementProps) {
    const [x, y] = annotation.coordinates.split(',').map(Number);
    
    return (
        <div
            className="absolute"
            style={{
                top: `${y}%`,
                left: `${x}%`,
                transform: "translate(-50%, -50%)",
                cursor: 'pointer'
            }}
            onClick={(e) => {
                e.stopPropagation();
                onSelect();
            }}
            onContextMenu={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onRemove();
            }}
        >
            <div>
                <Pin color={annotation.color} />
                <div onClick={(e) => e.stopPropagation()}>
                    <CommentForm isOpenend={isCommentOpen} annotationId={annotation.annotation_id} onClose={onCommentClose} onSubmit={onCommentSubmit} />
                </div>
            </div>
            {isSelected && (
                <PinActions 
                    handleClose={onDeselect} 
                    handleAddComment={onAddComment} 
                    handleDeletePin={() => onDeletePin()} 
                    annotationId={annotation.annotation_id}
                />
            )}
        </div>
    );
}