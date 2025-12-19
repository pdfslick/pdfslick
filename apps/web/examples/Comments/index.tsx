import { useEffect, useState, useCallback } from "react";
import { usePDFSlick } from "@pdfslick/react";
import Toolbar from "./Toolbar";
import Thumbsbar from "./Thumbsbar";
import CommentSidebar from "./Comment/CommentSidebar";
import { getComments } from "./storage/localStorage";
import type { Comment as CommentModel } from "./storage/models/Comment";

type CommentsProps = {
  pdfFilePath: string;
};

export default function Comments({ pdfFilePath }: CommentsProps) {
  const [isThumbsbarOpen, setIsThumbsbarOpen] = useState(false);
  const [isCommentSidebarOpen, setIsCommentSidebarOpen] = useState(true);
  const [selectedCommentId, setSelectedCommentId] = useState<string | null>();
  const [loadedPerc, setLoadedPerc] = useState(0);
  const [comments, setComments] = useState<CommentModel[]>(getComments());

  const refreshComments = useCallback(() => {
    setComments(getComments());
  }, []);

  const handleSelectComment = useCallback((commentId: string) => {
    setSelectedCommentId(commentId);
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

  useEffect(() => {
    if (isDocumentLoaded) {
      setIsThumbsbarOpen(true);
    }
  }, [isDocumentLoaded]);

  return (
    <>
      <div className="absolute inset-0 bg-slate-200/70 flex flex-col pdfSlick">
        <Toolbar
          {...{ usePDFSlickStore, setIsThumbsbarOpen, isThumbsbarOpen, refreshComments, selectedCommentId: selectedCommentId ?? null }}
        />
        <div className="flex-1 flex">
          <Thumbsbar {...{ thumbsRef, usePDFSlickStore, isThumbsbarOpen }} />

          <div className="flex-1 relative h-full">
            <PDFSlickViewer {...{ viewerRef, usePDFSlickStore }} />
          </div>
          <CommentSidebar comments={comments} isOpen={isCommentSidebarOpen} onSelectComment={(commentId) => handleSelectComment(commentId)} />
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
