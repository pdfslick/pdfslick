import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { TUsePDFSlickStore } from "@pdfslick/react";
import { AnnotationEditorType } from "pdfjs-dist";
import PinMenu from "./Toolbar/PinMenu";
import { VscPinnedDirty } from "react-icons/vsc";
import { getAnnotations, storeAnnotation, storeComment, deleteComment, deleteAnnotation, deleteCommentsFromAnnotation, getAnnotationFromComment, initDocuments } from "./storage/localStorage";
import { Annotation } from "./storage/models/Annotation";
import PinPlacement from "./Pin/PinPlacement";

type PinButtonProps = {
    usePDFSlickStore: TUsePDFSlickStore;
    refreshComments: () => void;
    selectedCommentId: string | null;
    replyCommentId: string | null;
    onReplyHandled: () => void;
    isCommentSidebarOpen: boolean;
    setIsCommentSidebarOpen: (s: boolean) => void;
};

export default function PinButton({ usePDFSlickStore, refreshComments, selectedCommentId, replyCommentId, onReplyHandled, isCommentSidebarOpen, setIsCommentSidebarOpen }: PinButtonProps) {
    const pdfSlick = usePDFSlickStore((s) => s.pdfSlick);
    const mode = usePDFSlickStore((s) => s.annotationEditorMode);
    const [pinColor, setPinColor] = useState("#ef4444");
    const [annotations, setAnnotations] = useState<Annotation[]>([]);
    const [openCommentPinId, setOpenCommentPinId] = useState<string | null>(null);
    const [selectedPinId, setSelectedPinId] = useState<string | null>(null);

    useEffect(() => {
        handleSelectComment(selectedCommentId);
    }, [selectedCommentId]);

    useEffect(() => {
        if (replyCommentId) {
            const annotation = getAnnotationFromComment(replyCommentId);
            if (annotation) {
                setOpenCommentPinId(annotation.annotation_id);
                setSelectedPinId(null); // Close any selected pin
                onReplyHandled();
            }
        }
    }, [replyCommentId, onReplyHandled]);

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

    useEffect(() => {
        initDocuments();
        const container = (pdfSlick as any)?.viewer?.container as HTMLElement | undefined;
        if (!container) return;
        const onClick = (e: MouseEvent) => {
            if (mode !== AnnotationEditorType.STAMP) return;
            
            if (openCommentPinId) {
                setOpenCommentPinId(null);
                return;
            }
            
            if (selectedPinId) {
                setSelectedPinId(null);
                return;
            }
            
            const x = e.clientX;
            const y = e.clientY;
            const numPages = pdfSlick?.document?.numPages ?? 0;
            for (let i = 0; i < numPages; i++) {
                const pageView = (pdfSlick as any).viewer?.getPageView?.(i);
                const div = pageView?.div as HTMLElement | undefined;
                if (!div) continue;
                const rect = div.getBoundingClientRect();
                if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
                    const px = ((x - rect.left) / rect.width) * 100;
                    const py = ((y - rect.top) / rect.height) * 100;
                    const newId = crypto.randomUUID();

                    const newAnnotation: Annotation = {
                        annotation_id: newId,
                        user_id: "null", //TODO: Get the user_id from the user that is logged in.
                        document_id: "null", //TODO: Get the document_id from the document that is open.
                        annotation_type: "pin", //TODO: Use the AnnotationType enum.
                        coordinates: `${px},${py}`,
                        page: i + 1,
                        color: "red", //TODO: Use the selected color from the color picker.
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                    };

                    storeAnnotation(newAnnotation);

                    setAnnotations((prev) => [
                        ...prev,
                        newAnnotation,
                    ]);
                    setOpenCommentPinId(newId);
                    break;
                }
            }
        };
        container.addEventListener("click", onClick);
        return () => container.removeEventListener("click", onClick);
    }, [pdfSlick, mode, openCommentPinId, selectedPinId, pinColor]);

    const togglePinsMode = () => {
        if (!pdfSlick) return;
        pdfSlick.setAnnotationEditorMode(
            mode === AnnotationEditorType.STAMP ? AnnotationEditorType.NONE : AnnotationEditorType.STAMP
        );
    };

    return (
        <>
            <div className="flex items-center rounded-sm">
                <button
                    type="button"
                    className={`enabled:hover:text-black text-slate-600 p-1 disabled:text-slate-300 rounded-sm transition-all relative focus:border-blue-400 focus:ring-0 focus:shadow outline-none border border-transparent hover:bg-slate-200/50 ${
                        isCommentSidebarOpen ? "bg-blue-100" : ""
                    }`}
                    onClick={() => setIsCommentSidebarOpen(!isCommentSidebarOpen)}
                >
                    <VscComment className="h-4 w-4" />
                </button>
                <div
                    className={`flex items-center rounded-sm group ${
                        mode === AnnotationEditorType.STAMP
                            ? "bg-blue-100"
                            : ""
                    }`}
                >
                    <button
                        type="button"
                        className="enabled:hover:text-black text-slate-600 p-1 disabled:text-slate-300 rounded-sm transition-all relative focus:border-blue-400 focus:ring-0 focus:shadow outline-none border border-transparent hover:bg-slate-200/50"
                        onClick={() => { togglePinsMode(); setAnnotations(getAnnotations()); }}
                    >
                        <BsPinAngle className="h-4 w-4" />
                    </button>
                    <PinMenu usePDFSlickStore={usePDFSlickStore} setPinColor={setPinColor} />
                </div>
            </div>
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
                        onSelect={() => { setSelectedPinId(annotation.annotation_id); setOpenCommentPinId(null); }}
                        onDeselect={() => setSelectedPinId(null)}
                        onRemove={() => setAnnotations(prev => prev.filter(a => a.annotation_id !== annotation.annotation_id))}
                        onCommentClose={() => setOpenCommentPinId(null)}
                        onCommentSubmit={(comment) => { storeComment(comment); refreshComments(); }}
                        onDeletePin={() => handleDeletePin(annotation.annotation_id)}
                        onDeleteComment={handleDelete}
                        onAddComment={handleAddComment}
                    />,
                    container
                );
            })}
        </>
    );
}
