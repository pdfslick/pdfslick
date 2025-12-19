import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { TUsePDFSlickStore } from "@pdfslick/react";
import { AnnotationEditorType } from "pdfjs-dist";
import Comment from "./Comment/Comment";
import { VscPinnedDirty, VscTrash } from "react-icons/vsc";
import PinMenu from "./Toolbar/PinMenu";
import { getAnnotations, getCommentsFromAnnotation, storeAnnotation, storeComment, deleteComment, deleteAnnotation, deleteCommentsFromAnnotation } from "./storage/localStorage";
import { initDocuments } from "./storage/localStorage";
import { Annotation } from "./storage/models/Annotation";
import FloatingComment from "./Comment/FloatingComment";

type PinButtonProps = {
    usePDFSlickStore: TUsePDFSlickStore;
    refreshComments: () => void;
};

export default function PinButton({ usePDFSlickStore, refreshComments }: PinButtonProps) {
    const pdfSlick = usePDFSlickStore((s) => s.pdfSlick);
    const mode = usePDFSlickStore((s) => s.annotationEditorMode);
    const [annotations, setAnnotations] = useState<Annotation[]>([]);
    const [openCommentPinId, setOpenCommentPinId] = useState<string | null>(null);
    const [selectedPinId, setSelectedPinId] = useState<string | null>(null);

    function handleClose() {
        console.log("handleClose from PinButton");
        setSelectedPinId(null);
    }

    function handleDelete(commentId: string) {
        console.log("handleDelete from PinButton");
        deleteComment(commentId);
        setSelectedPinId(null);
        refreshComments();
    }

    function handleDeletePin(pinId: string) {
        console.log("handleDeletePin from PinButton");
        deleteAnnotation(pinId);
        deleteCommentsFromAnnotation(pinId);
        setSelectedPinId(null);
        setAnnotations(getAnnotations());
        refreshComments();
    }

    useEffect(() => {
        initDocuments();
        const container = (pdfSlick as any)?.viewer?.container as HTMLElement | undefined;
        if (!container) return;
        const onClick = (e: MouseEvent) => {
            if (mode !== AnnotationEditorType.STAMP) return;
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
    }, [pdfSlick, mode]);

    const togglePinsMode = () => {
        if (!pdfSlick) return;
        pdfSlick.setAnnotationEditorMode(
            mode === AnnotationEditorType.STAMP ? AnnotationEditorType.NONE : AnnotationEditorType.STAMP
        );
    };

    return (
        <>
            <div
                className={`flex items-center rounded-sm group ${
                    mode === AnnotationEditorType.STAMP
                        ? "bg-blue-100"
                        : "hover:bg-slate-200/50"
                }`}
            >
                <button
                    type="button"
                    className="enabled:hover:text-black text-slate-600 p-1 disabled:text-slate-300 rounded-sm transition-all group relative focus:border-blue-400 focus:ring-0 focus:shadow outline-none border border-transparent"
                    onClick={() => { togglePinsMode(); setAnnotations(getAnnotations()); }}
                >
                    <VscPinnedDirty className="h-4 w-4" />
                </button>
                <PinMenu usePDFSlickStore={usePDFSlickStore} setPinColor={setPinColor} />
            </div>
            {annotations.map((annotation) => {
                const pageView = (pdfSlick as any).viewer?.getPageView?.(annotation.page - 1);
                const container = pageView?.div as HTMLElement | undefined;
                const [x, y] = annotation.coordinates.split(',').map(Number);
                if (!container) return null;
                return createPortal(
                    <div
                        key={annotation.annotation_id}
                        className="absolute"
                        style={{
                            top: `${y}%`,
                            left: `${x}%`,
                            transform: "translate(-50%, -50%)",
                            cursor: 'pointer'
                        }}
                        onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPinId(annotation.annotation_id);
                        }}
                        onContextMenu={(e) => { // onContextMenu = right click
                            e.preventDefault(); // stop the usual behaviour (open context menu)
                            e.stopPropagation();
                            setAnnotations((prev) => prev.filter((a) => a.annotation_id !== annotation.annotation_id)); // remove pin from array
                        }} // right click to delete (will be removed in the future)
                    >
                        <div>
                            <div style={{ width: 15, height: 15, borderRadius: "50%", background: pin.color }} />
                            <div onClick={(e) => e.stopPropagation()}>
                                <Comment isOpenend={openCommentPinId === annotation.annotation_id} annotationId={annotation.annotation_id} onClose={() => setOpenCommentPinId(null)} onSubmit={(comment) => { storeComment(comment); refreshComments(); }} />
                            </div>
                        </div>
                        {selectedPinId === annotation.annotation_id && ( // placeholder rectangle to delete pin
                        <div>
                            <div
                                style={{
                                    position: 'absolute',
                                    bottom: '20px',
                                    left: '20px',
                                    width: '30px',
                                    height: '30px',
                                    background: 'red',
                                    cursor: 'pointer'
                                }}
                                onClick={(e) => {
                                    e.stopPropagation(); // prevent triggering pin selection again from parent div
                                    handleDeletePin(annotation.annotation_id);
                                    setSelectedPinId(null);
                                }}
                            >
                                <VscTrash style={{width: '30px', height: '30px', color: 'white'}} />
                            </div>
                            <FloatingComment comments={getCommentsFromAnnotation(annotation.annotation_id)} onClose={() => handleClose()} onDelete={(commentId: string) => handleDelete(commentId)}/>
                        </div>
                        )}
                    </div>,
                    container
                );
            })}
        </>
    );
}
