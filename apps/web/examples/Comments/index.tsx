import { useEffect, useState, useCallback } from "react";
import { usePDFSlick } from "@pdfslick/react";
import Toolbar from "./Toolbar";
import Thumbsbar from "./Thumbsbar";
import CommentSidebar from "./Comment/CommentSidebar";
import { getComments, deleteComment } from "./storage/localStorage";
import type { Comment as CommentModel } from "./storage/models/Comment";
import { AnnotationEditorType } from "pdfjs-dist";
import { getAnnotations, storeAnnotation, storeComment, deleteComment, deleteAnnotation, deleteCommentsFromAnnotation, getAnnotationFromComment } from "./storage/localStorage";
import { Annotation } from "./storage/models/Annotation";
import PinLayer from "./Pin/PinLayer";
import usePinPlacement from "./Pin/hooks/usePinPlacement";

type CommentsProps = {
  pdfFilePath: string;
};

export default function Comments({ pdfFilePath }: CommentsProps) {
  const [isThumbsbarOpen, setIsThumbsbarOpen] = useState(false);
  const [isCommentSidebarOpen, setIsCommentSidebarOpen] = useState(true);
  const [selectedCommentId, setSelectedCommentId] = useState<string | null>();
  const [replyCommentId, setReplyCommentId] = useState<string | null>();
  const [loadedPerc, setLoadedPerc] = useState(0);
  const [comments, setComments] = useState<CommentModel[]>(getComments());
  const [pinColor, setPinColor] = useState("#ef4444");
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [openCommentPinId, setOpenCommentPinId] = useState<string | null>(null);
  const [selectedPinId, setSelectedPinId] = useState<string | null>(null);

  const refreshComments = useCallback(() => {
    setComments(getComments());
  }, []);

  const handleSelectComment = useCallback((commentId: string | null) => {
    setSelectedCommentId(commentId);
  }, []);

  const handleDeleteComment = useCallback((commentId: string) => {
    deleteComment(commentId);
    refreshComments();
  }, [refreshComments]);

  const handleReplyComment = useCallback((commentId: string) => {
    setReplyCommentId(commentId);
  }, []);

  const {
    isDocumentLoaded,
    viewerRef,
    thumbsRef,
    usePDFSlickStore,
    PDFSlickViewer,
  } = usePDFSlick(pdfFilePath, {
    getDocumentParams: {
      disableAutoFetch: false, /** pages need to be loaded for printing, otherwise we get `Expected print service to be initialized.` */
      disableFontFace: false,
      disableRange: false,
      disableStream: true,
      verbosity: 0
    },
    onProgress: ({ total, loaded }) => {
      setLoadedPerc((100 * loaded) / total);
    },
  });

  const pdfSlick = usePDFSlickStore((s) => s.pdfSlick);
  const mode = usePDFSlickStore((s) => s.annotationEditorMode);

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

  function handleDeleteComment(commentId: string) {
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
      setSelectedPinId(null);
  }

  const togglePinsMode = () => {
      if (!pdfSlick) return;
      pdfSlick.setAnnotationEditorMode(
          mode === AnnotationEditorType.STAMP ? AnnotationEditorType.NONE : AnnotationEditorType.STAMP
      );
  };

  useEffect(() => {
    if (isDocumentLoaded) {
      setIsThumbsbarOpen(true);
    }
  }, [isDocumentLoaded]);

  useEffect(() => {
    if (selectedCommentId == null) {
      setSelectedPinId(null);
      return;
    }

    const annotation = getAnnotationFromComment(selectedCommentId);
    if (annotation) {
      setSelectedPinId(annotation.annotation_id);
    }
  }, [selectedCommentId]);

  return (
    <>
      <div className="absolute inset-0 bg-slate-200/70 flex flex-col pdfSlick">
        <Toolbar
          {...{ usePDFSlickStore, setIsThumbsbarOpen, isThumbsbarOpen, isPinModeActive: mode === AnnotationEditorType.STAMP, onPinToggle: () => { togglePinsMode(); setAnnotations(getAnnotations()); }, setPinColor: setPinColor }}
        />
        <div className="flex-1 flex relative">
          <Thumbsbar {...{ thumbsRef, usePDFSlickStore, isThumbsbarOpen }} />

          <div className="flex- h-full">
            <PDFSlickViewer {...{ viewerRef, usePDFSlickStore }} />
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
            onDeleteComment={handleDeleteComment}
            onAddComment={handleAddComment}
            comments={comments}
            />
          </div>
          <CommentSidebar comments={comments} isOpen={isCommentSidebarOpen} onClose={() => setIsCommentSidebarOpen(false)} onSelectComment={handleSelectComment} onDeleteComment={handleDeleteComment} onReplyComment={handleReplyComment} />
        </div>
      </div>
      {loadedPerc < 100 && (
        <div
          className="fixed top-0 left-0 h-px bg-blue-600 z-50 transition-all duration-150 ease-out"
          style={{ width: `${loadedPerc}%` }}
        ></div>
      )}
    </>
  );
}
