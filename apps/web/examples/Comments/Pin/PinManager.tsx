import { useEffect, useState } from "react";
import type { TUsePDFSlickStore } from "@pdfslick/react";
import { AnnotationEditorType } from "pdfjs-dist";
import { getAnnotations, storeAnnotation, deleteComment, deleteAnnotation, deleteCommentsFromAnnotation, getAnnotationFromComment, storeComment } from "../storage/localStorage";
import { Annotation } from "../storage/models/Annotation";
import { Comment } from "../storage/models/Comment";
import usePinPlacement from "../Pin/hooks/usePinPlacement";
import PinLayer from "../Pin/PinLayer";
import PinButton from "../PinButton";

type PinManagerProps = {
    usePDFSlickStore: TUsePDFSlickStore;
    refreshComments: () => void;
    selectedCommentId: string | null;
    comments: Comment[];
};

export default function PinManager({ usePDFSlickStore, refreshComments, selectedCommentId, comments }: PinManagerProps) {
    const pdfSlick = usePDFSlickStore((s) => s.pdfSlick);
    const mode = usePDFSlickStore((s) => s.annotationEditorMode);
    const [pinColor, setPinColor] = useState("#ef4444"); // Default red color
    const [annotations, setAnnotations] = useState<Annotation[]>([]);
    const [openCommentPinId, setOpenCommentPinId] = useState<string | null>(null);
    const [selectedPinId, setSelectedPinId] = useState<string | null>(null);

    usePinPlacement({
        usePDFSlickStore,
        pinColor,
        isInteracting: !!(openCommentPinId || selectedPinId),
        onPinPlaced: (annotation) => {
            storeAnnotation(annotation);
            setAnnotations(prev => [...prev, annotation]);
            setOpenCommentPinId(annotation.annotation_id);
        },
        onBackgroundClick: () => {
            if (openCommentPinId) {
                setOpenCommentPinId(null);
            } else if (selectedPinId) {
                setSelectedPinId(null);
            }
        },
    });

    useEffect(() => {
        handleSelectComment(selectedCommentId);
    }, [selectedCommentId]);

    function handleSelectComment(commentId: string | null) {
        if (commentId == null) {
            setSelectedPinId(null);
            return;
        }

        const annotation = getAnnotationFromComment(commentId);
        if (annotation) {
            setSelectedPinId(annotation.annotation_id);
        }
    }
    function handleClose() {
        setSelectedPinId(null);
    }

    function handleDelete(commentId: string) {
        deleteComment(commentId);
        setSelectedPinId(null);
        refreshComments();
    }

    function handleDeletePin(pinId: string) {
        deleteAnnotation(pinId);
        deleteCommentsFromAnnotation(pinId);
        setSelectedPinId(null);
        setAnnotations(getAnnotations());
        refreshComments();
    }

    function handleAddComment() {
        setOpenCommentPinId(selectedPinId ?? "");
        handleClose();
    }

    const togglePinsMode = () => {
        if (!pdfSlick) return;
        pdfSlick.setAnnotationEditorMode(
            mode === AnnotationEditorType.STAMP ? AnnotationEditorType.NONE : AnnotationEditorType.STAMP
        );
    };

    return (
        <div>
            <PinButton 
                isActive={mode === AnnotationEditorType.STAMP} 
                onToggle={() => { togglePinsMode(); setAnnotations(getAnnotations()); }} 
                usePDFSlickStore={usePDFSlickStore} 
                setPinColor={setPinColor} 
            />
            <PinLayer 
                usePDFSlickStore={usePDFSlickStore}
                annotations={annotations}
                selectedPinId={selectedPinId}
                openCommentPinId={openCommentPinId}
                onPinSelect={(id) => { setSelectedPinId(id); setOpenCommentPinId(null); }}
                onPinDeselect={() => setSelectedPinId(null)}
                onPinRemove={(id) => setAnnotations(prev => prev.filter(a => a.annotation_id !== id))}
                onCommentClose={() => setOpenCommentPinId(null)}
                onCommentSubmit={(comment) => { storeComment(comment); refreshComments(); }}
                onDeletePin={handleDeletePin}
                onDeleteComment={handleDelete}
                onAddComment={handleAddComment}
                comments={comments}
            />
        </div>
    
    );
}