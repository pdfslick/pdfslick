import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { TUsePDFSlickStore } from "@pdfslick/react";
import { AnnotationEditorType } from "pdfjs-dist";
import Comment from "./Comment/Comment";
import { VscTrash, VscComment } from "react-icons/vsc";
import PinMenu from "./Toolbar/PinMenu";
import { BsPinAngle } from "react-icons/bs";
import { IoMdPin } from "react-icons/io";
import { getAnnotations, getCommentsFromAnnotation, storeAnnotation, storeComment, deleteComment, deleteAnnotation, deleteCommentsFromAnnotation, getAnnotationFromComment } from "./storage/localStorage";
import { initDocuments } from "./storage/localStorage";
import { Annotation } from "./storage/models/Annotation";
import FloatingComment from "./Comment/FloatingComment";

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
    const [selectedPinId, setSelectedPinId] = useState<string | null>();

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
                const [x, y] = annotation.coordinates.split(',').map(Number);
                if (!container) return null;
                return createPortal(
                    <div
                        key={annotation.annotation_id}
                        className="absolute z-[100002]"
                        style={{
                            top: `${y}%`,
                            left: `${x}%`,
                            transform: "translate(-50%, -50%)",
                            cursor: 'pointer'
                        }}
                        onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPinId(annotation.annotation_id);
                            setOpenCommentPinId(null);
                        }}
                        onContextMenu={(e) => { // onContextMenu = right click
                            e.preventDefault(); // stop the usual behaviour (open context menu)
                            e.stopPropagation();
                            setAnnotations((prev) => prev.filter((a) => a.annotation_id !== annotation.annotation_id)); // remove pin from array
                        }} // right click to delete (will be removed in the future)
                    >
                        <div>
                            <IoMdPin style={{ fontSize: '24px', color: annotation.color, filter: 'drop-shadow(0px 2px 2px rgba(0,0,0,0.25))' }} />
                            <div onClick={(e) => e.stopPropagation()}>
                                <Comment isOpened={openCommentPinId === annotation.annotation_id} annotationId={annotation.annotation_id} onClose={() => setOpenCommentPinId(null)} onSubmit={(comment) => { storeComment(comment); refreshComments(); }} />
                            </div>
                        </div>
                        {selectedPinId === annotation.annotation_id && ( // placeholder rectangle to delete pin
                        <div>
                            <div
                                style={{
                                    position: 'absolute',
                                    bottom: '15px',
                                    left: '15px',
                                    width: '30px',
                                    height: '30px',
                                    background: '',
                                    cursor: 'pointer'
                                }}
                                onClick={(e) => {
                                    e.stopPropagation(); // prevent triggering pin selection again from parent div
                                    handleDeletePin(annotation.annotation_id);
                                    setSelectedPinId(null);
                                }}
                            >
                                <VscTrash style={{width: '25px', height: '25px', color: '#6b7e98', background: '#e3e6eb', borderRadius: '5%', border: '1px solid #6b7e98', padding: '5px', justifyContent: 'center', alignItems: 'center'}} />
                            </div>
                            <FloatingComment comments={getCommentsFromAnnotation(annotation.annotation_id)} onClose={() => handleClose()} onDelete={(commentId: string) => handleDelete(commentId)} onAddComment={() => handleAddComment()}/>
                        </div>
                        )}
                    </div>,
                    container
                );
            })}
        </>
    );
}
