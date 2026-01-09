import { Annotation } from "../storage/models/Annotation";
import { TUsePDFSlickStore } from "@pdfslick/react";
import { createPortal } from "react-dom";
import PinPlacement from "./PinPlacement";
import { Comment } from "../storage/models/Comment";

type PinLayerProps = {
    usePDFSlickStore: TUsePDFSlickStore;
    annotations: Annotation[];
    selectedPinId: string | null;
    openCommentPinId: string | null;
    onPinSelect: (annotationId: string) => void;
    onPinDeselect: () => void;
    onPinRemove: (annotationId: string) => void;
    onCommentClose: () => void;
    onCommentSubmit: (comment: Comment) => void;
    onDeletePin: (annotationId: string) => void;
    onDeleteComment: (commentId: string) => void;
    onAddComment: () => void;
    comments: Comment[];
};

export default function PinLayer({ usePDFSlickStore, annotations, selectedPinId, openCommentPinId, onPinSelect, onPinDeselect, onPinRemove, onCommentClose, onCommentSubmit, onDeletePin, onDeleteComment, onAddComment, comments }: PinLayerProps) {
    const pdfSlick = usePDFSlickStore((s) => s.pdfSlick);

    return (
        <div>
            {annotations.map((annotation) => {
                const pageView = (pdfSlick as any).viewer?.getPageView?.(annotation.page - 1);
                const container = pageView?.div as HTMLElement | undefined;
                if (!container) return null;
                return createPortal(
                    <PinPlacement
                        key={annotation.annotation_id}
                        annotation={annotation}
                        isSelected={selectedPinId === annotation.annotation_id}
                        isCommentOpen={openCommentPinId === annotation.annotation_id}
                        onSelect={() => { onPinSelect(annotation.annotation_id); }}
                        onDeselect={() => onPinDeselect()}
                        onRemove={() => onPinRemove(annotation.annotation_id)}
                        onCommentClose={() => onCommentClose()}
                        onCommentSubmit={onCommentSubmit}
                        onDeletePin={() => onDeletePin(annotation.annotation_id)}
                        onDeleteComment={onDeleteComment}
                        onAddComment={() => onAddComment()}
                        comments={comments.filter(c => c.annotation_id === annotation.annotation_id)}
                    />,
                    container
                );
            })}
        </div>
    );
}